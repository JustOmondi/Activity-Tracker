from django.db import models
from django.forms import ValidationError
import pytz
from .constants import ACTIVITY, LESSON, HOMEWORK, WEEKLY_MEETING, ATTENDANCE, PARTICIPATION

from backend.settings import TIME_ZONE

REPORT_NAMES = [
      (LESSON, LESSON.replace('_', ' ').capitalize()),
      (ACTIVITY, ACTIVITY.replace('_', ' ').capitalize()),
      (HOMEWORK, HOMEWORK.replace('_', ' ').capitalize()),
      (WEEKLY_MEETING, WEEKLY_MEETING),
]

class Report(models.Model):
    name = models.CharField(null=True, blank=True, max_length=50, choices=REPORT_NAMES)
    member = models.ForeignKey('structure.Member', on_delete=models.PROTECT, blank=False, default=None)
    updated = models.DateTimeField(auto_now=True, null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    value = models.BooleanField(blank=True)

    def __str__(self):
      current_timezone = pytz.timezone(TIME_ZONE)
      created_date_with_timezone = self.created.replace(tzinfo=current_timezone)

      return f'{self.member.full_name} - {self.name} - {created_date_with_timezone.strftime("%d/%m/%Y")}'
    
    def save(self, *args, **kwargs):
        # Check if there is an existing report with the same attributes
        existing_report = Report.objects.filter(name=self.name, member=self.member, created__date=self.created.date()).first()

        if existing_report:
            existing_report.value = self.value
            existing_report.save()

            raise ValidationError('A report with the same name, member, and date already exists.')
            
        else:
            super().save(*args, **kwargs)

# TODO: Add different kinds of reports e.g. Test Scores