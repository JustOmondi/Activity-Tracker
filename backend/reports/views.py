import json
from django.http import JsonResponse
from django.shortcuts import render
from django.db.models import Count
from django.db.models.functions import ExtractWeekDay

from rest_framework.response import Response
from rest_framework.decorators import api_view

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
        reports[report_count['weekday']] = {'name': report_count['name'], 'count': report_count['count']}

    members = Member.objects.filter(subgroup__department__department_number=dept_number)
    serializer = MemberSerializer(members, many=True)

    result = {
        'reports': reports,
        'members': serializer.data
    }

    return Response(result)

@api_view(['GET'])
def getMemberWeekReport(request, member_name, report_name):
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
        reports[report_count['weekday']] = {'name': report_count['name'], 'count': report_count['count']}

    result = {
        'reports': reports,
    }

    return Response(result)
