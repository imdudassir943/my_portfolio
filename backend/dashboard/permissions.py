# dashboard/permissions.py

from rest_framework import permissions

class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admin users to perform write operations (POST, PUT, DELETE).
    Allows all users (including unauthenticated) to perform read operations (GET, HEAD, OPTIONS).
    """
    def has_permission(self, request, view):
        # Read permissions are allowed to any request (public access for GET)
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the user with is_staff=True (admin)
        # Note: In a true admin dashboard, you might want to require authentication 
        # for ALL dashboard routes, including GET, so you might use IsAdminUser.
        return bool(request.user and request.user.is_staff)


class IsAuthenticatedAdmin(permissions.BasePermission):
    """
    Custom permission to ONLY allow requests from an authenticated user 
    who is also designated as a staff member (admin).
    """
    def has_permission(self, request, view):
        # Must be authenticated AND a staff member
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)