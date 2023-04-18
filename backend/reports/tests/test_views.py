from django.urls import reverse
from django.utils import timezone
from rest_framework import status

from backend.structure.serializers import MemberSerializer
from backend.structure.tests.test_models import create_all_reports_for_week
from ..models import Report
from ...structure.models import Department, Member, Subgroup

from ..constants import LESSON, REPORT_NAMES
import pytest

def create_all_reports_for_every_day(member):
    for report_name in REPORT_NAMES:
        for i in range(1,8):
            report = Report.objects.create(
                name=report_name,
                member=member,
                value=True
            )
            now = timezone.now()
            start_of_week = now - timezone.timedelta(days=now.weekday())
            day = start_of_week + timezone.timedelta(days=i-1)

            report.created = day
            report.save()

@pytest.mark.django_db
class TestGetAllMemberReportsByWeek:
    @pytest.fixture
    def department(self, db):
        department = Department.objects.create(department_number=9)
        return department
    
    def test_get_all_reports_by_week_of_current_week(self, client, department):
        subgroup = Subgroup.objects.create(subgroup_number=2, department=department)
        member = Member.objects.create(full_name='John Doe', subgroup=subgroup)

        create_all_reports_for_week(member)

        url = f'{reverse("member_reports_by_week")}?name={member.underscore_name}&from_lastweek=0'
  
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK
                
        expected = {}

        current_weekday = timezone.now().isoweekday()

        for report_name in REPORT_NAMES:
            expected[report_name] = {}
            for i in range(1, 8):
                """ 
                Only reports from the beginning of the week to 
                the current weekday should have a value of True from what is returned
                from the get_all_reports_by_week() function
                """
                if(i <= current_weekday): 
                    expected[report_name][i] = True
                else:
                    expected[report_name][i] = False

        assert response.data == expected

    def test_get_all_reports_by_week_of_last_week(self, client, department):
        subgroup = Subgroup.objects.create(subgroup_number=2, department=department)
        member = Member.objects.create(full_name='John Doe', subgroup=subgroup)

        create_all_reports_for_week(member, lastweek=True)

        url = f'{reverse("member_reports_by_week")}?name={member.underscore_name}&from_lastweek=1'
  
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK
                
        expected = {}

        for report_name in REPORT_NAMES:
            expected[report_name] = {}
            for i in range(1, 8):
                expected[report_name][i] = True

        assert response.data == expected

    def test_get_all_reports_by_week_with_nonexistent_member(self, client):
        url = f'{reverse("member_reports_by_week")}?name=nonexistent_member'

        response = client.get(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND

@pytest.mark.django_db
class TestGetDepartmentWeekReport:
    @pytest.fixture
    def department(self, db):
        department = Department.objects.create(department_number=9)
        return department
    
    def test_get_department_week_report(self, client, department):
        subgroup = Subgroup.objects.create(subgroup_number=2, department=department)

        member1 = Member.objects.create(full_name='John Doe', subgroup=subgroup)
        member2 = Member.objects.create(full_name='Jane Wilson', subgroup=subgroup)

        create_all_reports_for_every_day(member1)
        create_all_reports_for_every_day(member2)

        url = reverse('department_week_report', args=[department.department_number, LESSON])
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK

        expected_reports = {
            1: {'count': 2},
            2: {'count': 2},
            3: {'count': 2},
            4: {'count': 2},
            5: {'count': 2},
        }
        assert response.data['reports'] == expected_reports

        members = department.subgroup_set.first().member_set.all()
        member_data = MemberSerializer(members, many=True).data

        assert response.data['members']  == member_data

    def test_get_department_week_report_with_nonexistent_department(self, client):
        url = reverse('department_week_report', args=[999999, LESSON])
        response = client.get(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_get_department_week_report_with_nonexistent_report(self, client, department):
        subgroup = Subgroup.objects.create(subgroup_number=2, department=department)
        member = Member.objects.create(full_name='John Doe', subgroup=subgroup)

        url = reverse('department_week_report', args=[department.department_number, 'nonexistent_report'])
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
            value=False
        )
        
        # Make sure there is an existing report
        assert Report.objects.count() == 1

        url = f'{reverse("update_member_report")}?member_name={member1.underscore_name}&report_name={LESSON}&update_value=1'

        response = client.post(url)

        # Check response status code and report value
        assert response.status_code == status.HTTP_200_OK
        report.refresh_from_db()
        assert report.value == True

        # Update the report value
        url = f'{reverse("update_member_report")}?member_name={member1.underscore_name}&report_name={LESSON}&update_value=0'
        response = client.post(url)

        # Check response status code and report value
        assert response.status_code == status.HTTP_200_OK
        report.refresh_from_db()
        assert report.value == False

    def test_create_new_report(self, client):
        """
        Test creating a new report with a valid member name, report name, and update value.
        """
        department = Department.objects.create(department_number=9)
        subgroup = Subgroup.objects.create(subgroup_number=2, department=department)

        member1 = Member.objects.create(full_name='John Doe', subgroup=subgroup)

        # Make sure the existing report is deleted
        assert Report.objects.count() == 0

        url = f'{reverse("update_member_report")}?member_name={member1.underscore_name}&report_name={LESSON}&update_value=1'

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
            value=False
        )

        assert Report.objects.count() == 1

        # Update the nonexistent report

        url = f'{reverse("update_member_report")}?member_name=some_member&report_name={LESSON}&update_value=1'
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
            value=False
        )

        assert Report.objects.count() == 1

        url = f'{reverse("update_member_report")}?member_name={member1.underscore_name}&report_name=some_report&update_value=1'
        response = client.post(url)

        # Check response status code and report count
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert Report.objects.count() == 1