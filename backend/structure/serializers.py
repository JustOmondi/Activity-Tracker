from rest_framework import serializers

from .models import Department, Member, Subgroup


class DepartmentSerializer(serializers.HyperlinkedModelSerializer):
    report_totals = serializers.SerializerMethodField()

    total_members = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = (
            'name',
            'total_members',
            'report_totals',
        )

    def get_report_totals(self, object):
        return object.get_all_report_totals_by_day()

    def get_total_members(self, object):
        return object.get_total_members()


class SubgroupSerializer(serializers.HyperlinkedModelSerializer):
    report_totals = serializers.SerializerMethodField()

    total_members = serializers.SerializerMethodField()

    class Meta:
        model = Subgroup
        fields = (
            'name',
            'total_members',
            'report_totals',
        )

    def get_report_totals(self, object):
        return object.get_all_report_totals_by_day()

    def get_total_members(self, object):
        return object.get_total_members()


class MemberSerializer(serializers.HyperlinkedModelSerializer):
    reports = serializers.SerializerMethodField()

    subgroup = serializers.SerializerMethodField()

    class Meta:
        model = Member
        fields = (
            'full_name',
            'subgroup',
            'reports',
        )

    def get_reports(self, object):
        return object.get_all_reports_this_week_and_last_week()

    def get_subgroup(self, object):
        return object.subgroup.name()
