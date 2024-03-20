from django.db import models

from selleaf.date import Date
from selleaf.period import Period


class Time(Period):
    time = models.CharField(null=False, blank=False, max_length=100)
    date = models.ForeignKey(Date, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_time'
