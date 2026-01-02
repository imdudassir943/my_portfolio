# portfolio/urls.py

from django.urls import path
from .views import ProjectList, ContactMessageListView,  SkillAdminDetail, ProjectAdminDetail, ProjectAdminListCreate, SkillList, ContactMessageCreate, EducationList, EducationAdminListCreate, EducationAdminDetail, ExperienceList, ExperienceAdminListCreate, ExperienceAdminDetail, ProfileListCreateView, ProfileRetrieveUpdateDestroyView

urlpatterns = [
    # Public GET endpoints
    path('projects/', ProjectList.as_view(), name='project-list'),
    path('add/projects/', ProjectAdminListCreate.as_view(), name='project-admin-list-create'),
    path('admin/projects/<int:pk>/', ProjectAdminDetail.as_view(), name='project-admin-detail'),

    path('skills/', SkillList.as_view(), name='skill-list'),
    path('admin/skills/<int:pk>/', SkillAdminDetail.as_view(), name='skill-admin-detail'),
    path('education/', EducationList.as_view(), name='education-list'),
    path('experience/', ExperienceList.as_view(), name='experience-list'),

    
    # Contact Form POST endpoint
    path('contact/', ContactMessageCreate.as_view(), name='contact-create'),
    path("contact/messages/", ContactMessageListView.as_view()),

    # Profile Image GET POST endpoint
    path('profile/', ProfileListCreateView.as_view(), name='profile-list-create'),
    path('profile/<int:id>/', ProfileRetrieveUpdateDestroyView.as_view(), name='profile-detail'),

    # --- Admin CRUD endpoints for Education ---
    path('admin/education/', EducationAdminListCreate.as_view(), name='education-admin-list-create'),
    path('admin/education/<int:pk>/', EducationAdminDetail.as_view(), name='education-admin-detail'),

    # --- Admin CRUD endpoints for Experience ---
    path('admin/experience/', ExperienceAdminListCreate.as_view(), name='experience-admin-list-create'),
    path('admin/experience/<int:pk>/', ExperienceAdminDetail.as_view(), name='experience-admin-detail'),
]