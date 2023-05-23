import pytest
from base.tests.utils import auth_header
from django.urls import reverse
from rest_framework import status
from structure.models import Department, Member, Subgroup
from structure.serializers import (
    DepartmentSerializer,
    MemberSerializer,
    SubgroupSerializer,
)


@pytest.mark.django_db
class TestDepartmentViews:
    def test_get_department(self, client, auth_header):
        department = Department.objects.create(department_number=9)

        url = f'{reverse("department_details")}?department_number={department.department_number}'

        response = client.post(url, **auth_header)

        expected_data = DepartmentSerializer(department).data

        assert response.status_code == status.HTTP_200_OK
        assert response.data == expected_data


@pytest.mark.django_db
class TestMemberViews:
    def test_get_members(self, client, auth_header):
        department = Department.objects.create(department_number=7)
        subgroup = Subgroup.objects.create(subgroup_number=2, department=department)

        Member.objects.create(full_name='John Doe', subgroup=subgroup)
        Member.objects.create(full_name='Jane Smith', subgroup=subgroup)

        url = reverse('members')
        response = client.post(url, **auth_header)

        expected_data = MemberSerializer(Member.objects.all(), many=True).data

        assert response.status_code == status.HTTP_200_OK
        assert response.data == expected_data

    def test_update_member_name(self, client, auth_header):
        department = Department.objects.create(department_number=7)
        subgroup = Subgroup.objects.create(subgroup_number=2, department=department)

        original_name = 'John Doe'
        new_underscore_name = 'jonathan_doe'

        member = Member.objects.create(full_name=original_name, subgroup=subgroup)

        url = f'{reverse("member_update")}?name={member.underscore_name}&new_name={new_underscore_name}'

        response = client.post(url, **auth_header)

        assert response.status_code == status.HTTP_200_OK

        member.refresh_from_db()

        assert member.underscore_name == new_underscore_name

    def test_update_member_subgroup(self, client, auth_header):
        department = Department.objects.create(department_number=7)

        old_subgroup = Subgroup.objects.create(subgroup_number=2, department=department)
        new_subgroup = Subgroup.objects.create(subgroup_number=5, department=department)

        member = Member.objects.create(full_name='John Doe', subgroup=old_subgroup)

        url = f'{reverse("member_update")}?name={member.underscore_name}&new_subgroup={new_subgroup.subgroup_number}'

        response = client.post(url, **auth_header)

        assert response.status_code == status.HTTP_200_OK

        member.refresh_from_db()

        assert member.subgroup == new_subgroup

    def test_update_non_existent_member(self, client, auth_header):
        department = Department.objects.create(department_number=7)
        subgroup = Subgroup.objects.create(subgroup_number=2, department=department)

        original_name = 'John Doe'
        new_underscore_name = 'jonathan_doe'

        member = Member.objects.create(full_name=original_name, subgroup=subgroup)

        non_existent_member_name = 'someone_random'

        url = f'{reverse("member_update")}?name={non_existent_member_name}&new_name={new_underscore_name}'

        response = client.post(url, **auth_header)

        assert response.status_code == status.HTTP_404_NOT_FOUND

        member.refresh_from_db()

        assert member.underscore_name == original_name.replace(' ', '_').lower()

    def test_update_member_with_non_existent_subgroup(self, client, auth_header):
        department = Department.objects.create(department_number=7)

        original_subgroup = 2
        non_existent_subgroup = 577

        subgroup = Subgroup.objects.create(
            subgroup_number=original_subgroup, department=department
        )

        member = Member.objects.create(full_name='John Doe', subgroup=subgroup)

        url = f'{reverse("member_update")}?name={member.underscore_name}&new_subgroup={non_existent_subgroup}'

        response = client.post(url, **auth_header)

        assert response.status_code == status.HTTP_404_NOT_FOUND

        member.refresh_from_db()

        assert member.subgroup.subgroup_number == original_subgroup

    def test_add_member(self, client, auth_header):
        department = Department.objects.create(department_number=7)

        subgroup = Subgroup.objects.create(subgroup_number=2, department=department)

        assert Member.objects.count() == 0

        underscore_name = 'some_person'

        url = f'{reverse("member_add")}?name={underscore_name}&subgroup={subgroup.subgroup_number}'

        response = client.post(url, **auth_header)

        assert response.status_code == status.HTTP_200_OK

        assert Member.objects.count() == 1

        created_member = Member.objects.all().first()

        assert created_member.underscore_name == underscore_name
        assert created_member.subgroup == subgroup

    def test_add_member_to_nonexistent_subgroup(self, client, auth_header):
        department = Department.objects.create(department_number=7)

        existing_subgroup_number = 2
        non_existing_subgroup_number = 55

        Subgroup.objects.create(
            subgroup_number=existing_subgroup_number, department=department
        )

        underscore_name = 'some_person'

        url = f'{reverse("member_add")}?name={underscore_name}&subgroup={non_existing_subgroup_number}'

        response = client.post(url, **auth_header)

        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert Member.objects.count() == 0

    def test_remove_member(self, client, auth_header):
        department = Department.objects.create(department_number=7)

        subgroup = Subgroup.objects.create(subgroup_number=2, department=department)

        member = Member.objects.create(full_name='John Doe', subgroup=subgroup)

        assert Member.objects.count() == 1

        url = f'{reverse("member_remove")}?name={member.underscore_name}&subgroup={subgroup.subgroup_number}'

        response = client.post(url, **auth_header)

        assert response.status_code == status.HTTP_200_OK

        assert Member.objects.count() == 0

    def test_remove_non_existent_member(self, client, auth_header):
        department = Department.objects.create(department_number=7)

        subgroup = Subgroup.objects.create(subgroup_number=2, department=department)

        existing_member = 'John Doe'
        non_existing_member_underscore_name = 'jonathan_doe'

        Member.objects.create(full_name=existing_member, subgroup=subgroup)

        assert Member.objects.count() == 1

        url = f'{reverse("member_remove")}?name={non_existing_member_underscore_name}&subgroup={subgroup.subgroup_number}'

        response = client.post(url, **auth_header)

        assert response.status_code == status.HTTP_404_NOT_FOUND

        assert Member.objects.count() == 1

    def test_remove_member_with_non_existent_subgroup(self, client, auth_header):
        department = Department.objects.create(department_number=7)

        existing_subgroup_number = 2
        non_existing_subgroup_number = 55

        subgroup = Subgroup.objects.create(
            subgroup_number=existing_subgroup_number, department=department
        )

        member = Member.objects.create(full_name='John Doe', subgroup=subgroup)

        assert Member.objects.count() == 1

        url = f'{reverse("member_remove")}?name={member.underscore_name}&subgroup={non_existing_subgroup_number}'

        response = client.post(url, **auth_header)

        assert response.status_code == status.HTTP_404_NOT_FOUND

        assert Member.objects.count() == 1


@pytest.mark.django_db
class TestSubgroupViews:
    def test_get_subgroups(self, client, auth_header):
        department = Department.objects.create(department_number=10)

        subgroup1 = Subgroup.objects.create(subgroup_number=4, department=department)
        member1 = Member.objects.create(full_name='John Doe')
        member1.subgroup = subgroup1

        subgroup2 = Subgroup.objects.create(subgroup_number=5, department=department)
        member2 = Member.objects.create(full_name='Jane Doe')
        member2.subgroup = subgroup2

        url = reverse('subgroups')
        response = client.post(url, **auth_header)

        expected_data = SubgroupSerializer(Subgroup.objects.all(), many=True).data

        assert response.status_code == status.HTTP_200_OK

        assert response.data == expected_data
