
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
import sys
import json
import logging

from .structure.models import Member, SubGroup, Department
from .structure.serializers import DepartmentSerializer, MemberSerializer, SubgroupSerializer
from rest_framework import viewsets
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
def getMember(request, member_id):
    member = Member.objects.get(id=member_id)
    serializer = MemberSerializer(member, many=False)
    return Response(serializer.data)

@api_view(['GET'])
def getSubgroup(request, subgroup_number):
    subgroup = SubGroup.objects.get(subgroup_number=subgroup_number)
    serializer = SubgroupSerializer(subgroup, many=False)
    return Response(serializer.data)

@api_view(['GET'])
def getSubgroups(request):
    subgroups = SubGroup.objects.all()
    serializer = SubgroupSerializer(subgroups, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getIndex(request):
    return Response('Index')

# Create your views here.
def index(request):
    return HttpResponse("Hello, You're at the backend index.")

def group(request, group_id):
    return HttpResponse(f"You're looking at Group {group_id}.")

def department(request, department_id):
    return HttpResponse(f"You're looking at Department {department_id}.")

def subgroup(request, subgroup_id):
    return HttpResponse(f"You're looking at Subgroup {subgroup_id}.")

class MemberViewset(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer

