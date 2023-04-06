import pytest
from ..models import Subgroup, Member, Department
from backend.settings import TIME_ZONE
from ...reports.models import Report
from django.utils import timezone
from ...reports.constants import ACTIVITY, LESSON, HOMEWORK, WEEKLY_MEETING, report_names

TODAY = 0
LAST_WEEK = 7

def create_all_reports(days_ago, member):
    for report_name in report_names:
        created_date_time = timezone.now() - timezone.timedelta(days=days_ago)

        report = Report.objects.create(
            name=report_name,
            member=member,
            value=True
        )

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
        subgroup = Subgroup.objects.create(subgroup_number=custom_number, department=department)

        member1 = Member.objects.create(full_name=f'John Doe {custom_number}', subgroup=subgroup)
        member2 = Member.objects.create(full_name=f'Jane Smith {custom_number}', subgroup=subgroup)

        create_all_reports(TODAY, member1)
        create_all_reports(LAST_WEEK, member1)

        create_all_reports(TODAY, member2)
        create_all_reports(LAST_WEEK, member2)

        return subgroup
    
    def test_name(self, department):
        assert department.name() == 'Department 9'
    
    def test_get_total_members(self, department):
        subgroup1 = self.create_subgroup_with_members_and_reports(department, 11)
        subgroup2 = self.create_subgroup_with_members_and_reports(department, 22)

        assert department.get_total_members() == 4

    def test_get_report_total(self, department):
        subgroup1 = self.create_subgroup_with_members_and_reports(department, 33)
        subgroup2 = self.create_subgroup_with_members_and_reports(department, 44)

        assert department.get_report_total(LESSON, 0) == 4
        assert department.get_report_total(LESSON, 7) == 4

        assert department.get_report_total(HOMEWORK, 0) == 4
        assert department.get_report_total(HOMEWORK, 7) == 4

        assert department.get_report_total(ACTIVITY, 0) == 4
        assert department.get_report_total(ACTIVITY, 7) == 4

        assert department.get_report_total(WEEKLY_MEETING, 0) == 4
        assert department.get_report_total(WEEKLY_MEETING, 7) == 4

    def test_get_all_report_totals(self, department):
        subgroup1 = self.create_subgroup_with_members_and_reports(department, 33)
        subgroup2 = self.create_subgroup_with_members_and_reports(department, 44)

        expected = {
            'lesson_count': 4,
            'lastweek_lesson_count': 4,
            'homework_count': 4,
            'lastweek_homework_count': 4,
            'activity_count': 4,
            'lastweek_activity_count': 4,
            'weekly_meeting_count': 4,
            'lastweek_weekly_meeting_count': 4
        }
        
        assert department.get_all_report_totals() == expected

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

        assert subgroup.get_report_total(LESSON, 0) == 1
        assert subgroup.get_report_total(LESSON, 7) == 1

        assert subgroup.get_report_total(HOMEWORK, 0) == 1
        assert subgroup.get_report_total(HOMEWORK, 7) == 1

        assert subgroup.get_report_total(ACTIVITY, 0) == 1
        assert subgroup.get_report_total(ACTIVITY, 7) == 1

        assert subgroup.get_report_total(WEEKLY_MEETING, 0) == 1
        assert subgroup.get_report_total(WEEKLY_MEETING, 7) == 1

    def test_get_all_report_totals(self, subgroup, members):
        member1, member2 = members

        create_all_reports(TODAY, member1)
        create_all_reports(LAST_WEEK, member1)

        create_all_reports(TODAY, member2)
        create_all_reports(LAST_WEEK, member2)

        expected = {
            'lesson_count': 2,
            'lastweek_lesson_count': 2,
            'homework_count': 2,
            'lastweek_homework_count': 2,
            'activity_count': 2,
            'lastweek_activity_count': 2,
            'weekly_meeting_count': 2,
            'lastweek_weekly_meeting_count': 2
        }
        
        assert subgroup.get_all_report_totals() == expected

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
        created_date_time = timezone.now() - timezone.timedelta(days=days_ago)
        report = Report.objects.create(
            name=report_name,
            member=member,
            value=True
        )

        report.created = created_date_time
        report.updated = created_date_time
        report.save()

        # Assert that the count has increased to 1 when days ago set to 7
        assert member.get_report(report_name, days_ago) == 1

        days_ago = 0
        report = Report.objects.create(
            name=report_name,
            member=member,
            value=True
        )

        # Assert that the count has increased to 1 when days ago set to 0
        assert member.get_report(report_name, days_ago) == 1

        # Check total report count
        assert member.report_set.all().count() == 2
        
    def test_get_all_reports(self):
        member = Member.objects.create(full_name='John Smith')
        
        create_all_reports(TODAY, member)
        create_all_reports(LAST_WEEK, member)

        
        # test that the report totals are correct
        totals = member.get_all_reports()
        assert totals['lesson_count'] == 1
        assert totals['lastweek_lesson_count'] == 1
        assert totals['homework_count'] == 1
        assert totals['lastweek_homework_count'] == 1
        assert totals['activity_count'] == 1
        assert totals['lastweek_activity_count'] == 1
        assert totals['weekly_meeting_count'] == 1
        assert totals['lastweek_weekly_meeting_count'] == 1