import random

from django.test import TestCase

from member.models import Member
from teacher.models import Teacher, TeacherInfoFile


class TeacherTestCase(TestCase):
    member_queryset = Member.objects.all()
    teacher_data = {
        'teacher_info': f'안녕하세요7열심히하겠습니다',
        'lecture_plan': f'식물을 잘기르는 방법에 대해7',
        'member': member_queryset[1],
    }
    teacher = Teacher.objects.create(**teacher_data)

    teacher_file_data = {
        'file_url': 'https://imagedelivery.net/4aEUbX05h6IovGOQjgkfSw/d6c43d30-74a2-4a3c-e887-5ebd44509d00/public',
        'teacher': teacher
    }
    TeacherInfoFile.objects.create(**teacher_file_data)
