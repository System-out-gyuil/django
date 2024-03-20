from operator import itemgetter

from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
# noinspection PyInterpreter
from django.db.models import F, Count
from django.utils import timezone

from django.shortcuts import render, redirect
from django.views import View
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView

from alarm.models import Alarm
from apply.models import Apply, Trainee
from knowhow.models import KnowhowFile, KnowhowReply, Knowhow, KnowhowPlant, KnowhowReplyLike, KnowhowLike
from lecture.models import LectureReview, LectureProductFile, LecturePlant, Lecture, LectureScrap
from member.models import Member, MemberAddress, MemberProfile
from member.serializers import MemberSerializer
from order.models import OrderMileage
from post.models import Post, PostFile, PostPlant, PostReply, PostReplyLike, PostLike
from selleaf.models import Mileage
from teacher.models import Teacher
from trade.models import TradeScrap, TradeFile, TradePlant, Trade


class MemberJoinView(View):
    def get(self, request):
        member = request.GET
        context = {
            'memberEmail': member['member_email'],
            'memberName': member['member_name'],
            'memberProfile': member['member_profile'],
            'memberType': member['member_type'],
        }
        return render(request, 'member/join/join.html', context)

    def post(self, request):
        post_data = request.POST
        marketing_agree = post_data.getlist('marketing-agree')
        marketing_agree = True if marketing_agree else False
        sms_agree = post_data.getlist('sms-agree')
        sms_agree = True if sms_agree else False

        member_data = {
            'member_email': post_data['member-email'],
            'member_name': post_data['member-name'],
            'member_type': post_data['member-type'],
            'marketing_agree': marketing_agree,
            'sms_agree': sms_agree
        }
        is_member = Member.objects.filter(**member_data)

        if not is_member.exists():
            member = Member.objects.create(**member_data)

            profile_data = {
                'file_url': post_data['member-profile'],
                'member': member
            }
            MemberProfile.objects.create(**profile_data)

            address_data = {
                'address_city': post_data['address-city'],
                'address_district': post_data['address-district'],
                'address_detail': post_data['address-detail'],
                'member': member
            }
            MemberAddress.objects.create(**address_data)

            request.session['member'] = MemberSerializer(member).data
            member_files = list(member.memberprofile_set.values('file_url'))
            if len(member_files) != 0:
                request.session['member_files'] = member_files

        return redirect('/')


class MemberLoginView(View):
    def get(self, request):
        return render(request, 'member/login/login.html')


class MemberLogoutView(View):
    def get(self, request):
        request.session.clear()
        return redirect('member:login')


# =====================================================================================================================
class MypageUpdateView(View):
    def get(self, request):
        member_id = request.session['member']['id']
        request.session['member'] = MemberSerializer(Member.objects.get(id=member_id)).data
        check = request.GET.get('check')
        teacher = Teacher.objects.filter(member_id=member_id)
        member_files = MemberProfile.objects.filter(id = member_id).first()
        session_file = request.session['member_files'][0]['file_url']
        member_file = member_files.file_url
        context = {
            'check': check,
            'member_file': member_file,
            'memberProfile': session_file,
            'teacher':teacher
        }
        return render(request, 'member/mypage/my_settings/user-info-update.html', context)

    def post(self, request):
        data = request.POST
        files = request.FILES.getlist('new-image')
        member_id = request.session['member']['id']

        member = Member.objects.get(id=member_id)
        member.member_name = data['member-name']
        member.updated_date = timezone.now()
        member.save(update_fields=['member_name', 'updated_date'])

        if files:
            for file in files:
                member_profile, created = MemberProfile.objects.get_or_create(member=member)
                member_profile.file_url = file
                member_profile.updated_date = timezone.now()
                member_profile.save()
        request.session['member_files'] = list(member.memberprofile_set.values('file_url'))

        return redirect("member:update")


# =====================================================================================================================
# 내 활동 모두보기 view

class MypageShowView(View):
    def get(self,request):
        member = request.session['member']
        member_file = request.session['member_files']
        teacher = Teacher.objects.filter(member_id=member['id'])

        post = list(Post.objects.filter(member_id=member['id']))
        knowhow = list(Knowhow.objects.filter(member_id=member['id']))
        post_count = len(post) + len(knowhow)

        lecture_review = LectureReview.objects.filter(member_id=member['id'])

        post_like = list(PostLike.objects.filter(member_id=member['id']))
        knowhowlike = KnowhowLike.objects.filter(member_id=member['id'])
        like_count = len(post_like) + len(knowhowlike)

        lecture_scrap = LectureScrap.objects.filter(member_id=member['id'])
        trade_scrap = TradeScrap.objects.filter(member_id=member['id'])
        scrap_count = len(lecture_scrap) + len(trade_scrap)

        mileages = OrderMileage.objects.filter(member_id=member['id']).values('mileage','mileage_status')

        total = 0
        for mileage in mileages:
            if mileage['mileage_status'] == 1:
                total += mileage['mileage']
            elif mileage['mileage_status'] == 0:
                total -= mileage['mileage']


        context = {
            'member': member,
            'memberProfile': member_file[0]['file_url'],
            'post': post,
            'teacher': teacher,
            'post_count': post_count,
            'lecture_review':lecture_review,
            'like_count':like_count,
            'scrap_count':scrap_count,
            'mileage': total
        }



        return render(request,'member/mypage/my_profile/see-all.html',context)

# 내 활동 내 게시글 view
class MypagePostView(View):
    def get(self,request):

        member = request.session['member']
        member_file = request.session['member_files']

        teacher = Teacher.objects.filter(member_id=member['id'])

        post = list(Post.objects.filter(member_id=member['id']))
        knowhow = list(Knowhow.objects.filter(member_id=member['id']))
        post_count = len(post) + len(knowhow)
        print(knowhow)
        post_like = list(PostLike.objects.filter(member_id=member['id']))
        knowhowlike = KnowhowLike.objects.filter(member_id=member['id'])
        like_count = len(post_like) + len(knowhowlike)

        lecture_scrap = LectureScrap.objects.filter(member_id=member['id'])
        trade_scrap = TradeScrap.objects.filter(member_id=member['id'])
        scrap_count = len(lecture_scrap) + len(trade_scrap)

        mileages = OrderMileage.objects.filter(member_id=member['id']).values('mileage', 'mileage_status')

        total = 0
        for mileage in mileages:
            if mileage['mileage_status'] == 1:
                total += mileage['mileage']
            elif mileage['mileage_status'] == 0:
                total -= mileage['mileage']

        context = {
            'member': member,
            'memberProfile': member_file[0]['file_url'],
            'post': post,
            'teacher': teacher,
            'post_count': post_count,
            'like_count':like_count,
            'scrap_count':scrap_count,
            'mileage': total
        }
        return render(request,'member/mypage/my_profile/my-posts.html',context)


# 내 활동 내 댓글 view
class MypageReplyView(View):
    def get(self,request):

        member = request.session['member']
        member_file = request.session['member_files']

        teacher = Teacher.objects.filter(member_id=member['id'])

        post_reply = list(PostReply.objects.filter(member_id=member['id']))
        knowhow_reply = list(KnowhowReply.objects.filter(member_id=member['id']))
        reply_count = len(post_reply)+len(knowhow_reply)

        post_like = list(PostLike.objects.filter(member_id=member['id']))
        knowhowlike = KnowhowLike.objects.filter(member_id=member['id'])
        like_count = len(post_like) + len(knowhowlike)

        lecture_scrap = LectureScrap.objects.filter(member_id=member['id'])
        trade_scrap = TradeScrap.objects.filter(member_id=member['id'])
        scrap_count = len(lecture_scrap) + len(trade_scrap)

        mileages = OrderMileage.objects.filter(member_id=member['id']).values('mileage','mileage_status')

        total = 0
        for mileage in mileages:
            if mileage['mileage_status'] == 1:
                total += mileage['mileage']
            elif mileage['mileage_status'] == 0:
                total -= mileage['mileage']


        context = {
            'member': member,
            'memberProfile': member_file[0]['file_url'],
            'teacher':teacher,
            'like_count':like_count,
            'reply_count':reply_count,
            'scrap_count':scrap_count,
            'mileage':total
        }
        return render(request,'member/mypage/my_profile/my-comments.html',context)

# 내 활동 내 리뷰 view
class MypageReviewView(View):
    def get(self,request):
        member = request.session['member']
        member_file = request.session['member_files']

        teacher = Teacher.objects.filter(member_id=member['id'])

        post = list(Post.objects.filter(member_id=member['id']))
        knowhow = list(Knowhow.objects.filter(member_id=member['id']))
        post_count = len(post) + len(knowhow)

        post_like = list(PostLike.objects.filter(member_id=member['id']))
        knowhowlike = KnowhowLike.objects.filter(member_id=member['id'])
        like_count = len(post_like) + len(knowhowlike)

        lecture_reply = LectureReview.objects.filter(member_id=member['id'])

        lecture_scrap = LectureScrap.objects.filter(member_id=member['id'])
        trade_scrap = TradeScrap.objects.filter(member_id=member['id'])
        scrap_count = len(lecture_scrap) + len(trade_scrap)

        mileages = OrderMileage.objects.filter(member_id=member['id']).values('mileage','mileage_status')

        total = 0
        for mileage in mileages:
            if mileage['mileage_status'] == 1:
                total += mileage['mileage']
            elif mileage['mileage_status'] == 0:
                total -= mileage['mileage']


        context = {
            'member': member,
            'memberProfile': member_file[0]['file_url'],
            'post': post,
            'teacher': teacher,
            'like_count': like_count,
            'post_count': post_count,
            'lecture_reply':lecture_reply,
            'scrap_count':scrap_count,
            'mileage': total
        }
        return render(request,'member/mypage/my_profile/my-reviews.html',context)

# 내 활동 좋아요 view
class MypageLikesView(View):

    def get(self,request):
        member = request.session['member']
        member_file = request.session['member_files']

        teacher = Teacher.objects.filter(member_id=member['id'])

        post = list(Post.objects.filter(member_id=member['id']))
        knowhow = list(Knowhow.objects.filter(member_id=member['id']))
        post_count = len(post) + len(knowhow)

        post_reply = list(PostReply.objects.filter(member_id=member['id']))
        knowhow_reply = list(KnowhowReply.objects.filter(member_id=member['id']))
        reply_count = len(post_reply) + len(knowhow_reply)

        lecture_scrap = LectureScrap.objects.filter(member_id=member['id'])
        trade_scrap = TradeScrap.objects.filter(member_id=member['id'])
        scrap_count = len(lecture_scrap) + len(trade_scrap)

        post_like = list(PostLike.objects.filter(member_id=member['id']))
        knowhowlike = KnowhowLike.objects.filter(member_id=member['id'])
        like_count = len(post_like) + len(knowhowlike)

        mileages = OrderMileage.objects.filter(member_id=member['id']).values('mileage','mileage_status')

        total = 0
        for mileage in mileages:
            if mileage['mileage_status'] == 1:
                total += mileage['mileage']
            elif mileage['mileage_status'] == 0:
                total -= mileage['mileage']


        context = {
            'member': member,
            'memberProfile': member_file[0]['file_url'],
            'post': post,
            'teacher': teacher,
            'post_count': post_count,
            'reply_count': reply_count,
            'scrap_count':scrap_count,
            'like_count':like_count,
            'mileage':total
        }

        return render(request,'member/mypage/my_profile/likes.html',context)

# 스크랩북 강의 스크랩
class MypageScrapLecturesView(View):

    def get(self,request):
        member = request.session['member']
        member_file = request.session['member_files']

        lecture_scrap = LectureScrap.objects.filter(member_id=member['id'], status=1)
        trade_scrap = TradeScrap.objects.filter(member_id=member['id'], status=1)

        context = {
            'member': member,
            'memberProfile': member_file[0]['file_url'],
            'lecture_scrap':lecture_scrap,
            'trade_scrap':trade_scrap,

        }
        return render(request,'member/mypage/my_profile/scrapbook/lecture-scrapbook.html',context)


# 스크랩북 강의 스크랩
class MypageScrapTradeView(View):
    def get(self,request):
        member = request.session['member']
        member_file = request.session['member_files']

        lecture_scrap = LectureScrap.objects.filter(member_id=member['id'], status=1)
        trade_scrap = TradeScrap.objects.filter(member_id=member['id'], status=1)

        context = {
            'member': member,
            'memberProfile': member_file[0]['file_url'],
            'lecture_scrap': lecture_scrap,
            'trade_scrap': trade_scrap

        }

        return render(request,'member/mypage/my_profile/scrapbook/trade-scrapbook.html',context)


# 내가 신청한 강의 view
class MypageLecturesView(View):
    def get(self, request):

        member = request.session['member']
        member_file = request.session['member_files']

        teacher = Teacher.objects.filter(member_id=member['id'])

        post_like = list(PostLike.objects.filter(member_id=member['id']))
        knowhow_like = KnowhowLike.objects.filter(member_id=member['id'])
        like_count = len(post_like) + len(knowhow_like)

        lecture = Apply.objects.filter(member_id = member['id'],apply_status= 0)

        lecture_scrap = LectureScrap.objects.filter(member_id=member['id'])
        trade_scrap = TradeScrap.objects.filter(member_id=member['id'])
        scrap_count = len(lecture_scrap) + len(trade_scrap)

        mileages = OrderMileage.objects.filter(member_id=member['id']).values('mileage','mileage_status')

        total = 0
        for mileage in mileages:
            if mileage['mileage_status'] == 1:
                total += mileage['mileage']
            elif mileage['mileage_status'] == 0:
                total -= mileage['mileage']

        context = {
            'member': member,
            'memberProfile': member_file[0]['file_url'],
            'teacher': teacher,
            'like_count': like_count,
            'lecture':lecture,
            'scrap_count':scrap_count,
            'mileage':total
        }
        return render(request,'member/mypage/my_lecture/my-lectures.html',context)

# 강의 리뷰 작성 View
class LectureReviewView(View):

    def get(self, request, lecture_id):
        member = request.session['member']
        member_file = request.session['member_files']

        context = {
            'member': member,
            'memberProfile': member_file[0]['file_url'],
            'lecture_id':lecture_id
        }

        return render(request, 'member/mypage/my_lecture/write-lecture-review.html',context)

    @transaction.atomic
    def post(self, request, lecture_id):
        data = request.POST
        # 현재 로그인한 사용자
        member = request.session['member']

        print(data.values())
        data = {
            'review_content': data['content-input'],
            'member': Member.objects.get(id=member['id']),
            'lecture_id': lecture_id,
            'review_title': data['title-input'],
            'review_rating': data.get('rate')
        }

        # 알람 테이블 용
        LectureReview.objects.create(**data)
        sender = Member.objects.get(id=member['id'])
        lecture = Lecture.objects.filter(id=lecture_id)\
            .annotate(member_id=F('teacher__member_id'))\
            .values('member_id', 'id').first()
        receiver = Member.objects.filter(id=lecture['member_id']).first()
        alarm_data= {
            'sender' : sender,
            'receiver' : receiver,
            'alarm_category': 8,
            'target_id': lecture['id']
        }
        Alarm.objects.create(**alarm_data)

        return redirect('/member/mypage/lectures/')

# 내 거래 view
class MypageTradesView(View):
    def get(self, request):
        member = request.session['member']
        member_file = request.session['member_files']

        teacher = Teacher.objects.filter(member_id=member['id'])

        trade = Trade.objects.filter(member_id=member['id'])

        post_like = list(PostLike.objects.filter(member_id=member['id']))
        knowhow_like = KnowhowLike.objects.filter(member_id=member['id'])
        like_count = len(post_like) + len(knowhow_like)

        lecture_scrap = LectureScrap.objects.filter(member_id=member['id'])
        trade_scrap = TradeScrap.objects.filter(member_id=member['id'])
        scrap_count = len(lecture_scrap) + len(trade_scrap)

        mileages = OrderMileage.objects.filter(member_id=member['id']).values('mileage', 'mileage_status')

        total = 0
        for mileage in mileages:
            if mileage['mileage_status'] == 1:
                total += mileage['mileage']
            elif mileage['mileage_status'] == 0:
                total -= mileage['mileage']


        context = {
            'member': member,
            'memberProfile': member_file[0]['file_url'],
            'teacher':teacher,
            'trade':trade,
            'like_count':like_count,
            'scrap_count':scrap_count,
            'mileage':total
        }
        return render(request, 'member/mypage/trade/my-sales.html', context)


# 강사 진행한 강의
class MypageTeacherView(View):
    def get(self, request):
        member = request.session['member']
        member_file = request.session['member_files']

        teacher = Teacher.objects.filter(member_id=member['id']).first()

        lecture = Apply.objects.filter(lecture__teacher_id=teacher.id, apply_status=1)

        post_like = PostLike.objects.filter(member_id=member['id'])
        knowhow_like = KnowhowLike.objects.filter(member_id=member['id'])
        like_count = len(post_like) + len(knowhow_like)

        lecture_scrap = LectureScrap.objects.filter(member_id=member['id'])
        trade_scrap = TradeScrap.objects.filter(member_id=member['id'])
        scrap_count = len(lecture_scrap) + len(trade_scrap)

        mileages = OrderMileage.objects.filter(member_id=member['id']).values('mileage', 'mileage_status')

        total = 0
        for mileage in mileages:
            if mileage['mileage_status'] == 1:
                total += mileage['mileage']
            elif mileage['mileage_status'] == 0:
                total -= mileage['mileage']

        context = {
            'member': member,
            'memberProfile': member_file[0]['file_url'],
            'lecture': lecture,
            'like_count':like_count,
            'scrap_count':scrap_count,
            'mileage':total
        }

        return render(request, 'member/mypage/my_classes/past-classes.html',context)


# 강사 진행 예정 강의
class MypageTeacherPlanView(View):
    def get(self, request):
        member = request.session['member']
        member_file = request.session['member_files']

        teacher = Teacher.objects.filter(member_id=member['id']).first()
        lecture = Apply.objects.filter(lecture__teacher_id=teacher.id, apply_status = 0)

        post_like = list(PostLike.objects.filter(member_id=member['id']))
        knowhowlike = KnowhowLike.objects.filter(member_id=member['id'])
        like_count = len(post_like) + len(knowhowlike)

        lecture_scrap = LectureScrap.objects.filter(member_id=member['id'])
        trade_scrap = TradeScrap.objects.filter(member_id=member['id'])
        scrap_count = len(lecture_scrap) + len(trade_scrap)

        mileages = OrderMileage.objects.filter(member_id=member['id']).values('mileage', 'mileage_status')

        total = 0
        for mileage in mileages:
            if mileage['mileage_status'] == 1:
                total += mileage['mileage']
            elif mileage['mileage_status'] == 0:
                total -= mileage['mileage']

        context = {
            'member': member,
            'memberProfile': member_file[0]['file_url'],
            'lecture': lecture,
            'like_count': like_count,
            'scrap_count': scrap_count,
            'mileage':total
        }
        return render(request, 'member/mypage/my_classes/planned-classes.html',context)

# 수강생 목록
class MypageTraineeView(View):
    def get(self,request,apply_id):

        member = request.session['member']
        member_file = request.session['member_files']

        teacher = Teacher.objects.filter(member_id=member['id']).first()

        lecture = Apply.objects.filter(lecture__teacher_id=teacher.id)

        context = {
            'apply_id':apply_id,
            'member': member,
            'memberProfile': member_file[0]['file_url'],
            'lecture': lecture,
        }

        return render(request, 'member/mypage/my_classes/student-list.html',context)
# =====================================================================================================================
# API

# 포스트, 노하우 리스트 합본
# updated_date 기준 최신순 정렬
# 12개 한페이지
class MypagePostListAPI(APIView):
    def get(self, request, page):

        row_count = 8
        offset = (page - 1) * row_count
        limit = row_count * page

        if page < 1 or offset < 0:
            raise NotFound("Invalid page number")


        posts = list(Post.objects.filter(member_id=request.session['member']['id'])\
            .annotate(member_name=F('member__member_name'))\
            .values(
                'id',
                'post_title',
                'post_content',
                'post_count',
                'member_name',
                'updated_date',
            ))

        for post in posts:
            post_file = PostFile.objects.filter(post_id=post['id']).values('file_url').first()
            if post_file is not None:
                post['post_file'] = post_file['file_url']
            else:
                post['post_file'] = 'file/2024/03/05/blank-image.png'

            tags = PostPlant.objects.filter(post_id=post['id']).values('plant_name')
            for tag in tags:
                if tag is not None:
                    post['post_plant'] = [tag['plant_name']]
                else: post['post_plant'] = []

            replies = PostReply.objects.filter(post_id=post['id']).values('id')
            post['post_reply'] = [reply['id'] for reply in replies]

            print(post)



        knowhows = list(Knowhow.objects.filter(member_id=request.session['member']['id']) \
            .annotate(writer=F('member__member_name')) \
            .values(
            'id',
            'knowhow_title',
            'knowhow_content',
            'knowhow_count',
            'writer',
            'updated_date',
        ))

        for knowhow in knowhows:
            knowhow_file = KnowhowFile.objects.filter(knowhow_id=knowhow['id']).values('file_url').first()
            if knowhow_file is not None:
                knowhow['knowhow_file'] = knowhow_file['file_url']
            else:
                knowhow['knowhow_file'] = 'file/2024/03/05/blank-image.png'

            tags = KnowhowPlant.objects.filter(knowhow_id=knowhow['id']).values('plant_name')
            for tag in tags:
                if tag is not None:
                    knowhow['knowhow_plant'] = [tag['plant_name']]
                else:
                    knowhow['knowhow_plant'] = []

            replies = KnowhowReply.objects.filter(knowhow_id=knowhow['id']).values('id')
            knowhow['knowhow_reply'] = [reply['id'] for reply in replies]


        posts.extend(knowhows)
        # updated_date를 기준으로 최신순으로 정렬
        sorted_posts = sorted(posts, key=itemgetter('updated_date'), reverse=True)

        return Response(sorted_posts[offset:limit])

# 노하우, 포스트 댓글 리스트 합본
# updated_date 기준 최신순 정렬
# 4개 한페이지
class MypageShowReplyAPI(APIView):
    def get(self, request, page):

        row_count = 4
        offset = (page - 1) * row_count
        limit = row_count * page


        post_replies = list(PostReply.objects.filter(member=request.session['member']['id'])\
            .annotate(
                member_name=F('member__member_name'),
                post_title=F('post__post_title'),
                post_writer=F('post__member__member_name'),
                post_count=F('post__post_count'),
                post_tag=F('post__posttag__tag_name'))\
            .values(
                'id',
                'post_id',
                'post_reply_content',
                'member_name',
                'updated_date',
                'post_title',
                'post_writer',
                'post_count',
                'post_tag'
            ))

        for post_reply in post_replies:
            post_file = PostFile.objects.filter(post_id=post_reply['post_id']).values('file_url').first()
            if post_file is not None:
                post_reply['post_file'] = post_file['file_url']
            else:
                post_reply['post_file'] = 'file/2024/03/05/blank-image.png'

            tags = PostPlant.objects.filter(post_id=post_reply['post_id']).values('plant_name')
            post_reply['post_plant'] = [tag['plant_name'] for tag in tags]

            likes = PostReplyLike.objects.filter(post_reply_id=post_reply['id']).values('id')
            post_reply['likes'] = [like['id'] for like in likes]


        knowhow_replies = list(KnowhowReply.objects.filter(member=request.session['member']['id']) \
            .annotate(
            member_name=F('member__member_name'),
            knowhow_title=F('knowhow__knowhow_title'),
            knowhow_writer=F('knowhow__member__member_name'),
            knowhow_count=F('knowhow__knowhow_count'),
            knowhow_tag=F('knowhow__knowhowtag__tag_name')) \
            .values(
            'id',
            'knowhow_id',
            'knowhow_reply_content',
            'member_name',
            'updated_date',
            'knowhow_title',
            'knowhow_writer',
            'knowhow_count',
            'knowhow_tag'
        ))

        for knowhow_reply in knowhow_replies:
            knowhow_file = KnowhowFile.objects.filter(knowhow_id=knowhow_reply['knowhow_id']).values('file_url').first()
            if knowhow_file is not None:
                knowhow_reply['knowhow_file'] = knowhow_file['file_url']
            else:
                knowhow_reply['knowhow_file'] = 'file/2024/03/05/blank-image.png'

            tags = KnowhowPlant.objects.filter(knowhow_id=knowhow_reply['knowhow_id']).values('plant_name')
            knowhow_reply['knowhow_plant'] = [tag['plant_name'] for tag in tags]

            likes = KnowhowReplyLike.objects.filter(knowhow_reply_id=knowhow_reply['id']).values('id')
            knowhow_reply['likes'] = [like['id'] for like in likes]

        post_replies.extend(knowhow_replies)
        sorted_posts_replies = sorted(post_replies, key=itemgetter('updated_date'), reverse=True)

        return Response(sorted_posts_replies[offset:limit])


# 강의 리뷰 리스트
# 5개 한페이지
class MypageShowReviewAPI(APIView):
    def get(self, request, page):

        row_count = 5
        offset = (page - 1) * row_count
        limit = row_count * page

        reviews = LectureReview.objects.filter(member=request.session['member']['id'])\
            .annotate(
                member_name=F('member__member_name'),
                lecture_title=F('lecture__lecture_title'),
                teacher_name=F('lecture__teacher__member__member_name'),
                lecture_category=F('lecture__lecture_category__lecture_category_name'),
                lecture_status = F('lecture__online_status'))\
            .values(
                'id',
                'lecture_id',
                'lecture_title',
                'review_title',
                'review_content',
                'review_rating',
                'updated_date',
                'teacher_name',
                'lecture_category',
                'lecture_status'
            )

        for review in reviews:
            lecture_file = LectureProductFile.objects.filter(lecture_id=review['lecture_id']).values('file_url').first()
            if lecture_file is not None:
                review['lecture_file'] = lecture_file['file_url']
            else:
                review['lecture_file'] = 'file/2024/03/05/blank-image.png'

            if review['lecture_status'] == True:
                review['lecture_status'] = 'online'
            elif review['lecture_status']==False:
                review['lecture_status'] = 'offline'

            tags = LecturePlant.objects.filter(lecture_id=review['lecture_id']).values('plant_name')
            review['lecture_plant'] = [tag['plant_name'] for tag in tags]

        return Response(reviews[offset:limit])


# 포스트, 노하우 좋아요 리스트 합본
# 12개 한페이지
class MypageShowLikesAPI(APIView):
    def get(self, request,page):

        row_count = 12
        offset = (page - 1) * row_count
        limit = row_count * page


        likes = list(PostLike.objects.filter(member_id = request.session['member']['id'],status = 1) \
            .annotate(
            member_name=F('member__member_name'),
            post_title=F('post__post_title'),
            post_writer=F('post__member__member_name'),
            post_count=F('post__post_count'),
            post_tag=F('post__posttag__tag_name'))\
            .values(
            'id',
            'post_id',
            'member_name',
            'updated_date',
            'post_title',
            'post_writer',
            'post_count',
            'post_tag'
        ))

        for like in likes:
            post_file = PostFile.objects.filter(post_id=like['post_id']).values('file_url').first()
            if post_file is not None:
                like['post_file'] = post_file['file_url']
            else:
                like['post_file'] = 'file/2024/03/05/blank-image.png'

            tags = PostPlant.objects.filter(post_id=like['post_id']).values('plant_name')
            like['post_plant'] = [tag['plant_name'] for tag in tags]


        knowhow_likes = list(KnowhowLike.objects.filter(member_id=request.session['member']['id'],status=1) \
            .annotate(
            member_name=F('member__member_name'),
            knowhow_title=F('knowhow__knowhow_title'),
            knowhow_writer=F('knowhow__member__member_name'),
            knowhow_count=F('knowhow__knowhow_count'),
            knowhow_tag=F('knowhow__knowhowtag__tag_name')) \
            .values(
            'id',
            'knowhow_id',
            'member_name',
            'updated_date',
            'knowhow_title',
            'knowhow_writer',
            'knowhow_count',
            'knowhow_tag'
        ))

        for knowhow_like in knowhow_likes:
            knowhow_file = KnowhowFile.objects.filter(knowhow_id=knowhow_like['knowhow_id']).values('file_url').first()
            if knowhow_file is not None:
                knowhow_like['knowhow_file'] = knowhow_file['file_url']
            else:
                knowhow_like['knowhow_file'] = 'file/2024/03/05/blank-image.png'


            tags = KnowhowPlant.objects.filter(knowhow_id=knowhow_like['knowhow_id']).values('plant_name')
            knowhow_like['knowhow_plant'] = [tag['plant_name'] for tag in tags]

        likes.extend(knowhow_likes)
        sorted_likes = sorted(likes, key=itemgetter('updated_date'), reverse=True)

        return Response(sorted_likes[offset:limit])

    @transaction.atomic
    def delete(self, request, id, checker):
        if checker == 'post':
            PostLike.objects.get(post_id=id, member_id=request.session['member']['id']).delete()
        elif checker == 'knowhow':
            KnowhowLike.objects.get(knowhow_id=id,member_id=request.session['member']['id']).delete()

        return Response('success')


# 강의 수강 리스트
class MypageShowLecturesAPI(APIView):
    def get(self, request,page):
        row_count = 6
        offset = (page - 1) * row_count
        limit = row_count * page

        applies = Apply.objects.filter(member_id=request.session['member']['id'], apply_status=0) \
            .annotate(
            member_name=F('member__member_name'),
            lecture_title=F('lecture__lecture_title'),
            teacher_name=F('lecture__teacher__member__member_name'),
            lecture_content=F('lecture__lecture_content'),
            lecture_category=F('lecture__lecture_category__lecture_category_name'),
            lecture_status = F('lecture__online_status')
            )\
            .values(
            'apply_status',
            'id',
            'lecture_id',
            'member_name',
            'updated_date',
            'lecture_title',
            'teacher_name',
            'lecture_content',
            'time',
            'date',
            'kit',
            'lecture_category',
            'lecture_status'
        )

        for apply in applies:
            review = LectureReview.objects.filter(member_id=request.session['member']['id'], lecture_id=apply['lecture_id'])
            apply['lecture_review'] = review.values('id')

            lecture_file = LectureProductFile.objects.filter(lecture_id=apply['lecture_id']).values('file_url').first()
            if lecture_file is not None:
                apply['lecture_file'] = lecture_file['file_url']
            else:
                apply['lecture_file'] = 'file/2024/03/05/blank-image.png'

            if apply['lecture_status'] == True:
                apply['lecture_status'] = 'online'
            elif apply['lecture_status']==False:
                apply['lecture_status'] = 'offline'

            tags = LecturePlant.objects.filter(lecture_id=apply['lecture_id']).values('plant_name')
            apply['lecture_plant'] = [tag['plant_name'] for tag in tags]

        sorted_applies = sorted(applies, key=itemgetter('date'), reverse=True)

        return Response(sorted_applies[offset:limit])

# 스크랩한 강의 API
class MypageScrapLectureAPI(APIView):
    def get(self,request,page):
        row_count = 8
        offset = (page - 1) * row_count
        limit = row_count * page

        scrap_lectures = LectureScrap.objects.filter(member_id=request.session['member']['id'], status=1) \
            .annotate(
            member_name=F('member__member_name'),
            lecture_title=F('lecture__lecture_title'),
            teacher_name=F('lecture__teacher__member__member_name'),
            lecture_content=F('lecture__lecture_content'),
            lecture_category=F('lecture__lecture_category__lecture_category_name'),
            lecture_price = F('lecture__lecture_price'),
            lecture_status = F('lecture__online_status')
        ) \
            .values(
            'id',
            'lecture_id',
            'member_name',
            'updated_date',
            'lecture_title',
            'teacher_name',
            'lecture_content',
            'lecture_category',
            'lecture_price',
            'lecture_status'
        )

        for scrap_lecture in scrap_lectures:

            lecture_file = LectureProductFile.objects.filter(lecture_id=scrap_lecture['lecture_id']).values('file_url')\
                            .first()
            if lecture_file is not None:
                scrap_lecture['lecture_file'] = lecture_file['file_url']
            else:
                scrap_lecture['lecture_file'] = 'file/2024/03/05/blank-image.png'

            if scrap_lecture['lecture_status'] == True:
                scrap_lecture['lecture_status'] = 'online'
            elif scrap_lecture['lecture_status']==False:
                scrap_lecture['lecture_status'] = 'offline'

            review = LectureReview.objects.filter(member_id=request.session['member']['id'],
                                                  lecture_id=scrap_lecture['lecture_id'])
            scrap_lecture['lecture_review'] = review.values('id')

            tags = LecturePlant.objects.filter(lecture_id=scrap_lecture['lecture_id']).values('plant_name')
            scrap_lecture['lecture_plant'] = [tag['plant_name'] for tag in tags]

        return Response(scrap_lectures[offset:limit])

# 스크랩한 거래 API
class MypageScrapTradeAPI(APIView):
    def get(self, request,page):
        row_count = 8
        offset = (page - 1) * row_count
        limit = row_count * page

        scrap_trades = TradeScrap.objects.filter(member_id=request.session['member']['id'], status=1) \
            .annotate(
            member_name=F('trade__member__member_name'),
            trade_title=F('trade__trade_title'),
            trade_content=F('trade__trade_content'),
            trade_category=F('trade__trade_category__category_name'),
            trade_price=F('trade__trade_price'),
        ) \
            .values(
            'id',
            'trade_id',
            'member_name',
            'updated_date',
            'trade_title',
            'trade_content',
            'trade_category',
            'trade_price'
        )

        for scrap_trade in scrap_trades:

            trade_file = TradeFile.objects.filter(trade_id=scrap_trade['trade_id']).values('file_url') \
                .first()
            if trade_file is not None:
                scrap_trade['trade_file'] = trade_file['file_url']
            else:
                scrap_trade['trade_file'] = 'file/2024/03/05/blank-image.png'

            tags = TradePlant.objects.filter(trade_id=scrap_trade['trade_id']).values('plant_name')
            scrap_trade['trade_plant'] = [tag['plant_name'] for tag in tags]

        return Response(scrap_trades[offset:limit])


# 내 거래 내역 API
class MypageTradesAPI(APIView):
    def get(self,request,page):
        row_count = 12
        offset = (page - 1) * row_count
        limit = row_count * page

        trades = Trade.objects.filter(member_id=request.session['member']['id'], status=1) \
            .annotate(
            member_name=F('member__member_name'),
        ) \
            .values(
            'id',
            'member_name',
            'updated_date',
            'trade_title',
            'trade_content',
            'trade_category',
            'trade_price'
        )

        for trade in trades:

            trade_file = TradeFile.objects.filter(trade_id=trade['id']).values('file_url') \
                .first()
            if trade_file is not None:
                trade['trade_file'] = trade_file['file_url']
            else:
                trade['trade_file'] = 'file/2024/03/05/blank-image.png'

            tags = TradePlant.objects.filter(trade_id=trade['id']).values('plant_name')
            trade['trade_plant'] = [tag['plant_name'] for tag in tags]

        return Response(trades[offset:limit])

# 강사별 강의 내역 API
class MypageTeacherAPI(APIView):
    def get(self, request, page):
        row_count = 5
        offset = (page-1) * row_count
        limit = row_count * page


        # 강사의 ID 가져오기
        member_id = request.session['member']['id']
        teacher = Teacher.objects.filter(member_id=member_id).first()
        # 해당 강사가 소속된 강의에 대한 신청 필터링
        applies = Apply.objects.filter(lecture_id__teacher_id=teacher.id)\
            .annotate(
            teacher_name=F('lecture__teacher__member__member_name'),
            lecture_title=F('lecture__lecture_title'),
            lecture_content=F('lecture__lecture_content'),
            lecture_category=F('lecture__lecture_category'),
            member_name=F('member__member_name'),
            lecture_status = F('lecture__online_status')
            ).values(
            'teacher_name',
            'id',
            'lecture_id',
            'updated_date',
            'lecture_title',
            'lecture_content',
            'lecture_category',
            'date',
            'time',
            'kit',
            'apply_status',
            'member_name',
            'lecture_status'
            )

        for apply in applies:
            lecture_file = LectureProductFile.objects.filter(lecture_id=apply['lecture_id']).values('file_url').first()
            if lecture_file is not None:
                apply['lecture_file'] = lecture_file['file_url']
            else:
                apply['lecture_file'] = 'file/2024/03/05/blank-image.png'

            if apply['lecture_status'] == True:
                apply['lecture_status'] = 'online'
            elif apply['lecture_status']==False:
                apply['lecture_status'] = 'offline'

            tags = LecturePlant.objects.filter(lecture_id=apply['lecture_id']).values('plant_name')
            apply['lecture_plant'] = [tag['plant_name'] for tag in tags]

            trainees = Trainee.objects.filter(apply_id=apply['id']).values('trainee_name')
            apply['trainee'] = [trainee['trainee_name'] for trainee in trainees]

        return Response(applies[offset:limit])


# 수강생 목록보기// 작업중
class MypageTraineeAPI(APIView):
    def get(self, request, apply_id):


        member_id = request.session['member']['id']

        teacher = Teacher.objects.filter(member_id=member_id).first()

        apply = Apply.objects.filter(lecture_id__teacher_id=teacher.id, id=apply_id)\
            .annotate(member_name=F('member__member_name'), phone = F('orderdetail__order__phone'))\
            .values(
            'id',
            'member_name',
            'time',
            'date',
            'kit',
            'phone'
        )
        apply = apply.first()
        trainees = Trainee.objects.filter(apply_id=apply_id).values('trainee_name')
        trainee_names = [trainee['trainee_name'] for trainee in trainees]
        apply['trainees'] = trainee_names

        return Response(apply)

