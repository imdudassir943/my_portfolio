# backend/urls.py (main project file)

from django.contrib import admin
from django.urls import path, include

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView, # Used for logout
)
# You'll likely need these for serving media files (images) during development
from django.conf import settings 
from django.conf.urls.static import static 

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API Endpoints
    path('api/portfolio/', include('portfolio.urls')), 
    path('api/dashboard/', include('dashboard.urls')),

    # JWT Authentication Endpoints (Login, Refresh, Logout)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # POST (Login)
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # POST (Refresh)
    path('api/token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'), # POST (Logout)

    # Custom accounts views (e.g., Register, User Detail)
    path('api/accounts/', include('accounts.urls')),
]

# Only for development: serves media files (like project images)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)