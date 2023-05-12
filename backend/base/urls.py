from . import views
from django.urls import path, include
from django.contrib import admin
from rest_framework import routers


urlpatterns = [
    # Base URL
    path('', views.getIndex,  name='index'),

    path('admin/', admin.site.urls),
    path('api/structure/', include('structure.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/logs', views.getLogs, name='logs'),
    path('api/login', views.login_request, name='login'),
    path('api/logout', views.logout_request, name='logout')
]