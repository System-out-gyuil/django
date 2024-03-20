from django.db import models

from selleaf.period import Period


class Plant(Period):
    plant_name = models.CharField(max_length=50, null=False, blank=False)

    class Meta:
        db_table = 'tbl_plant'
        abstract = True
