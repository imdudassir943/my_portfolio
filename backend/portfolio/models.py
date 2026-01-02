# portfolio/models.py

from django.db import models

class PortfolioProfile(models.Model):
    profile_image = models.ImageField(upload_to="profile", null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "Portfolio Profile"

class Project(models.Model):
    # Field to track ordering on the portfolio page
    order = models.IntegerField(default=0)
    title = models.CharField(max_length=200)
    description = models.TextField()
    # Assuming you've configured MEDIA_ROOT/MEDIA_URL for image uploads
    image = models.ImageField(upload_to="projects/") 
    link = models.URLField(blank=True, null=True) # Make link optional
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Order by a custom 'order' field, then by creation date
        ordering = ['order', '-created_at'] 

    def __str__(self):
        return self.title

class Skill(models.Model):
    name = models.CharField(max_length=100)
    # Consider using choices for 'level' for consistency, e.g., 'Beginner', 'Intermediate', 'Expert'
    level = models.CharField(max_length=50) 
    order = models.IntegerField(default=0) # Field to track ordering

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Order messages newest first
        ordering = ['-created_at'] 

    def __str__(self):
        return f"Message from {self.name} ({self.email})"
    
class Education(models.Model):
    order = models.IntegerField(default=0)   # For sorting same as Projects/Skills

    institution = models.CharField(max_length=255)
    degree_title = models.CharField(max_length=255)
    field_of_study = models.CharField(max_length=255, blank=True, null=True)

    start_year = models.IntegerField()
    end_year = models.IntegerField(blank=True, null=True)  # null means still studying

    # Optional academic details
    marks_percentage = models.DecimalField(
        max_digits=5, decimal_places=2, blank=True, null=True
    )

    grade = models.CharField(
        max_length=20, blank=True, null=True
    )  # Example: "A+", "First Division"

    description = models.TextField(blank=True, null=True)  # Short notes (optional)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-start_year']

    def __str__(self):
        return f"{self.degree_title} at {self.institution}"

class Experience(models.Model):
    job_title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=200, blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)  # null means present
    is_current = models.BooleanField(default=False)

    description = models.TextField(blank=True, null=True)

    order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']  # sort by order ascending

    def __str__(self):
        return f"{self.job_title} at {self.company}"