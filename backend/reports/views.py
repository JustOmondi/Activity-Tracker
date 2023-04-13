from django.db.models import Count
from django.db.models.functions import ExtractWeekDay
from rest_framework import status
from django.utils import timezone

from rest_framework.response import Response
from rest_framework.decorators import api_view
from backend.reports.constants import REPORT_NAMES

from backend.structure.serializers import MemberSerializer

from ..structure.models import Department, Subgroup, Member

from .models import Report
from .serializers import ReportSerializer

@api_view(['GET'])
def getReportId(request, id):
    report = Report.objects.get(id=id)
    serializer = ReportSerializer(report, many=False)
    return Response(serializer.data)

@api_view(['GET'])
def getDepartmentWeekReport(request, dept_number, report_name):
    if (Report.objects.filter(name=report_name).count() == 0):
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if (Department.objects.filter(department_number=dept_number).count() == 0):
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if report_name == 'all':
        report_counts_by_day = Report.objects.annotate(
            weekday=ExtractWeekDay('created')
        ).values('weekday', 'name').annotate(
            count=Count('id')
        ).filter(
            weekday__lte=5,  # Only count weekdays (Monday = 1, Friday = 5)
            member__subgroup__department__department_number=dept_number
        )
    else:
        report_counts_by_day = Report.objects.annotate(
            weekday=ExtractWeekDay('created')
        ).values('weekday', 'name').annotate(
            count=Count('id')
        ).filter(
            weekday__lte=5,  # Only count weekdays (Monday = 1, Friday = 5)
            name=report_name,
            member__subgroup__department__department_number=dept_number
        )

    reports = {}
    for report_count in report_counts_by_day:
        reports[report_count['weekday']] = {'count': report_count['count']}

    members = Member.objects.filter(subgroup__department__department_number=dept_number)
    serializer = MemberSerializer(members, many=True)

    result = {
        'reports': reports,
        'members': serializer.data
    }

    return Response(result)

@api_view(['GET'])
def getMemberWeekReport(request, member_name, report_name):
    if (Report.objects.filter(name=report_name).count() == 0):
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if (Member.objects.filter(underscore_name=member_name).count() == 0):
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    report_counts_by_day = Report.objects.annotate(
        weekday=ExtractWeekDay('created')
    ).values('weekday', 'name').annotate(
        count=Count('id')
    ).filter(
        weekday__lte=5,  # Only count weekdays (Monday = 1, Friday = 5)
        name=report_name,
        member__underscore_name=member_name
    )

    reports = {}
    for report_count in report_counts_by_day:
        reports[report_count['weekday']] = {'count': report_count['count']}

    result = {
        'reports': reports,
    }

    return Response(result)

@api_view(['POST'])
def updateMemberReport(request):
    # TODO: Figure out why URL params coming through on request.GET instead of request.POST
    member_name = request.GET.get('member_name')
    report_name = request.GET.get('report_name')
    update_value = request.GET.get('update_value')
    
    if (Member.objects.filter(underscore_name=member_name).count() == 0):
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if (report_name not in REPORT_NAMES):
        return Response(status=status.HTTP_404_NOT_FOUND)

    start_of_day=timezone.now().replace(hour=0, minute=0, second=0)
    end_of_day=timezone.now().replace(hour=23, minute=59, second=59)

    lookup = Report.objects.filter(
        member__underscore_name=member_name,
        name=report_name,
        created__gte=start_of_day,
        created__lte=end_of_day
    )

    if(lookup.count() == 1):
        report = lookup.first()
        report.value = True if update_value=="1" else False
        report.save()

        return Response(status=status.HTTP_200_OK)
    
    lookup.delete()
    member = Member.objects.get(underscore_name=member_name)
    report_value = True if update_value=="1" else False
    report = Report.objects.create(name=report_name, member=member, value=report_value)
    report.save()

    return Response(status=status.HTTP_200_OK)
