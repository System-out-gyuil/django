from django.db import models

from selleaf.period import Period


class File(Period):
    file_url = models.ImageField(upload_to='file/%Y/%m/%d')

    class Meta:
        abstract = True