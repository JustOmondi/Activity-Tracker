from django.urls import path

from . import views

urlpatterns = [
    path('update/value', views.updateReportValue, name='update_member_report'),
    path(
        'get/department/by-week',
        views.getDepartmentReportsByWeek,
        name='department_reports_by_week',
    ),
    path(
        'get/department/by-fortnight',
        views.getDepartmentReportsByFortnight,
        name='department_reports_by_fortnight',
    ),
]
