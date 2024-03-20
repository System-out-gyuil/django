from django.db import models

from apply.models import Apply
from lecture.models import Lecture, Kit
from selleaf.date import Date
from selleaf.period import Period
from member.models import Member
from selleaf.time import Time


class Cart(Period):
    CART_STATUS = [
        (0, '결제중'),
        (1, '결제완료'),
        (-1, '결제취소'),
        (-2, '삭제')
    ]
    member = models.ForeignKey(Member, on_delete=models.PROTECT, null=False, blank=False)
    # 결제중 0, 결제 완료 1, 결제 취소  -1, 삭제 -2
    cart_status = models.IntegerField(null=False, blank=False, choices=CART_STATUS, default=0)

    class Meta:
        db_table = 'tbl_cart'
        ordering = ['-id']

    def get_absolute_url(self):
        return f'/cart/cart/?id={self.id}'


class CartDetail(Period):
    CART_DETAIL_STATUS = [
        (0, '게시중'),
        (-1, '상품 삭제'),
        (1, '결제')
    ]
    cart = models.ForeignKey(Cart, on_delete=models.PROTECT, null=False, blank=False)
    apply = models.ForeignKey(Apply, on_delete=models.PROTECT, null=False, blank=False)
    # 게시중 0, 결제 1, 상품 삭제 -1
    cart_detail_status = models.IntegerField(blank=False, null=False, default=0, choices=CART_DETAIL_STATUS)

    class Meta:
        db_table = 'tbl_cart_detail'
        ordering = ['-id']