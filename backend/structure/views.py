from django.views.decorators.csrf import csrf_exempt

import logging

from backend.reports.constants import REPORT_NAMES

from .models import Member, Subgroup, Department
from .serializers import DepartmentSerializer, MemberSerializer, SubgroupSerializer

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

# Get an instance of a logger
logger = logging.getLogger(__name__)

@api_view(['GET'])
def getDepartment(request):
    department_number = request.GET.get('department_number')
    department_lookup = Department.objects.filter(department_number=department_number)

    if(department_lookup.count() == 0):
        return Response(status=status.HTTP_404_NOT_FOUND)

    department = department_lookup.first()

    serializer = DepartmentSerializer(department, many=False)
    
    return Response(serializer.data)

@api_view(['GET'])
def getDepartments(request):
    departments = Department.objects.all()
    serializer = DepartmentSerializer(departments, many=True)
    
    return Response(serializer.data)

@api_view(['GET'])
def getDepartmentReportsByWeek(request):
    dept_number = request.GET.get('dept_number')

    department_lookup = Department.objects.filter(department_number=dept_number)

    if(department_lookup.count() == 0):
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

    if(department_lookup.count() == 0):
        return Response(status=status.HTTP_404_NOT_FOUND)

    department = department_lookup.first()
    result = department.get_reports_by_fornight(report_name)
    
    return Response(result)

@api_view(['GET'])
def getMembers(request):
    members = Member.objects.all()
    serializer = MemberSerializer(members, many=True)
    
    return Response(serializer.data)

@api_view(['GET'])
def getMember(request):
    name = request.GET.get('name')
    member_lookup = Member.objects.filter(underscore_name=name)

    if(member_lookup.count() == 0):
        return Response(status=status.HTTP_404_NOT_FOUND)

    member = member_lookup.first()

    serializer = MemberSerializer(member, many=False)
    
    return Response(serializer.data)

@api_view(['GET', 'POST'])
def addMember(request):
    name = request.GET.get('name')
    subgroup = request.GET.get('subgroup')

    formatted_name = name.replace('_', ' ').title()
    subgroup_lookup = Subgroup.objects.filter(subgroup_number=subgroup)

    if(subgroup_lookup.count() == 0):
        return Response(status=status.HTTP_404_NOT_FOUND)

    Member.objects.create(full_name=formatted_name, subgroup=subgroup_lookup.first())
    
    return Response(status=status.HTTP_200_OK)

@api_view(['GET', 'POST'])
def removeMember(request):
    name = request.GET.get('name')
    subgroup_number = request.GET.get('subgroup')

    member_lookup = Member.objects.filter(underscore_name=name,  subgroup__subgroup_number=subgroup_number)

    if(member_lookup.count() == 0):
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    member_lookup.first().delete()

    return Response(status=status.HTTP_200_OK)

@api_view(['GET'])
def getSubgroup(request):
    subgroup_number = request.GET.get('subgroup_number')

    subgroup_lookup = Subgroup.objects.filter(subgroup_number=subgroup_number)

    if(subgroup_lookup.count() == 0):
        return Response(status=status.HTTP_404_NOT_FOUND)

    subgroup = subgroup_lookup.first()

    serializer = SubgroupSerializer(subgroup, many=False)
    
    return Response(serializer.data)

@api_view(['GET'])
def getSubgroups(request):
    subgroups = Subgroup.objects.all()
    serializer = SubgroupSerializer(subgroups, many=True)
    
    return Response(serializer.data)

@api_view(['GET'])
def getMemberReportsByWeek(request):
    name = request.GET.get('name')
    from_lastweek = request.GET.get('from_lastweek')

    member_lookup = Member.objects.filter(underscore_name=name)

    if(member_lookup.count() == 0):
        return Response(status=status.HTTP_404_NOT_FOUND)

    member = member_lookup.first()
    result = member.get_all_reports_by_week(from_lastweek == '1')
    
    return Response(result)

@api_view(['POST'])
def updateMember(request):
    name = request.GET.get('name')
    new_name = request.GET.get('new_name')
    new_subgroup = request.GET.get('new_subgroup')

    member_lookup = Member.objects.filter(underscore_name=name)

    if(member_lookup.count() == 0):
        return Response(status=status.HTTP_404_NOT_FOUND)

    member = member_lookup.first()

    if new_name:
        member.full_name = new_name.replace('_', ' ').title()

    if new_subgroup:
        subgroup_lookup = Subgroup.objects.filter(subgroup_number=int(new_subgroup))

        if(subgroup_lookup.count() == 0):
            return Response(status=status.HTTP_404_NOT_FOUND)
    
        member.subgroup = subgroup_lookup.first()

    member.save()
    
    return Response(status=status.HTTP_200_OK)