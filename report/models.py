from django.db import models

from knowhow.models import Knowhow, KnowhowReply
from lecture.models import Lecture
from post.models import Post, PostReply
from selleaf.models import Report
from trade.models import Trade


# 거래 신고
class TradeReport(Report):
    trade = models.ForeignKey(Trade, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_trade_report'
        ordering = ['-id']


# 강의 신고
class LectureReport(Report):
    lecture = models.ForeignKey(Lecture, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_lecture_report'
        ordering = ['-id']


# 노하우 신고
class KnowhowReport(Report):
    knowhow = models.ForeignKey(Knowhow, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_knowhow_report'
        ordering = ['-id']


# 댓글 신고
class KnowhowReplyReport(Report):
    knowhow_reply = models.ForeignKey(KnowhowReply, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_knowhow_reply_report'
        ordering = ['-id']


class PostReplyReport(Report):
    post_reply = models.ForeignKey(PostReply, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_post_reply_report'
        ordering = ['-id']


# 포스트 신고
class PostReport(Report):
    post = models.ForeignKey(Post, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_post_report'
        ordering = ['-id']
