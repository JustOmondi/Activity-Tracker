from django.urls import reverse
from django.utils import timezone
from rest_framework import status

from structure.tests.test_models import create_all_reports_for_week
from reports.models import Report
from structure.models import Department, Member, Subgroup

from reports.constants import LESSON, REPORT_NAMES
import pytest

def create_all_reports_for_every_day(member, last_week):
    now = timezone.localtime(timezone.now())    

    for report_name in REPORT_NAMES:
        for i in range(1,8):     
            start_of_week = now - timezone.timedelta(days=now.weekday())

            if last_week:
                start_of_week = start_of_week - timezone.timedelta(days=7)
                
            day = start_of_week + timezone.timedelta(days=i-1)

            report = Report.objects.create(
                name=report_name,
                member=member,
                value=True,
                report_date=day.date()
            )

            report.created = day
            report.save()

@pytest.mark.django_db
class TestGetAllMemberReportsByWeek:
    @pytest.fixture
    def department(self, db):
        department = Department.objects.create(department_number=9)
        return department

@pytest.mark.django_db
class TestGetDepartmentWeekReport:
    @pytest.fixture
    def department(self, db):
        department = Department.objects.create(department_number=9)
        return department
    
    def test_get_department_reports_by_week(self, client, department):
        subgroup = Subgroup.objects.create(subgroup_number=2, department=department)

        member1 = Member.objects.create(full_name='John Doe', subgroup=subgroup)
        member2 = Member.objects.create(full_name='Jane Wilson', subgroup=subgroup)

        create_all_reports_for_week(member1, lastweek=True)
        create_all_reports_for_week(member2, lastweek=True)

        create_all_reports_for_week(member1, lastweek=False)
        create_all_reports_for_week(member2, lastweek=False)

        url = f'{reverse("department_reports_by_week")}?dept_number={department.department_number}'
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK

        this_week_expected = {}
        last_week_expected = {}

        current_weekday = timezone.localtime(timezone.now()).isoweekday()

        for report_name in REPORT_NAMES:
            this_week_expected[report_name] = {}
            last_week_expected[report_name] = {}

            for i in range(1, 8):
                if(i <= current_weekday): 
                    this_week_expected[report_name][i] = 2
                else:
                    this_week_expected[report_name][i] = 0
                
                last_week_expected[report_name][i] = 2
        
        assert response.data['this_week'] == this_week_expected
        # assert response.data['last_week'] == last_week_expected

    def test_get_department_week_report_with_nonexistent_department(self, client):
        url = f'{reverse("department_reports_by_week")}?dept_number=999999999'
        response = client.get(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND

@pytest.mark.django_db
class TestUpdateMemberReport:
    def test_update_existing_report(self, client):
        """
        Test updating an existing report with a valid member name, report name, and update value.
        """
        department = Department.objects.create(department_number=9)
        subgroup = Subgroup.objects.create(subgroup_number=2, department=department)

        member1 = Member.objects.create(full_name='John Doe', subgroup=subgroup)

        report = Report.objects.create(
            name=LESSON,
            member=member1,
            value=False,
            report_date=timezone.localtime(timezone.now()).date()
        )
        
        # Make sure there is an existing report
        assert Report.objects.count() == 1

        url = f'{reverse("update_member_report")}?member_name={member1.underscore_name}&report_name={LESSON}&value=1&day={report.report_date.isoweekday()}'

        response = client.post(url)

        # Check response status code and report value
        assert response.status_code == status.HTTP_200_OK
        report.refresh_from_db()
        assert report.value == True

        # Update the report value
        url = f'{reverse("update_member_report")}?member_name={member1.underscore_name}&report_name={LESSON}&value=0&day={report.report_date.isoweekday()}'
        response = client.post(url)

        # Check response status code and report value
        assert response.status_code == status.HTTP_200_OK
        report.refresh_from_db()
        assert report.value == False

    def test_create_new_report(self, client):
        """
        Test creating a new report with a valid member name, report name, and update value.
        """
        tz_aware_now = timezone.localtime(timezone.now())

        department = Department.objects.create(department_number=9)
        subgroup = Subgroup.objects.create(subgroup_number=2, department=department)

        member1 = Member.objects.create(full_name='John Doe', subgroup=subgroup)

        # Make sure the existing report is deleted
        assert Report.objects.count() == 0

        url = f'{reverse("update_member_report")}?member_name={member1.underscore_name}&report_name={LESSON}&value=1&day={tz_aware_now.isoweekday()}'

        response = client.post(url)

        # Check response status code and report count
        assert response.status_code == status.HTTP_200_OK

        expected_report = Report.objects.get(name=LESSON, member=member1)
        assert expected_report.value == True

    def test_update_report_nonexistent_member(self, client):
        department = Department.objects.create(department_number=9)
        subgroup = Subgroup.objects.create(subgroup_number=2, department=department)

        member1 = Member.objects.create(full_name='John Doe', subgroup=subgroup)

        report = Report.objects.create(
            name=LESSON,
            member=member1,
            value=False,
            report_date=timezone.localtime(timezone.now()).date()
        )

        assert Report.objects.count() == 1

        # Update the nonexistent report

        url = f'{reverse("update_member_report")}?member_name=some_member&report_name={LESSON}&value=1&day={report.report_date.isoweekday()}'
        response = client.post(url)

        # Check response status code and report count
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert Report.objects.count() == 1

    def test_update_report_nonexistent_report_name(self, client):
        department = Department.objects.create(department_number=9)
        subgroup = Subgroup.objects.create(subgroup_number=2, department=department)

        member1 = Member.objects.create(full_name='John Doe', subgroup=subgroup)

        report = Report.objects.create(
            name=LESSON,
            member=member1,
            value=False,
            report_date=timezone.localtime(timezone.now()).date()
        )

        assert Report.objects.count() == 1

        url = f'{reverse("update_member_report")}?member_name={member1.underscore_name}&report_name=some_report&value=1&day={report.report_date.isoweekday()}'
        response = client.post(url)

        # Check response status code and report count
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert Report.objects.count() == 1
