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
      report_date = models.DateField(null=True, blank=True)
      created = models.DateTimeField(auto_now_add=True, null=True, blank=True)
      value = models.BooleanField(blank=True)

      class Meta:
            unique_together = ('name', 'member', 'report_date')

      def __str__(self):
            date = ''
            
            if self.report_date:
                  date = self.report_date.strftime("%d/%m/%Y")

            attendance = '✅' if self.value else '🚫'
            return f'{self.member.full_name} - {self.name} - {date} - {attendance}'

# TODO: Add different kinds of reports e.g. Test Scores