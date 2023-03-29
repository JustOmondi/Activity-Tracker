from django.db import models
import pytz
from .constants import ACTIVITY, LESSON, HOMEWORK, WEEKLY_MEETING, ATTENDANCE, PARTICIPATION

from backend.settings import TIME_ZONE

REPORT_NAMES = [
      (LESSON, LESSON.replace('_', ' ').capitalize()),
      (ACTIVITY, ACTIVITY.replace('_', ' ').capitalize()),
      (HOMEWORK, HOMEWORK.replace('_', ' ').capitalize()),
      (WEEKLY_MEETING, WEEKLY_MEETING),
]

REPORT_TYPES = [
      (ATTENDANCE, ATTENDANCE.replace('_', ' ').capitalize()),
      (PARTICIPATION, PARTICIPATION.replace('_', ' ').capitalize()),
]

# Create your models here.
class Report(models.Model):
    name = models.CharField(null=True, blank=True, max_length=50, choices=REPORT_NAMES)
    type = models.CharField(null=True, blank=True, max_length=50, choices=REPORT_TYPES)
    member = models.ForeignKey('structure.Member', on_delete=models.PROTECT, blank=False, default=None)
    updated = models.DateField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    value = models.BooleanField(blank=True, default=False)
    text_value = models.CharField(null=True, blank=True, max_length=110,)

    def __str__(self):
      current_timezone = pytz.timezone(TIME_ZONE)
      created_date_with_timezone = self.created.replace(tzinfo=current_timezone)

      return f'{self.member.full_name} - {self.name} - {self.type} - {created_date_with_timezone.strftime("%d/%m/%Y")}'

# TODO: Add different kinds of reports e.g. Test Scores