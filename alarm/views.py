from django.db import transaction
from django.db.models import F
from django.shortcuts import render
from django.utils import timezone
from django.views import View
from rest_framework.response import Response
from rest_framework.views import APIView

from alarm.models import Alarm
from apply.models import Apply
from knowhow.models import Knowhow, KnowhowLike, KnowhowReply, KnowhowFile
from lecture.models import LectureReview, Lecture, LectureProductFile
from member.models import Member, MemberProfile
from post.models import PostLike, PostReply, PostFile


class AlarmView(View):
    def get(self, request):
        member = request.session.get('member')
        member_file = request.session.get('member_files')
        alarms= Alarm.objects.filter(receiver_id=member.get('id'),alarm_status=False)
        alarm_count = len(alarms)
        context = {
            'alarm_count': alarm_count,
            'member': member,
            'memberProfile': member_file[0].get('file_url'),
        }
        return render(request,'alarm/alarm.html', context)



class AlarmAPI(APIView):
    def get(self, request, page):
        # 페이지당 알람 수와 오프셋, 리미트 계산
        row_count = 8
        offset = (page - 1) * row_count
        limit = page * row_count

        # 현재 멤버의 아이디 가져오기
        member_id = request.session.get('member').get('id')

        # 멤버에게 전달된 알람들 가져오기
        alarms = Alarm.objects.filter(receiver=member_id, alarm_status=False).values()

        # 각 알람에 대한 추가 정보 처리
        for alarm in alarms:
            # 알람의 발신자 정보 가져오기
            sender = Member.objects.filter(id=alarm.get('sender_id')).first()
            alarm['sender'] = sender.member_name if sender else None

            # 발신자 파일 URL 가져오기 또는 기본값 설정
            sender_file = MemberProfile.objects.filter(member_id=alarm.get('sender_id')).values('file_url').first()
            alarm['member_file'] = sender_file.get('file_url') if sender_file else 'file/2024/03/05/blank-image.png'

            # 알람 카테고리에 따라 메시지 생성
            # 1. ApplyAlarm
            if alarm['alarm_category'] == 1:

                applies = Apply.objects.filter(member_id=alarm.get('sender_id'), lecture__teacher_id=member_id, apply_status=0)\
                    .annotate(title=F('lecture__lecture_title')).values('title','lecture_id')

                for apply in applies:
                    target_file = LectureProductFile.objects.filter(lecture_id = apply.get('lecture_id')).values('file_url').first()
                    alarm['target_file'] = target_file['file_url'] if target_file else 'file/2024/03/05/blank-image.png'
                    title = apply.get('title')
                    alarm["message"] = f'님이 {title} 강의를 신청하였습니다.'
                    alarm['target_url'] = '/member/mypage/teachers/'

            # 2. KnowhowLikeAlarm
            elif alarm['alarm_category'] == 2:

                knowhow_likes = KnowhowLike.objects.filter(member_id=alarm.get('sender_id'), knowhow__member_id=member_id)\
                    .annotate(knowhow_name=F('knowhow__knowhow_title')).values('knowhow_name','knowhow_id')

                for knowhow_like in knowhow_likes:
                    target_file = KnowhowFile.objects.filter(knowhow_id=knowhow_like.get('knowhow_id')).values('file_url').first()
                    alarm['target_file'] = target_file['file_url'] if target_file else 'file/2024/03/05/blank-image.png'
                    knowhow = knowhow_like.get('knowhow_name')
                    alarm["message"] = f'님이 {knowhow}를 좋아합니다.'
                    alarm['target_url'] = '/knowhow/detail/?id='

            # 3. KnowhowReplyAlarm
            elif alarm['alarm_category'] == 3:

                knowhow_replies = KnowhowReply.objects.filter(member_id=alarm.get('sender_id'),
                                                              knowhow__member_id=member_id) \
                    .annotate(knowhow_name=F('knowhow__knowhow_title'))
                print(knowhow_replies)
                for knowhow_reply in knowhow_replies:
                    target_file = KnowhowFile.objects.filter(knowhow_id=knowhow_reply.knowhow_id).values('file_url').first()
                    alarm['target_file'] = target_file['file_url'] if target_file else 'file/2024/03/05/blank-image.png'
                    knowhow = knowhow_reply.knowhow_name
                    alarm['reply'] = knowhow_reply.knowhow_reply_content
                    alarm["message"] = f'님이 {knowhow}에 댓글을 남겼습니다.'
                    alarm['target_url'] = '/knowhow/detail/?id='


            # 4. PostLikeAlarm
            elif alarm['alarm_category'] == 4:
                post_likes = PostLike.objects.filter(member_id=alarm.get('sender_id'), post__member_id=member_id) \
                    .annotate(post_name=F('post__post_title')).values('post_name', 'post_id')

                for post_like in post_likes:
                    target_file = PostFile.objects.filter(post_id=post_like.get('post_id')).values('file_url').first()
                    alarm['target_file'] = target_file['file_url'] if target_file else 'file/2024/03/05/blank-image.png'
                    post_like = post_like.get('post_name')
                    alarm["message"] = f'님이 {post_like}를 좋아합니다.'
                    alarm['target_url'] = '/post/detail/?id='

            # 5. PostReplyAlarm
            elif alarm['alarm_category'] == 5:
                post_replies = PostReply.objects.filter(member_id=alarm.get('sender_id'),
                                                        post__member_id=member_id) \
                    .annotate(post_name=F('post__post_title'))
                for post_reply in post_replies:
                    target_file = PostFile.objects.filter(post_id=post_reply.post_id).values('file_url').first()
                    alarm['target_file'] = target_file['file_url'] if target_file else 'file/2024/03/05/blank-image.png'
                    post = post_reply.post_name
                    alarm['reply'] = post_reply.post_reply_content
                    alarm["message"] = f'님이 {post}에 댓글을 남겼습니다.'
                    alarm['target_url'] = '/post/detail/?id='



            # 6. LectureReviewAlarm
            elif alarm['alarm_category'] == 6:
                reviews = LectureReview.objects.filter(member_id=alarm.get('sender_id'), lecture__teacher_id=member_id) \
                    .annotate(lecture_name=F('lecture__lecture_title'),lecture_status = F('lecture__online_status'))
                for review in reviews:
                    target_file = LectureProductFile.objects.filter(lecture_id=review.lecture_id).values('file_url').first()
                    alarm['target_file'] = target_file.get('file_url') if target_file else 'file/2024/03/05/blank-image.png'
                    lecture = review.lecture_name
                    alarm["message"] = f'님이 {lecture}에 리뷰를 작성하였습니다.'
                    alarm["reply"] = review.review_title
                    if review.lecture_status == 0 or review.lecture_status == False:
                        alarm['lecture_status'] = 'offline'
                    elif review.lecture_status == 1 or review.lecture_status == True:
                        alarm['lecture_status'] = 'online'
                    lecture_status = alarm.get('lecture_status')
                    alarm['target_url'] = f'/lecture/detail/{lecture_status}/?id='

        # 처리된 알람 반환
        return Response(alarms[offset:limit])

    @transaction.atomic
    def patch(self, request):
        alarm_id = request.data.get('alarm_id')
        alarm = Alarm.objects.get(id=alarm_id, receiver_id=request.session.get('member').get('id'))
        alarm.alarm_status = True
        alarm.updated_date = timezone.now()
        alarm.save(update_fields=['alarm_status', 'updated_date'])

        return Response('success')

    def delete(self,request):
        alarms = Alarm.objects.all()
        for alarm in alarms:
            alarm.alarm_status = True
            alarm.updated_date = timezone.now()
            alarm.save(update_fields=['alarm_status', 'updated_date'])

        return Response('success')