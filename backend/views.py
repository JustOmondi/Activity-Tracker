
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
import sys
import json
import logging

from .structure.models import Member
from .structure.serializers import MemberSerializer
from rest_framework import viewsets

# Get an instance of a logger
logger = logging.getLogger(__name__)

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

