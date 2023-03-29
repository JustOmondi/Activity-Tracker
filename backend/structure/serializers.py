
from rest_framework import serializers

from ..reports.serializers import ReportSerializer

from .models import Department, Member, SubGroup, Group

class DepartmentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Department
        fields = ('nickname', 'department_number')

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('name',)

class MemberSerializer(serializers.HyperlinkedModelSerializer):
    reports = ReportSerializer(source='report_set', many=True)

    class Meta:
        model = Member
        fields = ('full_name', 'reports')

class SubgroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SubGroup
        fields = ('nickname', 'subgroup_number')