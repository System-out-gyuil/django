from django.db import models

from apply.models import Apply
from lecture.models import Kit, Lecture
from member.models import Member, MemberAddress
from selleaf.models import Mileage
from selleaf.period import Period


class Order(Period):
    order_receiver = models.CharField(max_length=100, null=False, blank=False)
    phone = models.CharField(max_length=50, null=False, blank=False)
    kit = models.ForeignKey(Kit, on_delete=models.PROTECT, null=False)
    address = models.ForeignKey(MemberAddress, on_delete=models.PROTECT, null=False)
    member = models.ForeignKey(Member, on_delete=models.PROTECT, null=False, blank=False)

    class Meta:
        db_table = 'tbl_order'
        ordering = ['-id']


class OrderDetail(Period):
    ORDER_STATUS = [
        (0, '진행중'),
        (-1, '삭제'),
        (1, '결제완료'),
    ]

    apply = models.ForeignKey(Apply, on_delete=models.PROTECT, null=False, blank=False)
    order = models.ForeignKey(Order, on_delete=models.PROTECT, null=False, blank=False)
    order_status = models.IntegerField(choices=ORDER_STATUS, default=0)

    class Meta:
        db_table = 'tbl_order_detail'
        ordering = ['-id']


class OrderMileage(Mileage):
    member = models.ForeignKey(Member, on_delete=models.PROTECT, null=False, blank=False)
    order = models.ForeignKey(Order, on_delete=models.PROTECT, null=False, blank=False)

    class Meta:
        db_table = 'tbl_order_mileage'
        ordering = ['-id']
