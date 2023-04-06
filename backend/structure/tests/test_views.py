from django.urls import reverse
from rest_framework import status
from ..models import Department, Member, Subgroup
from ..serializers import DepartmentSerializer, MemberSerializer, SubgroupSerializer
import pytest

@pytest.mark.django_db
class TestDepartmentViews:
    def test_get_department(self, client):
        department = Department.objects.create(department_number=9)

        url = reverse('department', args=[department.department_number])
        response = client.get(url)
        
        expected_data = DepartmentSerializer(department).data

        assert response.status_code == status.HTTP_200_OK
        assert response.data == expected_data

    def test_get_departments(self, client):
        department1 = Department.objects.create(department_number=10)
        department2 = Department.objects.create(department_number=11)

        url = reverse('departments')
        response = client.get(url)
        
        expected_data = DepartmentSerializer(Department.objects.all(), many=True).data

        assert response.status_code == status.HTTP_200_OK
        assert response.data == expected_data

@pytest.mark.django_db
class TestMemberViews:
    def test_get_members(self, client):
        department = Department.objects.create(department_number=7)
        subgroup = Subgroup.objects.create(subgroup_number=2, department=department)

        member1 = Member.objects.create(full_name='John Doe', subgroup=subgroup)
        member2 = Member.objects.create(full_name='Jane Smith', subgroup=subgroup)

        url = reverse('members')
        response = client.get(url)
        
        expected_data = MemberSerializer(Member.objects.all(), many=True).data

        assert response.status_code == status.HTTP_200_OK
        assert response.data == expected_data

    def test_get_member(self, client):
        department = Department.objects.create(department_number=8)
        subgroup = Subgroup.objects.create(subgroup_number=22, department=department)

        member = Member.objects.create(full_name='John Doe', subgroup=subgroup)

        url = reverse('member', args=[member.underscore_name])
        response = client.get(url)
        
        expected_data = MemberSerializer(member).data

        assert response.status_code == status.HTTP_200_OK
        assert response.data == expected_data

@pytest.mark.django_db
class TestSubgroupViews:
    def test_get_subgroup(self, client):
        department = Department.objects.create(department_number=9)
        subgroup = Subgroup.objects.create(subgroup_number=2, department=department)

        url = reverse('subgroup', args=[subgroup.subgroup_number])
        response = client.get(url)
        
        expected_data = SubgroupSerializer(subgroup).data

        assert response.status_code == status.HTTP_200_OK
        assert response.data == expected_data

    def test_get_subgroups(self, client):
        department = Department.objects.create(department_number=10)

        subgroup1 = Subgroup.objects.create(subgroup_number=4, department=department)
        member1 = Member.objects.create(full_name='John Doe')
        member1.subgroup = subgroup1

        subgroup2 = Subgroup.objects.create(subgroup_number=5, department=department)
        member2 = Member.objects.create(full_name='Jane Doe')
        member2.subgroup = subgroup2

        url = reverse('subgroups')
        response = client.get(url)
       
        expected_data = SubgroupSerializer(Subgroup.objects.all(), many=True).data

        assert response.status_code == status.HTTP_200_OK

        assert response.data == expected_data
