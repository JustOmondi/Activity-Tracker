from . import views
from django.urls import path

urlpatterns = [
    path('departments/', views.getDepartments, name='departments'),
    path('department/details/', views.getDepartment, name='department'),
    
    path('subgroups/', views.getSubgroups, name='subgroups'),
    path('subgroup/details/', views.getSubgroup, name='subgroup'),

    path('members/', views.getMembers, name='members'),
    path('member/details/', views.getMember, name='member'),
    path('member/weekreports/', views.getMemberWeekReports, name='member_week_reports'),
]