import pytest
from base.tests.utils import create_all_reports_for_week
from django.utils import timezone
from reports.constants import LESSON, REPORT_NAMES
from reports.models import Report
from structure.models import Department, Member, Subgroup

TODAY = 0
LAST_WEEK = 7


def create_all_reports(days_ago, member):
    tz_aware_now = timezone.localtime(timezone.now())

    for report_name in REPORT_NAMES:
        created_date_time = tz_aware_now - timezone.timedelta(days=days_ago)

        report = Report.objects.create(name=report_name, member=member, value=True)

        report.created = created_date_time
        report.updated = created_date_time
        report.save()


@pytest.mark.django_db
class TestDepartment:
    @pytest.fixture
    def department(self, db):
        department = Department.objects.create(department_number=9)
        return department

    def create_subgroup_with_members_and_reports(self, department, custom_number):
        subgroup = Subgroup.objects.create(
            subgroup_number=custom_number, department=department
        )

        member1 = Member.objects.create(
            full_name=f'John Doe {custom_number}', subgroup=subgroup
        )
        member2 = Member.objects.create(
            full_name=f'Jane Smith {custom_number}', subgroup=subgroup
        )

        create_all_reports(TODAY, member1)
        create_all_reports(LAST_WEEK, member1)

        create_all_reports(TODAY, member2)
        create_all_reports(LAST_WEEK, member2)

        return subgroup

    def test_name(self, department):
        assert department.name() == 'Department 9'

    def test_get_total_members(self, department):
        self.create_subgroup_with_members_and_reports(department, 11)
        self.create_subgroup_with_members_and_reports(department, 22)

        assert department.get_total_members() == 4

    def test_get_report_total(self, department):
        self.create_subgroup_with_members_and_reports(department, 33)
        self.create_subgroup_with_members_and_reports(department, 44)

        for report_name in REPORT_NAMES:
            assert department.get_report_total(report_name, TODAY) == 4
            assert department.get_report_total(report_name, LAST_WEEK) == 4

    def test_get_all_report_totals(self, department):
        self.create_subgroup_with_members_and_reports(department, 33)
        self.create_subgroup_with_members_and_reports(department, 44)

        expected = {}

        for report_name in REPORT_NAMES:
            expected[report_name] = {'this_week': 4, 'last_week': 4}

        assert department.get_all_report_totals_by_day() == expected


@pytest.mark.django_db
class TestSubgroup:
    @pytest.fixture
    def subgroup(self, db):
        department = Department.objects.create(department_number=9)
        subgroup = Subgroup.objects.create(subgroup_number=1, department=department)
        return subgroup

    @pytest.fixture
    def members(self, db, subgroup):
        member1 = Member.objects.create(full_name='John Doe')
        member2 = Member.objects.create(full_name='Jane Smith')
        subgroup.member_set.add(member1, member2)
        return member1, member2

    def test_name(self, subgroup):
        assert subgroup.name() == 'Subgroup 1'

    def test_members_to_string(self, subgroup, members):
        member1, member2 = members
        expected = f'Subgroup 1\n{member1.full_name}\n{member2.full_name}'
        assert subgroup.members_to_string() == expected

    def test_get_total_members(self, members, subgroup):
        member1, member2 = members
        assert subgroup.get_total_members() == 2

    def test_get_report_total(self, subgroup, members):
        member1, member2 = members
        create_all_reports(TODAY, member1)
        create_all_reports(LAST_WEEK, member1)

        for report_name in REPORT_NAMES:
            assert subgroup.get_report_total(report_name, TODAY) == 1
            assert subgroup.get_report_total(report_name, LAST_WEEK) == 1

    def test_get_all_report_totals(self, subgroup, members):
        member1, member2 = members

        create_all_reports(TODAY, member1)
        create_all_reports(LAST_WEEK, member1)

        create_all_reports(TODAY, member2)
        create_all_reports(LAST_WEEK, member2)

        expected = {}

        for report_name in REPORT_NAMES:
            expected[report_name] = {'this_week': 2, 'last_week': 2}

        assert subgroup.get_all_report_totals_by_day() == expected


@pytest.mark.django_db
class TestMember:
    def test_name(self):
        member = Member.objects.create(full_name='John Smith')
        assert member.name() == 'John'

    def test_get_member_from_string(self):
        member = Member.objects.create(full_name='John Smith')
        underscore_name = 'john_smith'
        assert Member.get_member_from_string(underscore_name) == member

    def test_get_report(self):
        # Create a Member object
        member = Member.objects.create(full_name='John Smith')

        # Set the report name and days ago
        report_name = LESSON
        days_ago = 7

        # Assert that initially the count is 0
        assert member.get_report(report_name, days_ago) == 0

        # Create a Report object with a created date within the date range
        tz_aware_now = timezone.localtime(timezone.now())

        created_date_time = tz_aware_now - timezone.timedelta(days=days_ago)
        report = Report.objects.create(name=report_name, member=member, value=True)

        report.created = created_date_time
        report.updated = created_date_time
        report.save()

        # Assert that the count has increased to 1 when days ago set to 7
        assert member.get_report(report_name, days_ago) == 1

        days_ago = 0
        report = Report.objects.create(name=report_name, member=member, value=True)

        # Assert that the count has increased to 1 when days ago set to 0
        assert member.get_report(report_name, days_ago) == 1

        # Check total report count
        assert member.report_set.all().count() == 2

    def test_get_all_reports_by_day(self):
        member = Member.objects.create(full_name='John Smith')

        create_all_reports(TODAY, member)
        create_all_reports(LAST_WEEK, member)

        # test that the report totals are correct
        totals = member.get_all_reports_by_day()

        for report_name in REPORT_NAMES:
            current_key = f'{report_name}_count'
            lastweek_key = f'lastweek_{report_name}_count'

            assert totals[current_key] == 1
            assert totals[lastweek_key] == 1

    def test_get_all_reports_by_week_of_current_week(self):
        member = Member.objects.create(full_name='John Smith')

        create_all_reports_for_week(member)

        expected = {}

        current_weekday = timezone.localtime(timezone.now()).isoweekday()

        for report_name in REPORT_NAMES:
            expected[report_name] = {}
            for i in range(1, 8):
                """
                Only reports from the beginning of the week to
                the current weekday should have a value of True from what is returned
                from the get_all_reports_by_week() function
                """
                if i <= current_weekday:
                    expected[report_name][i] = True
                else:
                    expected[report_name][i] = False

        assert member.get_all_reports_by_week() == expected

    def test_get_all_reports_by_week_of_last_week(self):
        member = Member.objects.create(full_name='John Smith')

        create_all_reports_for_week(member, lastweek=True)

        expected = {}

        for report_name in REPORT_NAMES:
            expected[report_name] = {}
            for i in range(1, 8):
                expected[report_name][i] = True

        assert member.get_all_reports_by_week(last_week=True) == expected
