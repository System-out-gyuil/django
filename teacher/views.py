from django.db import transaction
from django.db.models import F, Q
from django.shortcuts import render, redirect
from django.views import View

from lecture.models import LectureProductFile, Lecture
from teacher.models import Teacher, TeacherInfoFile


class TeacherEntryView(View):
    def get(self, request):
        # 현재 로그인한 회원이 강사인지 아닌지 확인하기
        member = request.session['member']
        teacher_check = Teacher.objects.filter(member_id=member['id']).values('teacher_status').first()

        # 최근 생성된 강의 10개 가지고 오기
        lectures = Lecture.enabled_objects.all().values('lecture_title', 'id', 'teacher__member__member_name')[:10]
        #
        for lecture in lectures:
            lecture_photo = LectureProductFile.objects.filter(lecture_id=lecture['id']).values('file_url').first()
            lecture['lecture_photo'] = lecture_photo['file_url']

        context = {
            'lectures': lectures,
            'teacher_check': teacher_check['teacher_status']
        }

        return render(request, 'teacher/teacher-entry.html', context)

class TeacherSubView(View):
    def get(self, request):
        return render(request, 'teacher/teacher-sub.html')

    @transaction.atomic
    def post(self, request):

        # 현재 로그인한 사용자 정보
        member = request.session['member']
        teacher_info_data = request.POST
        files = request.FILES

        # 강사 약력
        teacher_brief_history = teacher_info_data['brief-history']

        # 강의 설명
        lecture_description = teacher_info_data['lecture-description']

        # 강의 주소
        lecture_place = teacher_info_data['lecture-place']

        # 강사 신청 create
        teacher = Teacher.objects.create(member_id=member['id'], teacher_info=teacher_brief_history, lecture_plan=lecture_description, teacher_address=lecture_place, teacher_status=False)

        # 강의 품목 예시(사진 파일)
        for key in files:
            TeacherInfoFile.objects.create(teacher=teacher, file_url=files[key])

        return redirect('/teacher/entry')