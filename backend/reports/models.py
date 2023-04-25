from django.db import models

from django.utils import timezone
from .constants import ACTIVITY, LESSON, HOMEWORK, WEEKLY_MEETING, ATTENDANCE, PARTICIPATION

from backend.settings import TIME_ZONE

REPORT_NAMES = [
      (LESSON, LESSON.replace('_', ' ').capitalize()),
      (ACTIVITY, ACTIVITY.replace('_', ' ').capitalize()),
      (HOMEWORK, HOMEWORK.replace('_', ' ').capitalize()),
      (WEEKLY_MEETING, WEEKLY_MEETING.replace('_', ' ').capitalize()),
]

class Report(models.Model):
      name = models.CharField(null=True, blank=True, max_length=50, choices=REPORT_NAMES)
      member = models.ForeignKey('structure.Member', on_delete=models.PROTECT, blank=False, default=None)
      updated = models.DateTimeField(auto_now=True, null=True, blank=True)
      created = models.DateTimeField(auto_now_add=True, null=True, blank=True)
      day = models.IntegerField(null=True, blank=True)
      value = models.BooleanField(blank=True)

      class Meta:
            unique_together = ('name', 'member', 'day')

      def save(self, *args, **kwargs):
            self.day = self.created.isoweekday()
            
            super().save(*args, **kwargs)

      def __str__(self):
            attendance = '✅' if self.value else '🚫'
            return f'{self.member.full_name} - {self.name} - {self.created.strftime("%d/%m/%Y")} - {attendance}'

# TODO: Add different kinds of reports e.g. Test Scores