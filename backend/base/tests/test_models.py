import pytest
from structure.models import Member, Department, Subgroup

@pytest.mark.django_db
def test_model_soft_deletion():
    department1 = Department.objects.create(department_number=5)
    department2 = Department.objects.create(department_number=11)

    subgroup = Subgroup.objects.create(subgroup_number=2, department=department1)
    member = Member.objects.create(full_name='John Doe', subgroup=subgroup)
    
    Department.objects.all().delete()
    member.delete()

    assert Department.objects.count() == 0
    assert Member.objects.count() == 0

    assert Member.all_items.count() == 1
    assert Department.all_items.count() == 2

    department1.refresh_from_db()
    department2.refresh_from_db()
    member.refresh_from_db()

    assert department1.is_deleted == True
    assert department2.is_deleted == True
    assert member.is_deleted == True