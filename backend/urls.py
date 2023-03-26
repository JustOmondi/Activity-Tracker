
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
from django.urls import path
from django.contrib import admin

urlpatterns = [
    # Base URL
    path('', views.index, name='index'),

    # Example: /group/4
    path('group/<int:group_id>/', views.group, name='subgroup'),

    # Example: /department/4
    path('department/<int:department_id>/', views.department, name='department'),

    # Example: /subgroup/4
    path('subgroup/<int:subgroup_id>/', views.subgroup, name='subgroup'),

    # Example: /member/4
    path('member/<int:member_id>/', views.member, name='member'),
    
    path('admin/', admin.site.urls),
]
