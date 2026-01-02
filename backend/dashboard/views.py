# dashboard/views.py

from rest_framework import generics
# We need to import the models and serializers from the portfolio app
from portfolio.models import Project, Skill, ContactMessage 
from portfolio.serializers import ProjectSerializer, SkillSerializer, ContactMessageSerializer 
from .permissions import IsAuthenticatedAdmin

# --- Project CRUD ---

class ProjectListCreate(generics.ListCreateAPIView):
    """ GET: List all projects (for admin view); POST: Create a new project. """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticatedAdmin] # **LOCKDOWN**

class ProjectRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    """ GET: Retrieve; PUT/PATCH: Update; DELETE: Delete a project. """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticatedAdmin] # **LOCKDOWN**
    lookup_field = 'id' # Use primary key ID for lookup

# --- Skill CRUD ---

class SkillListCreate(generics.ListCreateAPIView):
    """ GET: List all skills (for admin view); POST: Create a new skill. """
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticatedAdmin] # **LOCKDOWN**

class SkillRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    """ GET: Retrieve; PUT/PATCH: Update; DELETE: Delete a skill. """
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticatedAdmin] # **LOCKDOWN**
    lookup_field = 'id'

# --- Contact Message Read-Only ---

class ContactMessageList(generics.ListAPIView):
    """ GET: View all submitted contact messages (Admin ONLY). """
    # Since these are messages, we generally only allow viewing and maybe deleting.
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer 
    permission_classes = [IsAuthenticatedAdmin] # **LOCKDOWN**

class ContactMessageDestroy(generics.DestroyAPIView):
    """ DELETE: Delete a specific contact message. """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAuthenticatedAdmin] # **LOCKDOWN**
    lookup_field = 'id'