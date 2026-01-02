# accounts/views.py

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import RegisterSerializer
from rest_framework.permissions import IsAuthenticated

class RegisterView(generics.CreateAPIView):
    """
    POST /api/accounts/register/
    Registers a new user. Publicly accessible.
    """
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

class UserDetailView(generics.RetrieveAPIView):
    """
    GET /api/accounts/me/
    Returns the authenticated user's details. Requires valid JWT access token.
    """
    # Note: We don't use queryset=User.objects.all() here because we only want the requesting user
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        # Simply returns the user object attached to the request by the JWT middleware
        return self.request.user 
        
    def get(self, request, *args, **kwargs):
        # Customize the response to include relevant user details
        user = self.get_object()
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_staff': user.is_staff # Crucial for dashboard permission check
        }, status=status.HTTP_200_OK)