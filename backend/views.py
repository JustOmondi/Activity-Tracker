import json
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
    
    report_data = []
    member_data = []
    report_count = 0
    member_count = 0

    for log in logs:
        model_name = log.content_type.model_class().__name__
        action = ''

        if log.action == 0:
            action = 'added'
        elif log.action == 1:
            action = 'updated'
        elif log.action == 2:
            action = 'removed'
        else:
            action = 'accessed' 

        if log.object_pk:
            if model_name == 'Report':
                report = Report.all_items.get(id=log.object_pk)
                member_name = report.member.full_name
                report_name = report.name.replace('_', ' ')
                report_date = report.report_date

                report_data.append({'member_name': member_name, 'report_name': report_name, 'report_date': report_date, 'changes': []})
                changes = json.loads(log.changes)

                for key in changes:
                    report_data[report_count]['changes'].append({
                        'action': action,
                        'item': key.replace('_', ' '),
                        'previous_value': changes.get(key)[0],
                        'new_value': changes.get(key)[1]
                    })
                
                report_count += 1

            if model_name == 'Member':
                member_name = Member.all_items.get(id=log.object_pk).full_name
                member_data.append({'member_name': member_name, 'changes': []})
                changes = json.loads(log.changes)

                for key in changes:
                    if(key == 'is_deleted'):
                        action = 'removed'
                    member_data[member_count]['changes'].append({
                        'action': action,
                        'item': key.replace('_', ' '),
                        'previous_value': changes.get(key)[0],
                        'new_value': changes.get(key)[1]
                    })

                member_count += 1

    data = {
        'member_changes': member_data,
        'report_changes': report_data,
    }
    
    return Response(data=data)

