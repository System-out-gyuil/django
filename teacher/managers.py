from django.db import models

class TeacherManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(teacher_status=True)