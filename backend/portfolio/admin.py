from django.contrib import admin
from .models import Project, Skill, ContactMessage, Education, Experience, PortfolioProfile

admin.site.site_header = "Mudassir Admin Dashboard"
admin.site.site_title = "Portfolio Admin"
admin.site.index_title = "Welcome to My Portfoliio Admin Panel"

@admin.register(PortfolioProfile)
class PortfolioProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'updated_at')

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "order", "created_at", "link")
    list_filter = ("created_at",)
    search_fields = ("title", "description")
    ordering = ("order", "-created_at")
    list_editable = ("order",)


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("name", "level", "order")
    search_fields = ("name", "level")
    ordering = ("order", "name")
    list_editable = ("order",)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "created_at")
    search_fields = ("name", "email", "message")
    readonly_fields = ("name", "email", "message", "created_at")
    ordering = ("-created_at",)


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = (
        "degree_title",
        "institution",
        "start_year",
        "end_year",
        "marks_percentage",
        "grade",
        "order",
    )
    search_fields = (
        "degree_title",
        "institution",
        "field_of_study",
        "grade",
    )
    list_filter = ("start_year", "end_year", "grade")
    ordering = ("order", "-start_year")
    list_editable = ("order",)


# ⭐ NEW: Experience Model Admin
@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = (
        "job_title",
        "company",
        "location",
        "start_date",
        "end_date",
        "is_current",
        "order",
    )
    search_fields = (
        "job_title",
        "company",
        "location",
        "description",
    )
    list_filter = ("start_date", "end_date", "is_current")
    ordering = ("order", "start_date")
    list_editable = ("order",)
