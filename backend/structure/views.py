from django.views.decorators.csrf import csrf_exempt

import logging

from .models import Member, Subgroup, Department
from .serializers import DepartmentSerializer, MemberSerializer, SubgroupSerializer

from rest_framework.response import Response
from rest_framework.decorators import api_view

# Get an instance of a logger
logger = logging.getLogger(__name__)

@api_view(['GET'])
def getDepartment(request, department_number):
    department = Department.objects.get(department_number=department_number)
    serializer = DepartmentSerializer(department, many=False)
    
    return Response(serializer.data)

@api_view(['GET'])
def getDepartments(request):
    departments = Department.objects.all()
    serializer = DepartmentSerializer(departments, many=True)
    
    return Response(serializer.data)

@api_view(['GET'])
def getMembers(request):
    members = Member.objects.all()
    serializer = MemberSerializer(members, many=True)
    
    return Response(serializer.data)

@api_view(['GET'])
def getMember(request, name):
    member = Member.objects.get(underscore_name=name)
    serializer = MemberSerializer(member, many=False)
    
    return Response(serializer.data)

@api_view(['GET'])
def getSubgroup(request, subgroup_number):
    subgroup = Subgroup.objects.get(subgroup_number=subgroup_number)
    serializer = SubgroupSerializer(subgroup, many=False)
    
    return Response(serializer.data)

@api_view(['GET'])
def getSubgroups(request):
    subgroups = Subgroup.objects.all()
    serializer = SubgroupSerializer(subgroups, many=True)
    
    return Response(serializer.data)
