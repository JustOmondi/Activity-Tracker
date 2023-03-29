from . import views
from django.urls import path


urlpatterns = [
    path('', views.getReports, name='reports'),
    path('<int:report_id>/', views.getReport, name='report'),
]