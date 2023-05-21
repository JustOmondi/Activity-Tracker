from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt import views as jwt_views

from . import views

urlpatterns = [
    path('', views.getIndex, name='index'),
    path('admin', admin.site.urls),
    path('api/structure', include('structure.urls')),
    path('api/reports', include('reports.urls')),
    path('api/login', views.login_request, name='login'),
    path('api/logout', views.logout_request, name='logout'),
    path(
        'api/token', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'
    ),
    path(
        'api/token/refresh', jwt_views.TokenRefreshView.as_view(), name='token_refresh'
    ),
]
