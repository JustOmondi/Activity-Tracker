from django.urls import reverse
from django.utils import timezone
from rest_framework import status

from backend.structure.serializers import MemberSerializer
from ..models import Report
from ...structure.models import Department, Member, Subgroup
from ..serializers import ReportSerializer
from ..constants import LESSON, REPORT_NAMES
import pytest

def create_all_reports_for_every_weekday(member):
    for report_name in REPORT_NAMES:
        for i in range(1,6):
            report = Report.objects.create(
                name=report_name,
                member=member,
                value=True
            )
            report.created = timezone.now() - timezone.timedelta(days=i)
            report.save()


@pytest.mark.django_db
class TestGetMemberWeekReport:
    @pytest.fixture
    def department(self, db):
        department = Department.objects.create(department_number=9)
        return department
    
    def test_get_member_week_report(self, client, department):
        subgroup = Subgroup.objects.create(subgroup_number=2, department=department)
        member = Member.objects.create(full_name='John Doe', subgroup=subgroup)

        create_all_reports_for_every_weekday(member)

        url = reverse('member_week_report', args=[member.underscore_name, LESSON])
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK

        expected_reports = {
            1: {'count': 1},
            2: {'count': 1},
            3: {'count': 1},
            4: {'count': 1},
            5: {'count': 1},
        }
        assert response.data['reports'] == expected_reports

    def test_get_member_week_report_with_nonexistent_member(self, client):
        url = reverse('member_week_report', args=['nonexistent_member', LESSON])
        response = client.get(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_get_member_week_report_with_nonexistent_report(self, client, department):
        subgroup = Subgroup.objects.create(subgroup_number=2, department=department)
        member = Member.objects.create(full_name='John Doe', subgroup=subgroup)

        url = reverse('member_week_report', args=[member.underscore_name, 'nonexistent_report'])
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

        create_all_reports_for_every_weekday(member1)
        create_all_reports_for_every_weekday(member2)

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
        url = reverse('update_member_report')

        # Make sure there is an existing report
        assert Report.objects.count() == 1

        # Update the report value
        data = {
            'member_name': member1.underscore_name,
            'report_name': LESSON,
            'update_value': 1,
        }
        response = client.post(url, data=data)

        # Check response status code and report value
        assert response.status_code == status.HTTP_200_OK
        report.refresh_from_db()
        assert report.value == True

        # Update the report value
        data = {
            'member_name': member1.underscore_name,
            'report_name': LESSON,
            'update_value': 0,
        }
        response = client.post(url, data=data)

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

        # Create a new report
        data = {
            'member_name': member1.underscore_name,
            'report_name': LESSON,
            'update_value': 1,
        }

        url = reverse('update_member_report')

        response = client.post(url, data=data)

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
        data = {
            'member_name': 'some_member',
            'report_name': LESSON,
            'update_value': 1,
        }

        url = reverse('update_member_report')
        response = client.post(url, data=data)

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

        # Update the nonexistent report
        data = {
            'member_name': member1.underscore_name,
            'report_name': 'some_report',
            'update_value': 1,
        }

        url = reverse('update_member_report')
        response = client.post(url, data=data)

        # Check response status code and report count
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert Report.objects.count() == 1