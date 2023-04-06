from . import views
from django.urls import path


urlpatterns = [
    path('<int:id>', views.getReportId, name='report'),
    path('department-week/<str:dept_number>/<str:report_name>', views.getDepartmentWeekReport, name='department_week_report'),
    path('member-week/<str:member_name>/<str:report_name>', views.getMemberWeekReport, name='member_week_report'),
    path('member-update/<str:member_name>/<str:report_name>/<int:update_value>', views.updateMemberReport, name='update_member_report'),
]