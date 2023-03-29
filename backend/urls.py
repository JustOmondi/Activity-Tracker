
"""Backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from . import views
from django.urls import path, include
from django.contrib import admin
from rest_framework import routers


urlpatterns = [
    # Base URL
    # path('', views.index, name='index'),
    path('', views.getIndex,  name='index'),

    path('departments/', views.getDepartments, name='departments'),
    path('department/<int:department_number>/', views.getDepartment, name='department'),
    
    path('subgroups/', views.getSubgroups, name='subgroups'),
    path('subgroup/<int:subgroup_number>/', views.getSubgroup, name='subgroup'),

    path('members/', views.getMembers, name='members'),
    path('member/<int:member_id>/', views.getMember, name='member'),

    path('admin/', admin.site.urls),

    path('reports/', include('backend.reports.urls')),
]
