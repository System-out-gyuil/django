from django.db import models

class LectureManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(lecture_status=True)
