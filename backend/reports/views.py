from django.utils import timezone
from reports.constants import REPORT_NAMES
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from structure.models import Department, Member

from .models import Report


@api_view(['GET', 'POST'])
def updateReportValue(request):
    # TODO: Figure out why URL params coming through on request.GET instead of request.POST
    member_name = request.GET.get('member_name')
    report_name = request.GET.get('report_name')
    update_value = request.GET.get('value')
    report_day = int(request.GET.get('day'))

    if Member.objects.filter(underscore_name=member_name).count() == 0:
        return Response(
            status=status.HTTP_404_NOT_FOUND,
            data={'message': f'Member "{member_name}" not found'},
        )

    if report_name not in REPORT_NAMES:
        return Response(
            status=status.HTTP_404_NOT_FOUND,
            data={'message': f'Report name "{report_name}" not found'},
        )

    now_datetime = timezone.localtime(timezone.now())
    current_day = now_datetime.isoweekday()

    if report_day > current_day:
        return Response(
            status=status.HTTP_400_BAD_REQUEST,
            data={'message': 'Report date needs to be before current date'},
        )

    days_difference = current_day - int(report_day)

    date_of_report = now_datetime.replace(
        hour=0, minute=0, second=0
    ) - timezone.timedelta(days=days_difference)

    lookup = Report.objects.filter(
        member__underscore_name=member_name,
        name=report_name,
        report_date=date_of_report.date(),
    )

    message = ''

    # If there are multiple reports in the lookup, delete all but the first one
    if lookup.count() > 1:
        for report in lookup[1:]:
            report.delete()

    elif lookup.count() == 1:
        report = lookup.first()
        report.value = True if update_value == "1" else False
        report.save()

        message = 'Report updated successfully'

    # If there are no existing reports, create a new one
    else:
        member = Member.objects.get(underscore_name=member_name)
        report_value = True if update_value == "1" else False
        # report_date=now_datetime.date()
        report = Report.objects.create(
            name=report_name, member=member, value=report_value
        )

        if current_day != report_day:
            report.report_date = date_of_report.date()
        else:
            report.report_date = now_datetime.date()

        report.save()

        message = 'Report created successfully'

    return Response(status=status.HTTP_200_OK, data={'message': message})


@api_view(['GET'])
def getDepartmentReportsByWeek(request):
    dept_number = request.GET.get('dept_number')

    department_lookup = Department.objects.filter(department_number=dept_number)

    if department_lookup.count() == 0:
        return Response(status=status.HTTP_404_NOT_FOUND)

    department = department_lookup.first()
    result = department.get_all_reports_this_week_and_last_week()

    return Response(result)


@api_view(['GET'])
def getDepartmentReportsByFortnight(request):
    report_name = request.GET.get('report_name')
    dept_number = request.GET.get('dept_number')

    if report_name not in REPORT_NAMES:
        return Response(status=status.HTTP_404_NOT_FOUND)

    department_lookup = Department.objects.filter(department_number=dept_number)

    if department_lookup.count() == 0:
        return Response(status=status.HTTP_404_NOT_FOUND)

    department = department_lookup.first()
    result = department.get_reports_by_fornight(report_name)

    return Response(result)
