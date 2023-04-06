from backend.settings import TIME_ZONE
import pytest
from datetime import datetime, timedelta
from pytz import timezone
from .models import Report
from ..structure.models import Member, Department, Subgroup

@pytest.fixture()
def subgroup(db):
    department = Department.objects.create(department_number=999)
    member = Member.objects.create(full_name='Test Member')
    subgroup = Subgroup.objects.create(
        nickname='Test Subgroup',
        subgroup_number=1,
        subgroup_leader=member,
        department=department
    )
    return subgroup

@pytest.fixture()
def member(db, subgroup):
    return Member.objects.create(
            full_name='John Doe',
            underscore_name='john_doe',
            chat_id='1234567890',
            group='Test Group',
            full_id='Test Group:John Doe',
            duty='Test Duty',
            subgroup=subgroup
        )

@pytest.fixture()
def report(db, member):
    return Report.objects.create(
        name='report name',
        member=member,
        value=True
    )

def test_report_str(report):
    report_str = str(report)
    expected_str = f'{report.member.full_name} - {report.name} - {report.created.astimezone(timezone(TIME_ZONE)).strftime("%d/%m/%Y")}'
    assert report_str == expected_str

def test_report_created_date(db, member):
    now = timezone(TIME_ZONE).localize(datetime.now())
    report = Report.objects.create(
        name='report name 2',
        member=member,
        value=True
    )
    assert (now - report.created) <= timedelta(seconds=1)

def test_report_updated_date(report):
    now = timezone(TIME_ZONE).localize(datetime.now())
    report.value = False
    report.save()
    assert (now - report.updated) <= timedelta(seconds=1)

def test_report_value_default(db, member):
    report = Report.objects.create(
        name='report name 3',
        member=member
    )
    assert not report.value
