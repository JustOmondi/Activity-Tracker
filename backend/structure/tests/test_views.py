from django.urls import reverse
from rest_framework import status
from structure.models import Department, Member, Subgroup
from structure.serializers import DepartmentSerializer, MemberSerializer, SubgroupSerializer
import pytest

@pytest.mark.django_db
class TestDepartmentViews:
    def test_get_department(self, client):
        department = Department.objects.create(department_number=9)

        url = f'{reverse("department_details")}?department_number={department.department_number}'

        response = client.get(url)
        
        expected_data = DepartmentSerializer(department).data

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

    def test_update_member_name(self, client):
        department = Department.objects.create(department_number=7)
        subgroup = Subgroup.objects.create(subgroup_number=2, department=department)

        original_name = 'John Doe'
        new_underscore_name = 'jonathan_doe'

        member1 = Member.objects.create(full_name=original_name, subgroup=subgroup)

        url = f'{reverse("member_update")}?name={member1.underscore_name}&new_name={new_underscore_name}'

        response = client.post(url)

        assert response.status_code == status.HTTP_200_OK

        member1.refresh_from_db()

        assert member1.underscore_name == new_underscore_name

    def test_update_member_subgroup(self, client):
        department = Department.objects.create(department_number=7)

        old_subgroup = Subgroup.objects.create(subgroup_number=2, department=department)
        new_subgroup = Subgroup.objects.create(subgroup_number=5, department=department)

        member1 = Member.objects.create(full_name='John Doe', subgroup=old_subgroup)

        url = f'{reverse("member_update")}?name={member1.underscore_name}&new_subgroup={new_subgroup.subgroup_number}'

        response = client.post(url)

        assert response.status_code == status.HTTP_200_OK

        member1.refresh_from_db()

        assert member1.subgroup == new_subgroup

    def test_update_non_existent_member(self, client):
        department = Department.objects.create(department_number=7)
        subgroup = Subgroup.objects.create(subgroup_number=2, department=department)

        original_name = 'John Doe'
        new_underscore_name = 'jonathan_doe'

        member1 = Member.objects.create(full_name=original_name, subgroup=subgroup)

        non_existent_member_name = 'someone_random'

        url = f'{reverse("member_update")}?name={non_existent_member_name}&new_name={new_underscore_name}'

        response = client.post(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND

        member1.refresh_from_db()

        assert member1.underscore_name == original_name.replace(' ', '_').lower()

    def test_update_non_existent_subgroup(self, client):
        department = Department.objects.create(department_number=7)
        
        original_subgroup = 2
        non_existent_subgroup = 577

        subgroup = Subgroup.objects.create(subgroup_number=original_subgroup, department=department)

        member1 = Member.objects.create(full_name='John Doe', subgroup=subgroup)

        url = f'{reverse("member_update")}?name={member1.underscore_name}&new_subgroup={non_existent_subgroup}'

        response = client.post(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND

        member1.refresh_from_db()

        assert member1.subgroup.subgroup_number == original_subgroup


@pytest.mark.django_db
class TestSubgroupViews:

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
