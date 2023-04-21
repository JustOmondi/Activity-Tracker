from . import views
from django.urls import path

urlpatterns = [
    path('departments/', views.getDepartments, name='departments'),
    path('department/details/', views.getDepartment, name='department'),
    
    path('subgroups/', views.getSubgroups, name='subgroups'),
    path('subgroup/details/', views.getSubgroup, name='subgroup'),

    path('members/', views.getMembers, name='members'),
    path('member/details/', views.getMember, name='member'),
    path('member/update', views.updateMember, name='member'),
    path('member/reportsbyweek/', views.getMemberReportsByWeek, name='member_reports_by_week'),
]