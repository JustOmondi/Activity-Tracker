from django.db import models
from .constants import SUBGROUP_LEADER_TITLE, GROUP_LEADER_TITLE, DEPARTMENT_LEADER_TITLE, MEMBER_TITLE, UNREGISTERED, YG, MG, WG

# Create your models here.

class Group(models.Model):
    name = models.CharField(null=True, blank=True, max_length=110,)

    def __str__(self):
        return self.name

class Department(models.Model):
    nickname = models.CharField(null=True, blank=True, max_length=110,)
    department_id = models.IntegerField(null=False, blank=False)
    department_leader = models.ForeignKey('Member', on_delete=models.PROTECT, related_name="department_leader", null=True, blank=True)

    @property
    def members_per_subgroup(self):
        subgroups = SubGroup.objects.filter(department__department_id=self.department_id)
        member_list = f'Department {self.department_id}\n'

        for subgroup in subgroups:
            member_list += f'\n{subgroup.members_to_string}\n'
        
        return member_list

    @property
    def members_per_group(self):
        yg = Member.objects.filter(department__department_id=self.department_id, group=YG)
        wg = Member.objects.filter(department__department_id=self.department_id, group=WG)
        mg = Member.objects.filter(department__department_id=self.department_id, group=MG)
        unregistered = Member.objects.filter(department__department_id=self.department_id, group=UNREGISTERED)

        member_list = f'Department {self.department_id}\n\n'

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
        return Member.objects.filter(department_id=self.id, duty=SUBGROUP_LEADER_TITLE)

    @property
    def name(self):
        return f'Department {self.department_id} - {self.nickname}'

    def __str__(self):
        return self.name

class SubGroup(models.Model):
    nickname = models.CharField(null=True, blank=True, max_length=110,)
    subgroup_id = models.IntegerField(null=False, blank=False)
    subgroup_leader = models.ForeignKey('Member', on_delete=models.PROTECT, related_name="subgroup_leader", null=True, blank=True)
    department = models.ForeignKey('Department', on_delete=models.PROTECT, null=True, blank=True)

    @property
    def name(self):
        return f'Subgroup {self.subgroup_id}'

    @property
    def members_to_string(self):
        member_list = Member.objects.filter(subgroup__subgroup_id=self.subgroup_id).values_list('full_name', flat=True)
        return self.name + '\n' + '\n'.join(member_list)

    @property
    def members(self):
        return Member.objects.filter(subgroup__subgroup_id=self.subgroup_id)

    def __str__(self):
        return self.name
        
class Member(models.Model):
    full_name = models.CharField(null=False, blank=False, max_length=110,)
    nickname = models.CharField(null=True, blank=True, max_length=110,)
    chat_id = models.CharField(null=True, blank=True, max_length=110,)
    group = models.CharField(null=True, blank=True, max_length=45,)
    full_id = models.CharField(null=True, blank=True, max_length=70,)
    duty = models.CharField(null=True, blank=True, max_length=100,)
    subgroup = models.ForeignKey('SubGroup', on_delete=models.PROTECT, null=True,  blank=True)
    department = models.ForeignKey('Department', on_delete=models.PROTECT, null=True,  blank=True)

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

    def __str__(self):
            return self.full_name