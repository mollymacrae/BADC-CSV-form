from django.db import models

class Submission(models.Model):
    dataset_title = models.CharField(max_length=255, null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.dataset_title or 'Untitled'} (ID: {self.id}) at {self.submitted_at}"


class Variable(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name='variables', null=True, blank=True)
    long_name = models.CharField(max_length=200)
    standard_name = models.CharField(max_length=200, blank=True, null=True)
    type = models.CharField(max_length=100, blank=True, null=True)
    column_number = models.CharField(max_length=10)  # Allows 'G' as well as numbers
    units = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.long_name} (Column: {self.column_number})"
    
class Creator(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name='creators')
    ROLE_CHOICES = [
        ('creator', 'Creator'),
        ('contributor', 'Contributor'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    person_column_number = models.CharField(max_length=10)
    name = models.CharField(max_length=200, blank=True, null=True)
    institution = models.CharField(max_length=200, blank=True, null=True)
    additional_creator_info = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return f"{self.name}, {self.institution}"
    

class AdditionalMetadata(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name='metadata', null=True, blank=True)
    TYPE_CHOICES = [
        ('coordinate_variable', 'Coordinate variable'),
        ('comment', 'Comment'),
        ('start_time', 'Start time'),
        ('end_time', 'End time'),
        ('rights', 'Rights'),
        ('last_revised_date', 'Last revised date'),
        ('history', 'History')
    ]
    metadata_column_number = models.CharField(max_length=10, blank=True, null=True)
    metadata_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    metadata_value = models.TextField()

    def __str__(self):
        return f"{self.metadata_type}: {self.metadata_value[:50]}"