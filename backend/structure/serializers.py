
from rest_framework import serializers

from ..reports.constants import ACTIVITY, LESSON, HOMEWORK, WEEKLY_MEETING

from .models import Department, Member, Subgroup, Group

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('name',)

class DepartmentSerializer(serializers.HyperlinkedModelSerializer):
    lesson_count = serializers.SerializerMethodField()
    lastweek_lesson_count = serializers.SerializerMethodField()

    homework_count = serializers.SerializerMethodField()
    lastweek_homework_count = serializers.SerializerMethodField()

    activity_count = serializers.SerializerMethodField()
    lastweek_activity_count = serializers.SerializerMethodField()

    meeting_count = serializers.SerializerMethodField()
    lastweek_meeting_count = serializers.SerializerMethodField()

    total_members = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = (
            'name',
            'total_members',
            'lesson_count',
            'lastweek_lesson_count',
            'homework_count',
            'lastweek_homework_count',
            'activity_count',
            'lastweek_activity_count',
            'meeting_count',
            'lastweek_meeting_count',
        )

    def get_lesson_count(self, object):
        return object.get_report_total(LESSON, 0)

    def get_lastweek_lesson_count(self, object):
        return object.get_report_total(LESSON, 7)
    
    def get_homework_count(self, object):
        return object.get_report_total(HOMEWORK, 0)

    def get_lastweek_homework_count(self, object):
        return object.get_report_total(HOMEWORK, 7)
    
    def get_activity_count(self, object):
        return object.get_report_total(ACTIVITY, 0)

    def get_lastweek_activity_count(self, object):
        return object.get_report_total(ACTIVITY, 7)
    
    def get_meeting_count(self, object):
        return object.get_report_total(WEEKLY_MEETING, 0)

    def get_lastweek_meeting_count(self, object):
        return object.get_report_total(WEEKLY_MEETING, 7)

    def get_total_members(self, object):
        return object.get_total_members()

class SubgroupSerializer(serializers.HyperlinkedModelSerializer):
    lesson_count = serializers.SerializerMethodField()
    lastweek_lesson_count = serializers.SerializerMethodField()

    homework_count = serializers.SerializerMethodField()
    lastweek_homework_count = serializers.SerializerMethodField()

    activity_count = serializers.SerializerMethodField()
    lastweek_activity_count = serializers.SerializerMethodField()

    meeting_count = serializers.SerializerMethodField()
    lastweek_meeting_count = serializers.SerializerMethodField()

    total_members = serializers.SerializerMethodField()

    class Meta:
        model = Subgroup
        fields = (
            'name',
            'total_members',
            'lesson_count',
            'lastweek_lesson_count',
            'homework_count',
            'lastweek_homework_count',
            'activity_count',
            'lastweek_activity_count',
            'meeting_count',
            'lastweek_meeting_count',
        )

    def get_lesson_count(self, object):
        return object.get_report_total(LESSON, 0)

    def get_lastweek_lesson_count(self, object):
        return object.get_report_total(LESSON, 7)
    
    def get_homework_count(self, object):
        return object.get_report_total(HOMEWORK, 0)

    def get_lastweek_homework_count(self, object):
        return object.get_report_total(HOMEWORK, 7)
    
    def get_activity_count(self, object):
        return object.get_report_total(ACTIVITY, 0)

    def get_lastweek_activity_count(self, object):
        return object.get_report_total(ACTIVITY, 7)
    
    def get_meeting_count(self, object):
        return object.get_report_total(WEEKLY_MEETING, 0)

    def get_lastweek_meeting_count(self, object):
        return object.get_report_total(WEEKLY_MEETING, 7)

    def get_total_members(self, object):
        return object.get_total_members()
    
class MemberSerializer(serializers.HyperlinkedModelSerializer):
    lesson_count = serializers.SerializerMethodField()
    lastweek_lesson_count = serializers.SerializerMethodField()

    homework_count = serializers.SerializerMethodField()
    lastweek_homework_count = serializers.SerializerMethodField()

    activity_count = serializers.SerializerMethodField()
    lastweek_activity_count = serializers.SerializerMethodField()

    meeting_count = serializers.SerializerMethodField()
    lastweek_meeting_count = serializers.SerializerMethodField()

    subgroup = serializers.SerializerMethodField()

    class Meta:
        model = Member
        fields = (
            'full_name',
            'lesson_count',
            'lastweek_lesson_count',
            'homework_count',
            'lastweek_homework_count',
            'activity_count',
            'lastweek_activity_count',
            'meeting_count',
            'lastweek_meeting_count',
        )

    def get_lesson_count(self, object):
        return object.get_report(LESSON, 0)

    def get_lastweek_lesson_count(self, object):
        return object.get_report(LESSON, 7)
    
    def get_homework_count(self, object):
        return object.get_report(HOMEWORK, 0)

    def get_lastweek_homework_count(self, object):
        return object.get_report(HOMEWORK, 7)
    
    def get_activity_count(self, object):
        return object.get_report(ACTIVITY, 0)

    def get_lastweek_activity_count(self, object):
        return object.get_report(ACTIVITY, 7)
    
    def get_meeting_count(self, object):
        return object.get_report(WEEKLY_MEETING, 0)

    def get_lastweek_meeting_count(self, object):
        return object.get_report(WEEKLY_MEETING, 7)
    
    def get_subgroup(self, object):
        return object.subgroup.name



