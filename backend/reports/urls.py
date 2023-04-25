from . import views
from django.urls import path

urlpatterns = [
    path('update/value', views.updateReportValue, name='update_member_report'),
]