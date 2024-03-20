from django.contrib.auth.models import User
from django.db import models

from lecture.manager import LectureManager
from member.models import Member
from plant.models import Plant
from selleaf.address import Address
from selleaf.file import File
from selleaf.models import Scrap
from selleaf.period import Period
from teacher.models import Teacher


class LectureCategory(Period):
    lecture_category_name = models.CharField(null=False, blank=False, max_length=100)

    class Meta:
        db_table = 'tbl_lecture_category'
        ordering = ['-id']


class Lecture(Period):
    lecture_price = models.BigIntegerField(null=False, blank=False, default=0)
    lecture_headcount = models.IntegerField(null=False, blank=False, default=0)
    lecture_title = models.CharField(null=False, blank=False, max_length=100)
    lecture_content = models.CharField(null=False, blank=False, max_length=225)
    # lecture_status : False = 신청중, True = 마감
    lecture_status = models.BooleanField(null=False, blank=False, default=False)
    # online_status : False = 오프라인 강의, True = 온라인 강의
    online_status = models.BooleanField(null=False, blank=False, default=False)
    lecture_category = models.ForeignKey(LectureCategory, on_delete=models.PROTECT, null=False)
    teacher = models.ForeignKey(Teacher, on_delete=models.PROTECT, null=False)

    objects = models.Manager()
    enabled_objects = LectureManager()

    class Meta:
        db_table = 'tbl_lecture'
        ordering = ['-id']


class LecturePlant(Plant):
    lecture = models.ForeignKey(Lecture, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_lecture_plant'


class LectureProductFile(File):
    lecture = models.ForeignKey(Lecture, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_lecture_product_file'
        ordering = ['-id']


class LectureScrap(Scrap):
    lecture = models.ForeignKey(Lecture, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_lecture_scrap'


class Kit(Period):
    kit_name = models.CharField(null=False, blank=False, max_length=100)
    kit_content = models.CharField(null=False, blank=False, max_length=225)
    lecture = models.ForeignKey(Lecture, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_kit'
        ordering = ['-id']


class LectureReview(Period):
    review_title = models.CharField(null=False, blank=False, max_length=100)
    review_content = models.CharField(null=False, blank=False, max_length=225)
    review_rating = models.IntegerField(null=False, blank=False, default=0)
    member = models.ForeignKey(Member, on_delete=models.PROTECT, null=False)
    lecture = models.ForeignKey(Lecture, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_lecture_review'
        ordering = ['-id']


# 강의 장소 사진 테이블
class LecturePlaceFile(File):
    lecture = models.ForeignKey(Lecture, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_lecture_place_file'
        ordering = ['-id']


class LectureAddress(Address):
    lecture = models.ForeignKey(Lecture, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_lecture_address'
