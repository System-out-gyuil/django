from django.db import models

from member.models import Member
from selleaf.period import Period


class City(Period):
    city_name = models.CharField(max_length=255, null=False, blank=False)

    class Meta:
        abstract = True


class District(City):
    district_name = models.CharField(max_length=255, null=False, blank=False)

    class Meta:
        abstract = True


class Like(Period):
    member = models.ForeignKey(Member, on_delete=models.PROTECT)
    # Ture: 좋아요 누름, False: 좋아요 안누름
    status = models.BooleanField(default=False)

    class Meta:
        abstract = True


class Mileage(Period):
    mileage_status = models.BooleanField(default=True)
    mileage = models.BigIntegerField(null=False, blank=False)

    class Meta:
        abstract = True


class Scrap(Period):
    member = models.ForeignKey(Member, on_delete=models.PROTECT)
    # Ture: 스크랩 누름, False: 스크랩 안누름
    status = models.BooleanField(default=True)

    class Meta:
        abstract = True


class Tag(Period):
    tag_name = models.CharField(max_length=50, null=False, blank=False)

    class Meta:
        abstract = True


class Report(Period):
    # 신고사유
    report_content = models.CharField(max_length=50, null=False, blank=False)
    # 신고한 사람
    member = models.ForeignKey(Member, on_delete=models.PROTECT, null=False)
    # 신고사항 처리 상태 - 게시중(1), 삭제됨(0)
    report_status = models.BooleanField(null=False, blank=False, default=True)
    object = models.Manager()

    class Meta:
        abstract = True
