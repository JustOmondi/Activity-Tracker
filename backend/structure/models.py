
from datetime import datetime, timedelta
import pytz
from django.db.models import CharField, Count, Case, ForeignKey, Model, PROTECT, When, DateTimeField, IntegerField, Q

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

    @property
    def members_per_group(self):
        yg = Member.objects.filter(department__department_number=self.department_number, group=YG)
        wg = Member.objects.filter(department__department_number=self.department_number, group=WG)
        mg = Member.objects.filter(department__department_number=self.department_number, group=MG)
        unregistered = Member.objects.filter(department__department_number=self.department_number, group=UNREGISTERED)

        member_list = f'Department {self.department_number}\n\n'

        if(yg.count() > 0):
            member_list += f'{YG} registered: {yg.count()}' + '\n----\n'
            member_list += '\n'.join(list(yg.values_list("full_name", flat=True))) + '\n\n'

        if(wg.count() > 0):
            member_list += f'{WG} registered: {wg.count()}' + '\n----\n'
            member_list += '\n'.join(list(wg.values_list("full_name", flat=True))) + '\n\n'

        if(mg.count() > 0):
            member_list += f'{MG} registered: {mg.count()}' + '\n----\n'
            member_list += '\n'.join(list(mg.values_list("full_name", flat=True))) + '\n\n'

        if(unregistered.count() > 0):
            member_list += f'{UNREGISTERED}: {unregistered.count()}' +'\n----\n'
            member_list += '\n'.join(list(unregistered.values_list("full_name", flat=True))) + '\n\n'
        
        return member_list

    @property
    def leaders(self):
        return Member.objects.filter(department_number=self.id, duty=SUBGROUP_LEADER_TITLE)

    @property
    def name(self):
        return f'Department {self.department_number}'
    
    def get_report_total(self, report_name, days_ago):       
        count = 0
        for subgroup in self.subgroup_set.all():
            count += subgroup.get_report_total(report_name, days_ago)
        
        return count
    
    def get_total_members(self):
        count = 0
        for subgroup in self.subgroup_set.all():
            count += subgroup.get_total_members()

        return count

    def __str__(self):
        return self.name

class Subgroup(Model):
    nickname = CharField(null=True, blank=True, max_length=110,)
    subgroup_number = IntegerField(null=False, blank=False)
    subgroup_leader = ForeignKey('Member', on_delete=PROTECT, related_name="subgroup_leader", null=True, blank=True)
    department = ForeignKey('Department', on_delete=PROTECT, null=False, blank=False, default=get_default_department)
    updated = DateTimeField(auto_now=True)
    created = DateTimeField(auto_now_add=True)

    @property
    def name(self):
        return f'Subgroup {self.subgroup_number}'

    @property
    def members_to_string(self):
        member_list = self.member_set.all().values_list('full_name', flat=True)
        return self.name + '\n' + '\n'.join(member_list)

    def get_total_members(self):
        return self.member_set.all().count()
    
    def get_report_total(self, report_name, days_ago):       
        count = 0
        for member in self.member_set.all():
            count += member.get_report(report_name, days_ago)
        
        return count

    def __str__(self):
        return self.name
        
class Member(Model):
    full_name = CharField(null=False, blank=False, max_length=110,)
    nickname = CharField(null=True, blank=True, max_length=110,)
    chat_id = CharField(null=True, blank=True, max_length=110,)
    group = CharField(null=True, blank=True, max_length=45,)
    full_id = CharField(null=True, blank=True, max_length=70,)
    duty = CharField(null=True, blank=True, max_length=100,)
    subgroup = ForeignKey('SubGroup', on_delete=PROTECT, null=False,  blank=False, default=get_default_subgroup)
    updated = DateTimeField(auto_now=True)
    created = DateTimeField(auto_now_add=True)

    @property
    def name(self):
        return str(self.full_name.split(' ')[0])

    @property
    def underscore_name(self):
        return f'{self.full_name.split(" ")[0]}_{self.full_name.split(" ")[1]}_{self.subgroup.id}'

    def get_member_from_string(underscore_name):
        string_list = underscore_name.split("_")
        name = string_list[0]
        return Member.objects.get(full_name__icontains=name)
    
    def get_report(self, report_name, days_ago):
        current_timezone = pytz.timezone(TIME_ZONE)
        date_range = datetime.now().replace(tzinfo=current_timezone) - timedelta(days=days_ago)
        
        count = self.report_set.filter(name=report_name, created__gte=date_range).count()
        
        return count


    def __str__(self):
            return self.full_name