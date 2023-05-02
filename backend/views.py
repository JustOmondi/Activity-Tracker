from django.http import HttpResponse

from rest_framework.response import Response
from rest_framework.decorators import api_view

from auditlog.models import LogEntry

from backend.reports.models import Report
from backend.structure.models import Member

@api_view(['GET'])
def getIndex(request):
    return Response('Index')

# Create your views here.
def index(request):
    return HttpResponse("Hello, You're at the backend index.")

@api_view(['GET'])
def getLogs(request):
    logs = LogEntry.objects.order_by('-timestamp')[:10]
    
    data = []

    for log in logs:
        model_name = log.content_type.model_class().__name__
        member_name = ''
        report_name = ''

        if log.object_pk:
            if model_name == 'Report':
                report = Report.objects.get(id=log.object_pk)
                member_name = report.member.full_name
                report_name = report.name

            if model_name == 'Member':
                member_name = Member.objects.get(id=log.object_pk).full_name

        action = ''

        if log.action == 0:
            action = 'Added'
        elif log.action == 1:
            action = 'Updated'
        elif log.action == 2:
            action = 'Removed'
        else:
            action = 'Accessed' 

        data.append({
            'action': action,
            'changes': log.changes,
            'member_name': member_name,
            'report_name': report_name.title(),
        })
    return Response(data=data)

