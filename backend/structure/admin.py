from django.contrib import admin
from structure.models import Department, Member, Subgroup

# Register your models here.
admin.site.register(Subgroup)
admin.site.register(Member)
admin.site.register(Department)
