import pytest
from django.utils import timezone
from reports.models import Report
from structure.models import Member, Department, Subgroup

@pytest.fixture()
def subgroup(db):
    department = Department.objects.create(department_number=999)
    member = Member.objects.create(full_name='Test Member')
    subgroup = Subgroup.objects.create(
        nickname='Test Subgroup',
        subgroup_number=1,
        department=department
    )
    return subgroup

@pytest.fixture()
def member(db, subgroup):
    return Member.objects.create(
            full_name='John Doe',
            underscore_name='john_doe',
            full_id='Test Group:John Doe',
            duty='Test Duty',
            subgroup=subgroup
        )

@pytest.fixture()
def report(db, member):

    tz_aware_now = timezone.localtime(timezone.now())    

    return Report.objects.create(
        name='report name',
        member=member,
        value=True,
        report_date=tz_aware_now.date()
    )

def test_report_str(report):
    report_str = str(report)

    expected_str = f'{report.member.full_name} - {report.name} - {report.report_date.strftime("%d/%m/%Y")} - ✅'
    assert report_str == expected_str
