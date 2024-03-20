from django.db import models

class TradeManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(status=True)