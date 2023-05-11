
from django.utils import timezone
from django.db.models.functions import ExtractIsoWeekDay
from reports.constants import REPORT_NAMES

def get_reports_by_week(report_queryset, entity, last_week=False):        
    tz_aware_now = timezone.localtime(timezone.now())    
    date_range_end = tz_aware_now.replace(hour=23, minute=59, second=59)  

    # Get first day of week i.e. Monday
    date_range_start = date_range_end - timezone.timedelta(days=date_range_end.weekday())
    date_range_start = date_range_start.replace(hour=0, minute=0, second=0)

    if last_week:
        # The start of the week for last week would simply be (Monday minus 7 days)
        date_range_start = date_range_start - timezone.timedelta(days=7)

        # The end of the week wil then be 6 days from Monday i.e. Sunday
        date_range_end = date_range_start + timezone.timedelta(days=7)

    
    reports = report_queryset.filter(
        report_date__gte=date_range_start,
        report_date__lte=date_range_end
    ).annotate(day_of_week=ExtractIsoWeekDay('report_date'))

    report_values_by_day_of_week = {}

    # Initialize the dict by setting all the report values to False for each type of report each day  
    for report_name in REPORT_NAMES:
        report_values_by_day_of_week[report_name] = {}
        for i in range(1, 8):
            if(entity == 'department'):
                report_values_by_day_of_week[report_name][i] = 0
            else:
                report_values_by_day_of_week[report_name][i] = False

    # Update the dict based on each corresponding report found in the search period
    for report in reports:
        report_name = report.name
        day_of_week = int(report.day_of_week)
        report_value = report.value

        if(entity == 'department'):
            report_values_by_day_of_week[report_name][day_of_week] += 1 if report_value else 0
        else:
            report_values_by_day_of_week[report_name][day_of_week] = report_value
        
    """Result example
        {
            'report_name 1': {
                1 : <boolean> / <number>,
                2: <boolean> / <number>,
                ...
            },
            'report_name 2': {
                1 : <boolean> / <number>,
                2: <boolean> / <number>,
                ...
            } 
        }
    """
    return report_values_by_day_of_week