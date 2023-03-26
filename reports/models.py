from django.db import models
from structure.models import SubGroup, Department, Group, Member

# Create your models here.
class Report(models.Model):
    name = models.CharField(null=True, blank=True, max_length=110,)
    report_id = models.IntegerField(null=False, blank=False)
    member = models.ForeignKey('structure.Member', on_delete=models.PROTECT, related_name="report_member", null=True, blank=True)
    updated = models.DateField(auto_now=True)
    value = models.BooleanField(blank=True, default=False)
    text_value = models.CharField(null=True, blank=True, max_length=110,)

# TODO: Add different kinds of reports e.g. Test Scores