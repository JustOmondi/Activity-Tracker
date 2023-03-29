from django.db import models

# Create your models here.
class Report(models.Model):
    name = models.CharField(null=True, blank=True, max_length=110,)
    type = models.CharField(null=True, blank=True, max_length=50,)
    report_id = models.IntegerField(null=False, blank=False)
    member = models.ForeignKey('structure.Member', on_delete=models.PROTECT, blank=False, default=None)
    updated = models.DateField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    value = models.BooleanField(blank=True, default=False)
    text_value = models.CharField(null=True, blank=True, max_length=110,)

    def __str__(self):
            return f'{self.member.full_name} - {self.name} - {self.type}'

# TODO: Add different kinds of reports e.g. Test Scores