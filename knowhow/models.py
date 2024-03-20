from django.db import models

from member.models import Member
from plant.models import Plant
from selleaf.file import File
from selleaf.models import Like, Scrap, Tag
from selleaf.period import Period


class Knowhow(Period):
    knowhow_title = models.CharField(max_length=50, null=False)
    knowhow_content = models.CharField(max_length=500, null=False)
    knowhow_count = models.IntegerField(default=0, null=False)
    member = models.ForeignKey(Member, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_knowhow'
        ordering = ['-id']


class KnowhowFile(File):
    knowhow = models.ForeignKey(Knowhow, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_knowhow_file'
        ordering = ['-id']


class KnowhowLike(Like):
    knowhow = models.ForeignKey(Knowhow, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_knowhow_like'
        ordering = ['-id']


class KnowhowPlant(Plant):
    knowhow = models.ForeignKey(Knowhow, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_knowhow_plant'


class KnowhowRecommend(Period):
    recommend_url = models.CharField(max_length=255)
    recommend_content = models.CharField(max_length=30)
    knowhow = models.ForeignKey(Knowhow, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_knowhow_recommend'


class KnowhowScrap(Scrap):
    knowhow = models.ForeignKey(Knowhow, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_knowhow_scrap'
        ordering = ['-id']


class KnowhowTag(Tag):
    knowhow = models.ForeignKey(Knowhow, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_knowhow_tag'


class KnowhowReply(Period):
    knowhow_reply_content = models.CharField(null=False, max_length=50)
    knowhow = models.ForeignKey(Knowhow, on_delete=models.PROTECT, null=False)
    member = models.ForeignKey(Member, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_knowhow_reply'
        ordering = ['-id']


class KnowhowReplyLike(Like):
    knowhow_reply = models.ForeignKey(KnowhowReply, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_knowhow_reply_like'
        ordering = ['-id']


class KnowhowCategory(Period):
    category_name = models.CharField(max_length=50, null=False)
    knowhow = models.ForeignKey(Knowhow, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_knowhow_category'
