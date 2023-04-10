from . import views
from django.urls import path, include
from django.contrib import admin
from rest_framework import routers


urlpatterns = [
    # Base URL
    path('', views.getIndex,  name='index'),

    path('admin/', admin.site.urls),
    path('api/structure/', include('backend.structure.urls')),
    path('api/reports/', include('backend.reports.urls')),
]
