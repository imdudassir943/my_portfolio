# portfolio/serializers.py

from rest_framework import serializers
from .models import Project, Skill, ContactMessage, Education, Experience, PortfolioProfile

class PortfolioProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioProfile
        fields = ["id", "profile_image", "updated_at"]

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        # Exclude 'order' field from public API if it's purely for admin sorting
        fields = ['id', 'title', 'description', 'image', 'link', 'created_at'] 

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'level']
        
class ContactMessageSerializer(serializers.ModelSerializer):
    # Note: We only need name, email, and message for *creation* (POST)
    # We exclude 'created_at' and 'id' from input.
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'message']

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = [
            'id',
            'institution',
            'degree_title',
            'field_of_study',
            'start_year',
            'end_year',
            'marks_percentage',
            'grade',
            'description',
            'order',
            'created_at'
        ]

from rest_framework import serializers
from .models import Project, Skill, ContactMessage, Education, Experience


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        # Exclude 'order' field from public API if it's purely for admin sorting
        fields = ['id', 'title', 'description', 'image', 'link', 'created_at'] 


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'level']
        

class ContactMessageSerializer(serializers.ModelSerializer):
    # Only need name, email, and message for POST creation
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'message']


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = [
            'id',
            'institution',
            'degree_title',
            'field_of_study',
            'start_year',
            'end_year',
            'marks_percentage',
            'grade',
            'description',
            'order',
            'created_at'
        ]


# ⭐ ADDING EXPERIENCE SERIALIZER HERE
class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = [
            'id',
            'job_title',
            'company',
            'location',
            'start_date',
            'end_date',
            'is_current',
            'description',
            'order',
            'created_at'
        ]
