from django.contrib import admin
from .models import Submission, Variable, Creator, AdditionalMetadata

# Inline for Variable
class VariableInline(admin.TabularInline):
    model = Variable
    extra = 0

# Inline for Person
class CreatorInline(admin.TabularInline):
    model = Creator
    extra = 0

# Inline for AdditionalMetadata
class AdditionalMetadataInline(admin.TabularInline):
    model = AdditionalMetadata
    extra = 0

# Submission admin showing all related entries
@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ['id', 'dataset_title', 'submitted_at']
    inlines = [VariableInline, CreatorInline, AdditionalMetadataInline]
