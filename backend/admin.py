from django.contrib import admin
from .structure.models import SubGroup, Department, Group, Member

# Register your models here.
admin.site.register(SubGroup)
admin.site.register(Member)
admin.site.register(Department)
admin.site.register(Group)
