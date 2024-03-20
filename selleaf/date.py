from django.db import models

from lecture.models import Lecture
from selleaf.period import Period


class Date(Period):
    date = models.DateField(null=False, blank=False)
    lecture = models.ForeignKey(Lecture, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_date'
