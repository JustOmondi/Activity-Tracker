
from datetime import datetime
import pytz
from django.utils import timezone
from django.db.models import CharField, Count, Case, ForeignKey, Model, PROTECT, When, DateTimeField, IntegerField, Q
from backend.reports.constants import ACTIVITY, HOMEWORK, LESSON, WEEKLY_MEETING

from backend.settings import TIME_ZONE
from .constants import SUBGROUP_LEADER_TITLE, GROUP_LEADER_TITLE, DEPARTMENT_LEADER_TITLE, MEMBER_TITLE, UNREGISTERED, YG, MG, WG


def get_default_department():
    """ get a default value for subgroup department; create new department if not available """
    return Department.objects.get_or_create(department_number=1)[0].id


def get_default_subgroup():
    """ get a default value for subgroup department; create new department if not available """
    department = Department.objects.get_or_create(department_number=1)[0]
    subgroup = Subgroup.objects.get_or_create(subgroup_number=1, department=department)[0]
    return subgroup.id

class Group(Model):
    name = CharField(null=True, blank=True, max_length=110,)
    updated = DateTimeField(auto_now=True)
    created = DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Department(Model):
    nickname = CharField(null=True, blank=True, max_length=110,)
    department_number = IntegerField(null=False, blank=False)
    department_leader = ForeignKey('Member', on_delete=PROTECT, related_name="department_leader", null=True, blank=True)
    updated = DateTimeField(auto_now=True)
    created = DateTimeField(auto_now_add=True)

    @property
    def members_per_subgroup(self):
        subgroups = Subgroup.objects.filter(department__department_number=self.department_number)
        member_list = f'Department {self.department_number}\n'

        for subgroup in subgroups:
            member_list += f'\n{subgroup.members_to_string}\n'
        
        return member_list

    def leaders(self):
        return Member.objects.filter(department_number=self.id, duty=SUBGROUP_LEADER_TITLE)

    def name(self):
        return f'Department {self.department_number}'
    
    def get_report_total(self, report_name, days_ago):       
        count = 0
        for subgroup in self.subgroup_set.all():
            count += subgroup.get_report_total(report_name, days_ago)
        
        return count
    
    def get_all_report_totals(self):       
        lesson_count = 0
        lastweek_lesson_count = 0

        homework_count = 0
        lastweek_homework_count = 0

        activity_count = 0
        lastweek_activity_count = 0

        weekly_meeting_count = 0
        lastweek_weekly_meeting_count = 0

        for subgroup in self.subgroup_set.all():
            lesson_count += subgroup.get_report_total(LESSON, 0)
            lastweek_lesson_count += subgroup.get_report_total(LESSON, 7)

            homework_count += subgroup.get_report_total(HOMEWORK, 0)
            lastweek_homework_count += subgroup.get_report_total(HOMEWORK, 7)

            activity_count += subgroup.get_report_total(ACTIVITY, 0)
            lastweek_activity_count += subgroup.get_report_total(ACTIVITY, 7)

            weekly_meeting_count += subgroup.get_report_total(WEEKLY_MEETING, 0)
            lastweek_weekly_meeting_count += subgroup.get_report_total(WEEKLY_MEETING, 7)

        totals = {
            'lesson_count': lesson_count,
            'lastweek_lesson_count': lastweek_lesson_count,
            'homework_count': homework_count,
            'lastweek_homework_count': lastweek_homework_count,
            'activity_count': activity_count,
            'lastweek_activity_count': lastweek_activity_count,
            'weekly_meeting_count': weekly_meeting_count,
            'lastweek_weekly_meeting_count': lastweek_weekly_meeting_count
        }
        
        return totals
    
    def get_total_members(self):
        count = 0
        for subgroup in self.subgroup_set.all():
            count += subgroup.get_total_members()

        return count

    def __str__(self):
        return self.name()

class Subgroup(Model):
    nickname = CharField(null=True, blank=True, max_length=110,)
    subgroup_number = IntegerField(null=False, blank=False)
    subgroup_leader = ForeignKey('Member', on_delete=PROTECT, related_name="subgroup_leader", null=True, blank=True)
    department = ForeignKey('Department', on_delete=PROTECT, null=False, blank=False, default=get_default_department)
    updated = DateTimeField(auto_now=True)
    created = DateTimeField(auto_now_add=True)

    def name(self):
        return f'Subgroup {self.subgroup_number}'

    def members_to_string(self):
        member_list = self.member_set.all().values_list('full_name', flat=True)
        return self.name() + '\n' + '\n'.join(member_list)

    def get_total_members(self):
        return self.member_set.all().count()
    
    def get_report_total(self, report_name, days_ago):       
        count = 0
        for member in self.member_set.all():
            count += member.get_report(report_name, days_ago)
        
        return count
    
    def get_all_report_totals(self):       
        lesson_count = 0
        lastweek_lesson_count = 0

        homework_count = 0
        lastweek_homework_count = 0

        activity_count = 0
        lastweek_activity_count = 0

        weekly_meeting_count = 0
        lastweek_weekly_meeting_count = 0

        for member in self.member_set.all():
            lesson_count += member.get_report(LESSON, 0)
            lastweek_lesson_count += member.get_report(LESSON, 7)

            homework_count += member.get_report(HOMEWORK, 0)
            lastweek_homework_count += member.get_report(HOMEWORK, 7)

            activity_count += member.get_report(ACTIVITY, 0)
            lastweek_activity_count += member.get_report(ACTIVITY, 7)

            weekly_meeting_count += member.get_report(WEEKLY_MEETING, 0)
            lastweek_weekly_meeting_count += member.get_report(WEEKLY_MEETING, 7)

        totals = {
            'lesson_count': lesson_count,
            'lastweek_lesson_count': lastweek_lesson_count,
            'homework_count': homework_count,
            'lastweek_homework_count': lastweek_homework_count,
            'activity_count': activity_count,
            'lastweek_activity_count': lastweek_activity_count,
            'weekly_meeting_count': weekly_meeting_count,
            'lastweek_weekly_meeting_count': lastweek_weekly_meeting_count
        }
        
        return totals

    def __str__(self):
        return self.name()
        
class Member(Model):
    full_name = CharField(null=False, blank=False, max_length=110,)
    underscore_name = CharField(null=True, blank=True, max_length=110,)
    chat_id = CharField(null=True, blank=True, max_length=110,)
    group = CharField(null=True, blank=True, max_length=45, default=YG)
    full_id = CharField(null=True, blank=True, max_length=70,)
    duty = CharField(null=True, blank=True, max_length=100,)
    subgroup = ForeignKey('SubGroup', on_delete=PROTECT, null=False,  blank=False, default=get_default_subgroup)
    updated = DateTimeField(auto_now=True)
    created = DateTimeField(auto_now_add=True)

    def name(self):
        return str(self.full_name.split(' ')[0])

    def get_member_from_string(underscore_name):
        string_list = underscore_name.split("_")
        name = string_list[0]
        return Member.objects.get(full_name__icontains=name)
    
    def get_report(self, report_name, days_ago):      
        # Get the current datetime in the local timezone
        now = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)

        date_range_start = (now - timezone.timedelta(days=days_ago))
        date_range_end = date_range_start + timezone.timedelta(days=1)
        
        count = self.report_set.filter(name=report_name, created__gte=date_range_start, created__lt=date_range_end).count()
        
        return count

    def get_all_reports(self):       
        lesson_count = self.get_report(LESSON, 0)
        lastweek_lesson_count = self.get_report(LESSON, 7)

        homework_count = self.get_report(HOMEWORK, 0)
        lastweek_homework_count = self.get_report(HOMEWORK, 7)

        activity_count = self.get_report(ACTIVITY, 0)
        lastweek_activity_count = self.get_report(ACTIVITY, 7)

        weekly_meeting_count = self.get_report(WEEKLY_MEETING, 0)
        lastweek_weekly_meeting_count = self.get_report(WEEKLY_MEETING, 7)            

        totals = {
            'lesson_count': lesson_count,
            'lastweek_lesson_count': lastweek_lesson_count,
            'homework_count': homework_count,
            'lastweek_homework_count': lastweek_homework_count,
            'activity_count': activity_count,
            'lastweek_activity_count': lastweek_activity_count,
            'weekly_meeting_count': weekly_meeting_count,
            'lastweek_weekly_meeting_count': lastweek_weekly_meeting_count
        }
        
        return totals
    
    def save(self, *args, **kwargs):
        if self.underscore_name == None:
            split_fullname = self.full_name.lower().split(" ")
            self.underscore_name = f'{split_fullname[0]}_{split_fullname[1]}'

        super().save(*args, **kwargs)

    def __str__(self):
            return self.full_name