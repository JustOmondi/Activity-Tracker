from . import views
from django.urls import path

urlpatterns = [
    path('departments', views.getDepartments, name='departments'),
    path('department/details', views.getDepartment, name='department_details'),
    path('department/reportsbyweek', views.getDepartmentReportsByWeek, name='department_reports_by_week'),
    
    path('subgroups', views.getSubgroups, name='subgroups'),
    path('subgroup/details', views.getSubgroup, name='subgroup'),

    path('members', views.getMembers, name='members'),
    path('member/details', views.getMember, name='member_details'),
    path('member/update', views.updateMember, name='member_update'),
    path('member/add', views.addMember, name='member_add'),
    path('member/remove', views.removeMember, name='member_remove'),
    path('member/reportsbyweek', views.getMemberReportsByWeek, name='member_reports_by_week'),
]