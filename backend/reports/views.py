from django.db.models import Count
from django.db.models.functions import ExtractWeekDay
from rest_framework import status
from django.utils import timezone

from rest_framework.response import Response
from rest_framework.decorators import api_view
from backend.reports.constants import REPORT_NAMES

from backend.structure.serializers import MemberSerializer

from ..structure.models import Department, Member

from .models import Report

@api_view(['GET', 'POST'])
def updateReportValue(request):
    # TODO: Figure out why URL params coming through on request.GET instead of request.POST
    member_name = request.GET.get('member_name')
    report_name = request.GET.get('report_name')
    update_value = request.GET.get('value')
    report_day = int(request.GET.get('day'))
    
    if (Member.objects.filter(underscore_name=member_name).count() == 0):
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if (report_name not in REPORT_NAMES):
        return Response(status=status.HTTP_404_NOT_FOUND)

    now_datetime = timezone.now()
    current_day = now_datetime.isoweekday()

    days_difference = current_day - int(report_day)

    start_of_day = now_datetime.replace(hour=0, minute=0, second=0) - timezone.timedelta(days=days_difference)
    
    lookup = Report.objects.filter(
        member__underscore_name=member_name,
        name=report_name,
        day=report_day,
    )

    # If there are multiple reports in the lookup, delete all but the first one 
    if lookup.count() > 1:
        for report in lookup[1:]:
            report.delete()

    elif(lookup.count() == 1):
        report = lookup.first()
        report.value = True if update_value=="1" else False
        report.save()

    # If there are no exiting reports, create a new one        
    else:
        member = Member.objects.get(underscore_name=member_name)
        report_value = True if update_value=="1" else False
        report = Report.objects.create(name=report_name, member=member, value=report_value, day=current_day)

        if(current_day != report_day):
            report.created = start_of_day

        report.save()

    return Response(status=status.HTTP_200_OK, data={'message': 'Report created successfully'})
