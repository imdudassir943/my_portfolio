# dashboard/urls.py

from django.urls import path
from .views import (
    ProjectListCreate, 
    ProjectRetrieveUpdateDestroy,
    SkillListCreate,
    SkillRetrieveUpdateDestroy,
    ContactMessageList,
    ContactMessageDestroy
)

urlpatterns = [
    # Projects CRUD
    path('projects/create/', ProjectListCreate.as_view(), name='dashboard-project-list-create'),
    path('projects/update/<int:id>/', ProjectRetrieveUpdateDestroy.as_view(), name='dashboard-project-update'),
    path('projects/delete/<int:id>/', ProjectRetrieveUpdateDestroy.as_view(), name='dashboard-project-delete'),
    
    # Skills CRUD
    path('skills/create/', SkillListCreate.as_view(), name='dashboard-skill-list-create'),
    path('skills/update/<int:id>/', SkillRetrieveUpdateDestroy.as_view(), name='dashboard-skill-update'),
    path('skills/delete/<int:id>/', SkillRetrieveUpdateDestroy.as_view(), name='dashboard-skill-delete'),

    # Contact Messages Read/Delete
    path('contact/messages/', ContactMessageList.as_view(), name='dashboard-contact-list'),
    path('contact/messages/delete/<int:id>/', ContactMessageDestroy.as_view(), name='dashboard-contact-delete'),
]