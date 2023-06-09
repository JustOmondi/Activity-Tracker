import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from django.utils import timezone
from reports.constants import REPORT_NAMES
from reports.models import Report
from rest_framework import status


def create_all_reports_for_week(member, lastweek=False):
    tz_aware_now = timezone.localtime(timezone.now())

    now = tz_aware_now.replace(hour=0, minute=0, second=5)

    start_of_week = now - timezone.timedelta(days=now.weekday())

    loop_range = now.isoweekday()

    if lastweek:
        start_of_week = start_of_week - timezone.timedelta(days=7)
        loop_range = 7

    for report_name in REPORT_NAMES:
        for i in range(loop_range):
            # Calculate the date for the current day of the week
            day = start_of_week + timezone.timedelta(days=i)

            report = Report.objects.create(
                name=report_name, member=member, value=True, report_date=day.date()
            )

            report.created = day
            report.save()


def create_all_reports_for_fortnight(member):
    tz_aware_now = timezone.localtime(timezone.now())

    tz_aware_now = tz_aware_now.replace(hour=0, minute=0, second=5)

    date_range_start = tz_aware_now - timezone.timedelta(days=14)
    date_range_start = date_range_start.replace(hour=0, minute=0, second=0)

    for date in (date_range_start + timezone.timedelta(days=n) for n in range(14)):
        for report_name in REPORT_NAMES:
            Report.objects.create(
                report_date=date, name=report_name, member=member, value=True
            )


@pytest.fixture
def auth_header(client, db):
    User.objects.create_user(username='testuser', password='testpass')

    user_credentials = {'username': 'testuser', 'password': 'testpass'}

    response = client.post(reverse('token_pair'), data=user_credentials)

    assert response.status_code == status.HTTP_200_OK

    access_token = response.data['access']

    return {'HTTP_AUTHORIZATION': f'Bearer {access_token}'}
