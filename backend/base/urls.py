from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views

urlpatterns = [
    path('', views.getIndex, name='index'),
    path('admin', admin.site.urls),
    path('api/structure/', include('structure.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/logout', views.logout_request, name='logout'),
    path('api/token', TokenObtainPairView.as_view(), name='token_pair'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]
