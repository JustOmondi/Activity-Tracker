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
class TestMemberWeekReport:
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
class TestDepartmentWeekReport:
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