
from rest_framework import serializers

from ..reports.serializers import ReportSerializer

from .models import Department, Member, SubGroup, Group

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('name',)

class DepartmentSerializer(serializers.HyperlinkedModelSerializer):
    lesson_count = serializers.SerializerMethodField()
    homework_count = serializers.SerializerMethodField()
    activity_count = serializers.SerializerMethodField()
    meeting_count = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ('nickname', 'department_number', 'lesson_count', 'homework_count', 'activity_count', 'meeting_count')

    def get_lesson_count(self, object):
        return object.get_today_report_total('lesson')
    
    def get_homework_count(self, object):
        return object.get_today_report_total('homework')
    
    def get_activity_count(self, object):
        return object.get_today_report_total('activity')
    
    def get_meeting_count(self, object):
        return object.get_today_report_total('weekly_meeting')

class SubgroupSerializer(serializers.HyperlinkedModelSerializer):
    lesson_count = serializers.SerializerMethodField()
    homework_count = serializers.SerializerMethodField()
    activity_count = serializers.SerializerMethodField()
    meeting_count = serializers.SerializerMethodField()

    class Meta:
        model = SubGroup
        fields = ('nickname', 'subgroup_number', 'lesson_count', 'homework_count', 'activity_count', 'meeting_count')

    def get_lesson_count(self, object):
        return object.get_today_report_total('lesson')
    
    def get_homework_count(self, object):
        return object.get_today_report_total('homework')
    
    def get_activity_count(self, object):
        return object.get_today_report_total('activity')
    
    def get_meeting_count(self, object):
        return object.get_today_report_total('weekly_meeting')
    
class MemberSerializer(serializers.HyperlinkedModelSerializer):
    lesson_count = serializers.SerializerMethodField()
    homework_count = serializers.SerializerMethodField()
    activity_count = serializers.SerializerMethodField()
    meeting_count = serializers.SerializerMethodField()

    class Meta:
        model = Member
        fields = ('full_name', 'lesson_count', 'homework_count', 'activity_count', 'meeting_count')

    def get_lesson_count(self, object):
        return object.get_today_report('lesson')
    
    def get_homework_count(self, object):
        return object.get_today_report('homework')
    
    def get_activity_count(self, object):
        return object.get_today_report('activity')
    
    def get_meeting_count(self, object):
        return object.get_today_report('weekly_meeting')



