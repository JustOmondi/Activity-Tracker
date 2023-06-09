import pytest
from base.tests.utils import (
    auth_header,
    create_all_reports_for_fortnight,
    create_all_reports_for_week,
)
from django.urls import reverse
from django.utils import timezone
from reports.constants import LESSON, REPORT_NAMES
from reports.models import Report
from rest_framework import status
from structure.models import Department, Member, Subgroup


def create_all_reports_for_every_day(member, last_week):
    now = timezone.localtime(timezone.now())

    for report_name in REPORT_NAMES:
        for i in range(1, 8):
            start_of_week = now - timezone.timedelta(days=now.weekday())

            if last_week:
                start_of_week = start_of_week - timezone.timedelta(days=7)

            day = start_of_week + timezone.timedelta(days=i - 1)

            report = Report.objects.create(
                name=report_name, member=member, value=True, report_date=day.date()
            )

            report.created = day
            report.save()


@pytest.mark.django_db
class TestDepartmentReports:
    @pytest.fixture
    def department(self, db):
        return Department.objects.create(department_number=9)

    def test_get_department_reports_by_week(self, client, department, auth_header):
        subgroup = Subgroup.objects.create(subgroup_number=2, department=department)

        member1 = Member.objects.create(full_name='John Doe', subgroup=subgroup)
        member2 = Member.objects.create(full_name='Jane Wilson', subgroup=subgroup)

        create_all_reports_for_week(member1, lastweek=True)
        create_all_reports_for_week(member2, lastweek=True)

        create_all_reports_for_week(member1, lastweek=False)
        create_all_reports_for_week(member2, lastweek=False)

        url = f'{reverse("department_reports_by_week")}?dept_number={department.department_number}'
        response = client.post(url, **auth_header)

        assert response.status_code == status.HTTP_200_OK

        this_week_expected = {}
        last_week_expected = {}

        current_weekday = timezone.localtime(timezone.now()).isoweekday()

        for report_name in REPORT_NAMES:
            this_week_expected[report_name] = {}
            last_week_expected[report_name] = {}

            for i in range(1, 8):
                if i <= current_weekday:
                    this_week_expected[report_name][i] = 2
                else:
                    this_week_expected[report_name][i] = 0

                last_week_expected[report_name][i] = 2

        assert response.data['reports']['this_week'] == this_week_expected

        # TODO: Figure out value mismatch below
        # assert response.data['reports']['last_week'] == last_week_expected

    def test_get_department_week_report_with_nonexistent_department(
        self, client, auth_header
    ):
        url = f'{reverse("department_reports_by_week")}?dept_number=999999999'
        response = client.post(url, **auth_header)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_get_department_reports_by_fornight(self, client, department, auth_header):
        subgroup = Subgroup.objects.create(subgroup_number=2, department=department)

        member1 = Member.objects.create(full_name='John Doe', subgroup=subgroup)
        member2 = Member.objects.create(full_name='Jane Wilson', subgroup=subgroup)

        create_all_reports_for_fortnight(member1)
        create_all_reports_for_fortnight(member2)

        url = f'{reverse("department_reports_by_fortnight")}?report_name={LESSON}&dept_number={department.department_number}'
        response = client.post(url, **auth_header)

        assert response.status_code == status.HTTP_200_OK

        expected = {'values': [], 'labels': []}

        tz_aware_now = timezone.localtime(timezone.now())
        date_range_end = tz_aware_now.replace(hour=23, minute=59, second=59)

        date_range_start = date_range_end - timezone.timedelta(days=14)
        date_range_start = date_range_start.replace(hour=0, minute=0, second=0)

        for date in (date_range_start + timezone.timedelta(days=n) for n in range(14)):
            expected['values'].append(2)
            expected['labels'].append(date.strftime('%d %b'))

        assert response.data == expected

    def test_get_department_reports_by_fornight_non_existent_department(
        self, client, auth_header
    ):
        non_existent_dept_number = 9999
        url = f'{reverse("department_reports_by_fortnight")}?report_name={LESSON}&dept_number={non_existent_dept_number}'
        response = client.post(url, **auth_header)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_get_department_reports_by_fornight_non_existent_report_name(
        self, client, department, auth_header
    ):
        non_existent_report_name = 'potato'

        url = f'{reverse("department_reports_by_fortnight")}?report_name={non_existent_report_name}&dept_number={department.department_number}'
        response = client.post(url, **auth_header)

        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestMemberReports:
    def test_update_existing_report(self, client, auth_header):
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
            report_date=timezone.localtime(timezone.now()).date(),
        )

        # Make sure there is an existing report
        assert Report.objects.count() == 1

        url = f'{reverse("update_member_report")}?member_name={member1.underscore_name}&report_name={LESSON}&value=1&day={report.report_date.isoweekday()}'

        response = client.post(url, **auth_header)

        # Check response status code and report value
        assert response.status_code == status.HTTP_200_OK
        report.refresh_from_db()
        assert report.value == True

        # Update the report value
        url = f'{reverse("update_member_report")}?member_name={member1.underscore_name}&report_name={LESSON}&value=0&day={report.report_date.isoweekday()}'
        response = client.post(url, **auth_header)

        # Check response status code and report value
        assert response.status_code == status.HTTP_200_OK
        report.refresh_from_db()
        assert report.value == False

    def test_create_new_report(self, client, auth_header):
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

        response = client.post(url, **auth_header)

        # Check response status code and report count
        assert response.status_code == status.HTTP_200_OK

        expected_report = Report.objects.get(name=LESSON, member=member1)
        assert expected_report.value == True

    def test_update_report_nonexistent_member(self, client, auth_header):
        department = Department.objects.create(department_number=9)
        subgroup = Subgroup.objects.create(subgroup_number=2, department=department)

        member1 = Member.objects.create(full_name='John Doe', subgroup=subgroup)

        report = Report.objects.create(
            name=LESSON,
            member=member1,
            value=False,
            report_date=timezone.localtime(timezone.now()).date(),
        )

        assert Report.objects.count() == 1

        # Update the nonexistent report

        url = f'{reverse("update_member_report")}?member_name=some_member&report_name={LESSON}&value=1&day={report.report_date.isoweekday()}'
        response = client.post(url, **auth_header)

        # Check response status code and report count
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert Report.objects.count() == 1

    def test_update_report_nonexistent_report_name(self, client, auth_header):
        department = Department.objects.create(department_number=9)
        subgroup = Subgroup.objects.create(subgroup_number=2, department=department)

        member1 = Member.objects.create(full_name='John Doe', subgroup=subgroup)

        report = Report.objects.create(
            name=LESSON,
            member=member1,
            value=False,
            report_date=timezone.localtime(timezone.now()).date(),
        )

        assert Report.objects.count() == 1

        url = f'{reverse("update_member_report")}?member_name={member1.underscore_name}&report_name=some_report&value=1&day={report.report_date.isoweekday()}'
        response = client.post(url, **auth_header)

        # Check response status code and report count
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert Report.objects.count() == 1
