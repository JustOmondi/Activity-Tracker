from . import views
from django.urls import path


urlpatterns = [
    path('<int:id>', views.getReportId, name='report'),
    path('<str:dept_number>/<str:report_name>', views.getDepartmentWeekReport, name='department_week_report'),
    path('<str:member_name>/<str:report_name>', views.getMemberWeekReport, name='member_week_report'),
]