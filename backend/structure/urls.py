from . import views
from django.urls import path

urlpatterns = [
    path('departments/', views.getDepartments, name='departments'),
    path('department/<int:department_number>/', views.getDepartment, name='department'),
    
    path('subgroups/', views.getSubgroups, name='subgroups'),
    path('subgroup/<int:subgroup_number>/', views.getSubgroup, name='subgroup'),

    path('members/', views.getMembers, name='members'),
    path('member/<str:name>/', views.getMember, name='member'),
]