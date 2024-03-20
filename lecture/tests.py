import datetime
import random

from django.test import TestCase
from lecture.models import Lecture, LectureCategory, LectureProductFile, Kit, LectureReview, \
    LecturePlaceFile, LecturePlant
from member.models import Member
from selleaf.date import Date
from selleaf.time import Time

from teacher.models import Teacher


class LectureTestCase(TestCase):
    pass
    # lecture_category = []
    # for i in range(10):
    #     data = {
    #         'lecture_category_name': f'강의카테고리{i}',
    #     }
    #     lecture_category.append(LectureCategory(**data))
    # LectureCategory.objects.bulk_create(lecture_category)
    # date_queryset = Date.objects.all()
    # time_queryset = Time.objects.all()
    # member_queryset = Member.objects.all()
    # teacher_queryset = Teacher.objects.all()
    # lecture_category_queryset = LectureCategory.objects.all()
    # for i in range(10):
    #     lecture_data = {
    #         'lecture_price': random.randint(100000, 500000),
    #         'lecture_headcount': i,
    #         'lecture_title': f'강의 제목{i}',
    #         'lecture_content': f'강의 내용{i}',
    #         'lecture_category': lecture_category_queryset[random.randint(0, len(lecture_category_queryset) - 1)],
    #         'teacher': teacher_queryset[random.randint(0, len(teacher_queryset) - 1)],
    #         'date': date_queryset[random.randint(0, len(date_queryset) - 1)],
    #         'time': time_queryset[random.randint(0, len(time_queryset) - 1)],
    #     }
    #     lecture = Lecture.objects.create(**lecture_data)
    #
    #     for j in range(2):
    #         lecture_plant_data = {
    #             'lecture': lecture,
    #             'plant_name': '관엽식물'
    #         }
    #         LecturePlant.objects.create(**lecture_plant_data)
    #
    #     for j in range(5):
    #         lecture_file_data = {
    #             'lecture': lecture,
    #             'file_url': 'https://imagedelivery.net/4aEUbX05h6IovGOQjgkfSw/958ddb8b-929b-414f-a64b-6f2d4ee8a100/public'
    #         }
    #         LectureProductFile.objects.create(**lecture_file_data)
    #     kit = {
    #         'kit_name': '화분갈이 종합세트',
    #         'kit_content': '화분갈이 할때 필수장비',
    #         'lecture': lecture,
    #     }
    #     Kit.objects.create(**kit)
    #
    #     for j in range(3):
    #         review = {
    #             'review_title': f'강의가 너무 좋아요{i}',
    #             'review_content': f'강사님이 친절해요{j}',
    #             'review_rating': random.randint(1, 5),
    #             'member': member_queryset[random.randint(0, len(member_queryset) - 1)],
    #             'lecture': lecture,
    #         }
    #         LectureReview.objects.create(**review)
    #
    #     for j in range(5):
    #         lecture_file_url = {
    #             'file_url': 'https://imagedelivery.net/4aEUbX05h6IovGOQjgkfSw/382a0e49-3888-4fea-31cd-b97aa16e6500/public',
    #             'lecture': lecture,
    #         }
    #         LecturePlaceFile.objects.create(**lecture_file_url)
