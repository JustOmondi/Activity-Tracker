from django.contrib import admin

from reports.models import Report
from structure.models import Subgroup, Department, Member

# Register your models here.
admin.site.register(Subgroup)
admin.site.register(Member)
admin.site.register(Department)
admin.site.register(Report)
