# accounts/urls.py

from django.urls import path
from .views import RegisterView, UserDetailView

urlpatterns = [
    # Custom Views
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('me/', UserDetailView.as_view(), name='user-detail'),
]