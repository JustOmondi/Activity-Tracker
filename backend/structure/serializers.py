
from rest_framework import serializers

from .models import Department, Member, SubGroup, Group

class DepartmentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Department
        fields = ('nickname', 'department_id')

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('name',)

class MemberSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Member
        fields = ('full_name',)

class SubgroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SubGroup
        fields = ('nickname', 'subgroup_id')