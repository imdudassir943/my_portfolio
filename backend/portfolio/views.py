# portfolio/views.py

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings
from .models import Project, Skill, ContactMessage, Education, Experience, PortfolioProfile
from .serializers import ProjectSerializer, SkillSerializer, ContactMessageSerializer, EducationSerializer, ExperienceSerializer, PortfolioProfileSerializer
# 1. Import Parsers for Image Uploads
from rest_framework.parsers import MultiPartParser, FormParser
# 2. Import JWT Authentication
from rest_framework_simplejwt.authentication import JWTAuthentication 
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny

# --- Public GET Endpoints ---

class ProjectList(generics.ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class ProjectAdminListCreate(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]  # Only staff/admins can POST
    parser_classes = [MultiPartParser, FormParser] # Needed for image uploads


    def perform_create(self, serializer):
        serializer.save()

class ProjectAdminDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

# portfolio/views.py

class SkillList(generics.ListCreateAPIView):  # Changed to ListCreateAPIView
    """
    GET: Publicly list all skills.
    POST: Admin only can create skills.
    """
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminUser()]
        return []

    def get_authenticators(self):
        if self.request.method == 'POST':
            return [JWTAuthentication()]
        return []
    
class SkillAdminDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]
# --- Contact Form Endpoint ---

class ContactMessageCreate(APIView):

    permission_classes = [AllowAny] 
    authentication_classes = []
    def post(self, request, format=None):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            
            # --- Add Email Logic Here ---
            try:
                subject = f"New Contact: {serializer.validated_data.get('name')}"
                message = f"Message from: {serializer.validated_data.get('email')}\n\n{serializer.validated_data.get('message')}"
                send_mail(
                    subject, 
                    message, 
                    settings.EMAIL_HOST_USER, 
                    [settings.EMAIL_HOST_USER]
                )
            except Exception as e:
                print(f"Email failed: {e}") 
            # ---------------------------

            return Response(
                {"detail": "Message sent successfully!"}, 
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ContactMessageListView(generics.ListAPIView):
    queryset = ContactMessage.objects.all().order_by("-created_at")
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAuthenticated]

# --- Public GET Education Endpoint ---

class EducationList(generics.ListAPIView):
    """
    GET /api/portfolio/education/
    Publicly list all education records.
    """
    queryset = Education.objects.all()
    serializer_class = EducationSerializer


# --- Admin CRUD for Education ---

class EducationAdminListCreate(generics.ListCreateAPIView):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    permission_classes = [IsAdminUser]


class EducationAdminDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    permission_classes = [IsAdminUser]

# --- Public GET Experience Endpoint ---

class ExperienceList(generics.ListAPIView):
    """
    GET /api/portfolio/experience/
    Public list of all experience entries.
    """
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer


# --- Admin CRUD for Experience ---

class ExperienceAdminListCreate(generics.ListCreateAPIView):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [IsAdminUser]


class ExperienceAdminDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [IsAdminUser]

class ProfileListCreateView(generics.ListCreateAPIView):
    queryset = PortfolioProfile.objects.all()
    serializer_class = PortfolioProfileSerializer
    
    # 2. Add this line to force Token recognition
    authentication_classes = [JWTAuthentication] 
    
    # 3. Change IsAdminUser to IsAuthenticated
    permission_classes = [IsAuthenticated] 
    
    # 4. Allow file uploads
    parser_classes = [MultiPartParser, FormParser]

    # Optional: Associate the profile with the user automatically
    def perform_create(self, serializer):
        # Only works if your Profile model has a 'user' field
        # serializer.save(user=self.request.user) 
        serializer.save()

class ProfileRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PortfolioProfile.objects.all()
    serializer_class = PortfolioProfileSerializer
    
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    lookup_field = "id"