from django.contrib import admin
from django.urls import include, path

from . import views

urlpatterns = [
    path('', views.getIndex, name='index'),
    path('admin/', admin.site.urls),
    path('api/structure/', include('structure.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/logs', views.getLogs, name='logs'),
    path('api/login', views.login_request, name='login'),
    path('api/logout', views.logout_request, name='logout'),
]
