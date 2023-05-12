from . import views
from django.urls import path

urlpatterns = [
    path('department/details', views.getDepartment, name='department_details'),
    
    path('subgroups', views.getSubgroups, name='subgroups'),

    path('members', views.getMembers, name='members'),
    path('member/update', views.updateMember, name='member_update'),
    path('member/add', views.addMember, name='member_add'),
    path('member/remove', views.removeMember, name='member_remove'),
]