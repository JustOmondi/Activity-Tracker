from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view

from backend.reports.models import Report
from backend.reports.serializers import ReportSerializer

@api_view(['GET'])
def getReport(request, report_id):
    report = Report.objects.get(id=report_id)
    serializer = ReportSerializer(report, many=False)
    return Response(serializer.data)

@api_view(['GET'])
def getReports(request):
    reports = Report.objects.all()
    serializer = ReportSerializer(reports, many=True)
    return Response(serializer.data)