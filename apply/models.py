from django.db import models

from lecture.models import Lecture, Kit
from member.models import Member
from selleaf.date import Date
from selleaf.period import Period
from selleaf.time import Time


class Apply(Period):
    APPLY_STATUS = [
        (-2, '바로 구매'),
        (-3, '장바구니'),
        (0, '신청 완료'),
        (-1, '신청 취소'),
        (1, '수업 완료'),
        (2, '신청중')
    ]

    apply_status = models.IntegerField(choices=APPLY_STATUS, default=2)
    member = models.ForeignKey(Member, on_delete=models.PROTECT, null=False)
    lecture = models.ForeignKey(Lecture, on_delete=models.PROTECT, null=False)
    date = models.CharField(null=False, blank=False, max_length=100)
    time = models.CharField(null=False, blank=False, max_length=100)
    kit = models.CharField(null=False, blank=False, max_length=100, default='offline')
    quantity = models.IntegerField(null=False, blank=False, default=1)
    class Meta:
        db_table = 'tbl_apply'
        ordering = ['-id']

class Trainee(Period):
    trainee_name = models.CharField(null=False, blank=False, max_length=100)
    apply = models.ForeignKey(Apply, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_trainees'
        ordering = ['-id']
