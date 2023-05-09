
from django.utils import timezone
from django.db.models import CharField, ForeignKey, PROTECT, DateTimeField, IntegerField
from django.db.models.functions import ExtractIsoWeekDay

from auditlog.registry import auditlog

from ..models import BaseModel

from ..reports.models import Report
from ..reports.constants import REPORT_NAMES

from .constants import SUBGROUP_LEADER_TITLE, YG

def get_default_department():
    """ get a default value for subgroup department; create new department if not available """
    return Department.objects.get_or_create(department_number=1)[0].id

def get_default_subgroup():
    """ get a default value for subgroup department; create new department if not available """
    department = Department.objects.get_or_create(department_number=1)[0]
    subgroup = Subgroup.objects.get_or_create(subgroup_number=1, department=department)[0]
    return subgroup.id

class Department(BaseModel):
    nickname = CharField(null=True, blank=True, max_length=110,)
    department_number = IntegerField(null=False, blank=False)
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
    
    # TODO: Refactor get_all_reports to be more extensible and less redundant
    def get_all_report_totals_by_day(self):   
        totals = {}

        for report_name in REPORT_NAMES:
            current_count = 0
            lastweek_count = 0

            for subgroup in self.subgroup_set.all():
                current_count += subgroup.get_report_total(report_name, 0)
                lastweek_count += subgroup.get_report_total(report_name, 7)

            totals[report_name] = {
                'this_week': current_count,
                'last_week': lastweek_count
            }
        
        return totals
    
    def get_total_members(self):
        count = 0
        for subgroup in self.subgroup_set.all():
            count += subgroup.get_total_members()

        return count

    def get_all_reports_by_week(self, last_week=False):       
        # Get reports and annotate with the day of the week
        date_range_end = timezone.now().replace(hour=23, minute=59, second=59)        

        # Get first day of week i.e. Sunday
        date_range_start = date_range_end - timezone.timedelta(days=date_range_end.weekday())
        date_range_start = date_range_start.replace(hour=0, minute=0, second=0)

        if last_week:
            # The start of the week for last week would simply be (Sunday - 7 days)
            date_range_start = date_range_start - timezone.timedelta(days=7)

            # The end of the week wil then be 6 days from Sunday i.e. Saturday
            date_range_end = date_range_start + timezone.timedelta(days=7)

        # print(f'/////////// FUNCTION: Start of week = {date_range_start.strftime("%m/%d/%Y, %H:%M:%S")} ///////////////////')
        # print(f'/////////// FUNCTION: Date Range End = {date_range_end.strftime("%m/%d/%Y, %H:%M:%S")} ISOweekday = {date_range_end.isoweekday()} ///////////////////')
        # Group reports by name and day of the week
        report_values_by_day_of_week = {}

        # Initialize the dict by setting all the report values to False for each type of report each day  
        for report_name in REPORT_NAMES:
            report_values_by_day_of_week[report_name] = {}
            for i in range(1, 8):
                report_values_by_day_of_week[report_name][i] = 0

        reports = Report.objects.filter(
            report_date__gte=date_range_start,
            report_date__lte=date_range_end,
            member__subgroup__department__department_number=self.department_number,
        ).annotate(day_of_week=ExtractIsoWeekDay('report_date'))

        # Update the dict based on each corresponding report found in the search period
        for report in reports:
            report_name = report.name
            day_of_week = int(report.day_of_week)
            report_value = report.value

            # print(f'/////////// FUNCTION: Report Created = {report.created.strftime("%m/%d/%Y, %H:%M:%S")} DAY OF WEEK = {day_of_week} DAY={report.created.isoweekday()}///////////////////')

            report_values_by_day_of_week[report_name][day_of_week] += 1 if report_value else 0

        return report_values_by_day_of_week
    
    def get_reports_by_fornight(self, report_name):       
        date_range_end = timezone.now().replace(hour=23, minute=59, second=59)        


        date_range_start = date_range_end - timezone.timedelta(days=14)
        date_range_start = date_range_start.replace(hour=0, minute=0, second=0)

        values = []
        labels = []

        for date in (date_range_start + timezone.timedelta(days=n) for n in range(14)):
            reports = Report.objects.filter(
                report_date=date,
                name=report_name
            )

            total = 0

            for report in reports:
                if report.value:
                    total += 1

            values.append(total)
            labels.append(date.strftime('%d %b'))

        return {
            'values': values,
            'labels': labels
        }
    
    def get_all_reports_this_week_and_last_week(self):
        return {
            'this_week': self.get_all_reports_by_week(),
            'last_week': self.get_all_reports_by_week(last_week=True)
        }
    
    def __str__(self):
        return self.name()

class Subgroup(BaseModel):
    nickname = CharField(null=True, blank=True, max_length=110,)
    subgroup_number = IntegerField(null=False, blank=False)
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
    
    def get_all_report_totals_by_day(self):  
        totals = {}

        for report_name in REPORT_NAMES:
            current_count = 0
            lastweek_count = 0

            for member in self.member_set.all():
                current_count += member.get_report(report_name, 0)
                lastweek_count += member.get_report(report_name, 7) 

            totals[report_name] = {
                'this_week': current_count,
                'last_week': lastweek_count
            }
        
        return totals

    def __str__(self):
        return self.name()
        
class Member(BaseModel):
    full_name = CharField(null=False, blank=False, max_length=110,)
    underscore_name = CharField(null=True, blank=True, max_length=110,)
    chat_id = CharField(null=True, blank=True, max_length=110,)
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
        
        count = self.report_set.filter(name=report_name, created__gte=date_range_start, created__lt=date_range_end,value=True).count()
        
        return count

    def get_all_reports_by_day(self): 
        totals = {}

        for report_name in REPORT_NAMES:    
            current_count = self.get_report(report_name, 0)
            lastweek_count = self.get_report(report_name, 7)

            current_key = f'{report_name}_count'
            lastweek_key = f'lastweek_{report_name}_count'

            totals[current_key] = current_count
            totals[lastweek_key] = lastweek_count
        
        return totals
    
    def get_all_reports_by_week(self, last_week=False):       
        # Get reports and annotate with the day of the week
        date_range_end = timezone.now().replace(hour=23, minute=59, second=59)        

        # Get first day of week i.e. Sunday
        date_range_start = date_range_end - timezone.timedelta(days=date_range_end.weekday())
        date_range_start = date_range_start.replace(hour=0, minute=0, second=0)

        if last_week:
            # The start of the week for last week would simply be (Sunday - 7 days)
            date_range_start = date_range_start - timezone.timedelta(days=7)

            # The end of the week wil then be 6 days from Sunday i.e. Saturday
            date_range_end = date_range_start + timezone.timedelta(days=7)

        # print(f'/////////// FUNCTION: Start of week = {date_range_start.strftime("%m/%d/%Y, %H:%M:%S")} ///////////////////')
        # print(f'/////////// FUNCTION: Date Range End = {date_range_end.strftime("%m/%d/%Y, %H:%M:%S")} ISOweekday = {date_range_end.isoweekday()} ///////////////////')
        # Group reports by name and day of the week
        report_values_by_day_of_week = {}

        # Initialize the dict by setting all the report values to False for each type of report each day  
        for report_name in REPORT_NAMES:
            report_values_by_day_of_week[report_name] = {}
            for i in range(1, 8):
                report_values_by_day_of_week[report_name][i] = False

        reports = self.report_set.filter(
            report_date__gte=date_range_start,
            report_date__lte=date_range_end
        ).annotate(day_of_week=ExtractIsoWeekDay('report_date'))

        # Update the dict based on each corresponding report found in the search period
        for report in reports:
            report_name = report.name
            day_of_week = int(report.day_of_week)
            report_value = report.value

            # print(f'/////////// FUNCTION: Report Created = {report.created.strftime("%m/%d/%Y, %H:%M:%S")} DAY OF WEEK = {day_of_week} DAY={report.created.isoweekday()}///////////////////')

            report_values_by_day_of_week[report_name][day_of_week] = report_value

        return report_values_by_day_of_week
    
    def get_all_reports_this_week_and_last_week(self):
        return {
            'this_week': self.get_all_reports_by_week(),
            'last_week': self.get_all_reports_by_week(last_week=True)
        }
    
    def save(self, *args, **kwargs):
        if not self.pk:
            split_fullname = self.full_name.lower().split(" ")
            underscore_name = '_'.join(split_fullname)

            existing_member_lookup = Member.objects.filter(underscore_name=underscore_name, subgroup=self.subgroup, is_deleted=False)

            if(existing_member_lookup.exists()):
                self.full_name = f'{self.full_name} {existing_member_lookup.count() + 1}'

        split_fullname = self.full_name.lower().split(" ")
        self.underscore_name = '_'.join(split_fullname)

        super().save(*args, **kwargs)

    def __str__(self):
            return self.full_name
    
auditlog.register(Department, serialize_data=True, exclude_fields=['is_deleted', 'updated', 'created'])
auditlog.register(Subgroup, serialize_data=True, exclude_fields=['is_deleted', 'updated', 'created'])
auditlog.register(Member, serialize_data=True, exclude_fields=['underscore_name', 'updated', 'created'])