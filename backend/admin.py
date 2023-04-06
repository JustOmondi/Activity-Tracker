from django.contrib import admin

from backend.reports.models import Report
from .structure.models import Subgroup, Department, Group, Member

# Register your models here.
admin.site.register(Subgroup)
admin.site.register(Member)
admin.site.register(Department)
admin.site.register(Group)
admin.site.register(Report)