from django.db import models

from member.models import Member
from plant.models import Plant
from selleaf.file import File
from selleaf.models import Scrap
from trade.managers import TradeManager
from selleaf.period import Period


class TradeCategory(Period):
    category_name = models.CharField(null=False, blank=False, max_length=10)

    class Meta:
        db_table = 'tbl_trade_category'


class Trade(Period):
    trade_price = models.IntegerField(null=False, blank=False, default=0)
    trade_title = models.CharField(null=False, blank=False, max_length=80)
    trade_content = models.CharField(null=False, blank=False, max_length=200)
    # 게시중: True, 게시 취소: False
    status = models.BooleanField(null=False, blank=False, default=True)
    kakao_talk_url = models.CharField(null=False, blank=False, max_length=500)
    member = models.ForeignKey(Member, on_delete=models.PROTECT, null=False)
    trade_category = models.ForeignKey(TradeCategory, on_delete=models.PROTECT, null=False)

    objects = models.Manager()
    enabled_objects = TradeManager()

    class Meta:
        db_table = 'tbl_trade'
        ordering = ['-id']


class TradeFile(File):
    trade = models.ForeignKey(Trade, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_trade_file'
        ordering = ['-id']


class TradePlant(Plant):
    trade = models.ForeignKey(Trade, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_trade_plant'


class TradeScrap(Scrap):
    trade = models.ForeignKey(Trade, on_delete=models.PROTECT, null=False)


    class Meta:
        db_table = 'tbl_trade_scrap'
        ordering = ['-id']
