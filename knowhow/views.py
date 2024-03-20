from datetime import timedelta

from django.db import transaction
from django.db.models import F, Count, Q
from django.shortcuts import render, redirect
from django.utils import timezone
from django.views import View
from django.views.generic import DetailView
from rest_framework.response import Response
from rest_framework.views import APIView

from alarm.models import Alarm
from knowhow.models import Knowhow, KnowhowFile, KnowhowPlant, KnowhowTag, KnowhowCategory, KnowhowRecommend, \
    KnowhowLike, KnowhowReply, KnowhowScrap
from member.models import Member, MemberProfile
from report.models import KnowhowReport
from selleaf.models import Like


# 노하우 작성
class KnowhowCreateView(View):
    def get(self, request):
        return render(request, 'community/web/knowhow/create-knowhow.html')

    @transaction.atomic
    def post(self, request):
        # data에 화면에서 작성 후 완료버튼을 눌러 submit 시 form태그에서 전달받은 값들
        data = request.POST
        # 노하우 작성시 업로드 된 파일들
        files = request.FILES

        # 현재 로그인된 사람의 정보
        member = Member(**request.session['member'])

        # 노하우
        knowhow = {
            'knowhow_title': data['knowhow-title'],
            'knowhow_content': data['knowhow-content'],
            'member': member
        }

        knowhowdata = Knowhow.objects.create(**knowhow)

        # 카테고리
        knowhowcategory = {
            'category_name': data['knowhow-categoty'],
            'knowhow': knowhowdata
        }

        KnowhowCategory.objects.create(**knowhowcategory)

        # 노하우 태그
        knowhowtag = {
            'tag_name': data['knowhow-tag'],
            'knowhow': knowhowdata
        }

        KnowhowTag.objects.create(**knowhowtag)

        # 노하우 작성 시 다중선택으로 인해 여러개의 값이 들어와서 getlist로 likst 타입으로 여러개의 값을 받음
        plant_types = data.getlist('plant-type')
        recommend_contents = data.getlist('knowhow-recommend-content')
        recommend_urls = data.getlist('knowhow-recommend-url')

        # 노하우 추천
        # 한 테이블에 두개 이상의 컬럼을 여러번 insert 해주어야 해서 for문 사용
        for i in range(len(recommend_urls)):
            KnowhowRecommend.objects.create(knowhow=knowhowdata, recommend_url=recommend_urls[i], recommend_content=recommend_contents[i])

        # 식물 종류
        # list 타입으로 받은 plant_types를 하나씩 insert
        for plant_type in plant_types:
            # print(plant_type)
            KnowhowPlant.objects.create(knowhow=knowhowdata, plant_name=plant_type)

        # 첨부파일
        # 파일(사진)이 최대 다섯장으로 설계를 하여 여러개의 파일이 들어오기 때문에 for문으로 하나씩 insert
        for key in files:
            # print(key)
            KnowhowFile.objects.create(knowhow=knowhowdata, file_url=files[key])

        # 작성이 완료되면 redirect로 KnowhowDetailView로 요청, 작성된 게시글의 id를 쿼리스트링으로 담아준다
        return redirect(f'/knowhow/detail/?id={knowhowdata.id}')


# 노하우 상세페이지
class KnowhowDetailView(View):
    def get(self, request):
        # 노하우 게시글 id
        knowhow = Knowhow.objects.get(id=request.GET['id'])
        # 현재 로그인중인 사람의 id
        session_member_id = request.session['member']['id']
        # 현재 로그인 되어있는 사람의 프로필
        session_profile = MemberProfile.objects.get(id=session_member_id)
        # 노하우 게시글 작성자의 프로필
        member_profile = MemberProfile.objects.get(id=knowhow.member_id)

        # 노하우 태그
        knowhow_tags = KnowhowTag.objects.filter(knowhow_id__gte=1).values('tag_name')
        # 댓글 갯수
        reply_count = KnowhowReply.objects.filter(knowhow_id=knowhow.id).values('id').count()

        # 스크랩 갯수
        knowhow_scrap = KnowhowScrap.objects.filter(knowhow_id=knowhow, member_id=session_member_id, status=1).exists()
        # 좋아요 갯수
        knowhow_like = KnowhowLike.objects.filter(knowhow_id=knowhow, member_id=session_member_id, status=1).exists()

        # 노하우 상세보기 들어올때마다 조회수 1증가
        knowhow.knowhow_count += 1
        knowhow.save(update_fields=['knowhow_count'])

        # 게시물마다 여러개의 사진이 있어서 LIST타입으로 가져감
        knowhow_files = list(knowhow.knowhowfile_set.all())
        # 여러장의 사진 중 첫번째 사진(초기 화면에 크게 표시될 메인사진)
        knowhow_file = list(knowhow.knowhowfile_set.all())[0]

        context = {
            'knowhow': knowhow,
            'knowhow_files': knowhow_files,
            'knowhow_file': knowhow_file,
            'knowhow_tags': knowhow_tags,
            'reply_count': reply_count,
            'member_profile': member_profile,
            'knowhow_scrap': knowhow_scrap,
            'knowhow_like': knowhow_like,
            'session_profile': session_profile

        }

        # context를 상세페이지 템플릿에서 사용하기위함
        return render(request, 'community/web/knowhow/knowhow-detail.html', context)


# 노하우 게시글 신고
class KnowhowReportView(View):
    def post(self, request):
        # 현재 로그인중인 사람의 id
        member_id = request.session['member']['id']
        # 신고버튼 클릭 시 담겨오는 신고 내용
        data = request.POST
        # 신고한 게시글의 id
        knowhow_id = request.GET['id']

        datas = {
            'member_id': member_id,
            'knowhow_id': knowhow_id,
            'report_content': data['report-content']
        }

        KnowhowReport.object.create(**datas)
        # 신고 완료 후 다시 해당 상세페이지로 이동하기위해 해당 게시물의 id로 요청
        return redirect(f'/knowhow/detail/?id={knowhow_id}')

# 노하우 게시글 수정
class KnowhowUpdateView(View):
    def get(self, request):
        knowhow_id = request.GET.get('id')

        knowhow = Knowhow.objects.get(id=knowhow_id)
        knowhow_file = list(knowhow.knowhowfile_set.values('file_url'))

        context = {
            'knowhow': knowhow,
            'knowhow_files': knowhow_file
        }

        return render(request, 'community/web/knowhow/edit-knowhow.html', context)

    @transaction.atomic
    def post(self, request):
        datas = request.POST
        files = request.FILES

        knowhow_id = request.GET['id']

        # 지금 시간
        time_now = timezone.now()

        # 수정할 노하우 게시글 아이디
        knowhow = Knowhow.objects.get(id=knowhow_id)

        # 노하우 게시글 수정
        knowhow.knowhow_title = datas['knowhow-title']
        knowhow.knowhow_content = datas['knowhow-content']
        knowhow.updated_date = time_now
        knowhow.save(update_fields=['knowhow_title', 'knowhow_content', 'updated_date'])

        # 노하우 카테고리 수정
        knowhow_category = KnowhowCategory.objects.get(knowhow_id=knowhow_id)

        knowhow_category.category_name = datas['knowhow-category']
        knowhow_category.updated_date = time_now
        knowhow_category.save(update_fields=['category_name', 'updated_date'])

        # 노하우 식물종류 수정
        plant_types = datas.getlist('plant-type')

        KnowhowPlant.objects.filter(knowhow_id=knowhow_id).delete()

        for plant_type in plant_types:
            # print(plant_type)
            KnowhowPlant.objects.create(knowhow_id=knowhow_id, plant_name=plant_type, updated_date=time_now)

        # 노하우 태그 수정
        knowhow_tag = KnowhowTag.objects.get(knowhow_id=knowhow_id)

        knowhow_tag.tag_name = datas['knowhow-tag']
        knowhow_tag.updated_date = timezone.now()
        knowhow_tag.save(update_fields=['tag_name', 'updated_date'])

        # 노하우 추천 내용 수정
        recommend_contents = datas.getlist('knowhow-recommend-content')
        recommend_urls = datas.getlist('knowhow-recommend-url')

        KnowhowRecommend.objects.filter(knowhow_id=knowhow_id).delete()

        # 노하우 추천
        for i in range(len(recommend_urls)):
            KnowhowRecommend.objects.create(knowhow_id=knowhow_id, recommend_url=recommend_urls[i],
                                            recommend_content=recommend_contents[i])

        KnowhowFile.objects.filter(knowhow_id=knowhow_id).delete()

        for key in files:
            KnowhowFile.objects.create(knowhow_id=knowhow_id, file_url=files[key])

        return redirect(f'/knowhow/detail/?id={knowhow_id}')


# 노하우 게시물 삭제
class KnowhowDeleteView(View):
    @transaction.atomic
    def get(self, request):
        # 삭제할 게시물의 id
        knowhow_id = request.GET['id']
        KnowhowTag.objects.filter(knowhow_id=knowhow_id).delete()
        KnowhowFile.objects.filter(knowhow_id=knowhow_id).delete()
        KnowhowRecommend.objects.filter(knowhow_id=knowhow_id).delete()
        KnowhowReply.objects.filter(knowhow_id=knowhow_id).delete()
        KnowhowCategory.objects.filter(knowhow_id=knowhow_id).delete()
        KnowhowPlant.objects.filter(knowhow_id=knowhow_id).delete()
        KnowhowScrap.objects.filter(knowhow_id=knowhow_id).delete()
        KnowhowLike.objects.filter(knowhow_id=knowhow_id).delete()
        Knowhow.objects.filter(id=knowhow_id).delete()

        # 게시물 삭제 후 노하우 목록 페이지로 이동
        return redirect(f'/knowhow/list/')


# 노하우 목록
class KnowhowListView(View):
    def get(self, request):

        # 초기에 보여줄 노하우 게시물의 총 갯수
        knowhow_count = Knowhow.objects.count()

        context = {
            'knowhow_count': knowhow_count
        }

        return render(request, 'community/web/knowhow/knowhow.html', context)

# 노하우 게시글 목록 REST
class KnowhowListApi(APIView):
    def get(self, request, page, sorting, filters, types):
        # 한번에 출력될 게시물의 갯수
        row_count = 6
        offset = (page - 1) * row_count
        limit = row_count * page

        # 위의 types와 filters에서 받아올 filter() 조건을 condition에 담아서 사용하기 위해 선언
        # 만약 types와 filters에 아무것도 들어오지않으면 filter()에 아무 조건도 담지않기 위해 빈칸으로 선언
        condition = Q()
        condition2 = Q()
        # 기본 정렬 상태는 최신순이기 때문에 -id로 초기화
        sort1 = '-id'
        sort2 = '-id'

        # 식물 종류 필터링에 선택된 값에 따라 condition에 담아줌
        if types == '식물 키우기':
            condition2 |= Q(knowhowcategory__category_name__contains='식물 키우기')
        elif types == '관련 제품':
            condition2 |= Q(knowhowcategory__category_name__contains='관련 제품')
        elif types == '테라리움':
            condition2 |= Q(knowhowcategory__category_name__contains='테라리움')
        elif types == '스타일링':
            condition2 |= Q(knowhowcategory__category_name__contains='스타일링')
        elif types == '전체':
            condition2 |= Q()

        # 값을 문자열에 콤마(, )로 연결해서 담겨져 오기 때문에 콤마 단위로 split()함수를 사용해서 나누어줌
        filters = filters.split(',')
        # 콤마 단위로 나누어 준 값들은 ex) ',관엽식물' 이런식으로 나뉘어 지기 때문에 콤마를 제거 후 비교 하여 condition에 담아준다
        for filter in filters:
            # print(filter.replace(',', ''))
            if filter.replace(',', '') == '관엽식물':
                condition |= Q(knowhowplant__plant_name__contains='관엽식물')

            elif filter.replace(',', '') == '침엽식물':
                condition |= Q(knowhowplant__plant_name__contains='침엽식물')

            elif filter.replace(',', '') == '희귀식물':
                condition |= Q(knowhowplant__plant_name__contains='희귀식물')

            elif filter.replace(',', '') == '다육':
                condition |= Q(knowhowplant__plant_name__contains='다육')

            elif filter.replace(',', '') == '선인장':
                condition |= Q(knowhowplant__plant_name__contains='선인장')

            elif filter.replace(',', '') == '기타':
                condition |= Q(knowhowplant__plant_name__contains='기타')

            elif filter.replace(',', '') == '전체':
                condition = Q()

        # 정렬 방식에 따라 사용할 values가 다르기 때문에 세가지로 나누어 사용
        columns1 = [
            'knowhow_title',
            'member_id',
            'knowhow_count',
            'id',
            'like_count'
        ]

        columns2 = [
            'knowhow_title',
            'member_id',
            'knowhow_count',
            'id',
            'scrap_count',
        ]

        columns3 = [
            'knowhow_title',
            'member_id',
            'knowhow_count',
            'id'
        ]

        # 정렬이 최신순일 경우
        if sorting == '최신순':
            # -id를 통해 최신순이지만, 생성일에 따라 확실하게 정렬
            sort1 = '-id'
            sort2 = '-created_date'

            # 여기서 condition과 columns로 값을 뽑아주고 order_by절에 sort1과 sort2를 사용함(기본적으로 sort1으로 정렬이지만
            # 만약 sort1 에 해당하는 값이 같으면 sort2 기준으로 정렬 후 offset과 limit로 슬라이싱
            knowhows = Knowhow.objects.filter(condition, condition2).values(*columns3).order_by(sort1, sort2)[
                       offset:limit]

            # 게시글 작성자와 좋아요 해당 게시물의 좋아요 갯수, 스크랩 갯수를
            # key-value 형식으로 추가해준다
            for knowhow in knowhows:
                # 각각의 게시물마다 작성자를 구하여 knowhows에 추가
                member_name = Member.objects.filter(id=knowhow['member_id']).values('member_name').first().get(
                    'member_name')
                knowhow['member_name'] = member_name

                like_count = KnowhowLike.objects.filter(status=1, knowhow=knowhow['id']).count()
                knowhow['like_count'] = like_count

                scrap_count = KnowhowScrap.objects.filter(status=1, knowhow=knowhow['id']).count()
                knowhow['scrap_count'] = scrap_count

        # 정렬이 인기순일 경우
        elif sorting == '인기순':
            # 좋아요 갯수에 따라 정렬
            sort1 = '-like_count'
            # 좋아요 갯수가 같을 경우 조회수 순으로 정렬
            sort2 = '-knowhow_count'

            # 위의 경우와 같지만 좋아요 갯수를 구해야 하기 때문에 annotate 를 이용해 집계함수 Count를 사용하여 해당 게시글의
            # 좋아요 갯수를 구한 후 구해진 좋아요 갯수에 따라 정렬
            knowhows = Knowhow.objects.filter(condition, condition2) \
                           .annotate(like_count=Count('knowhowlike__id', filter=Q(knowhowlike__status=1))) \
                           .values(*columns1) \
                           .order_by(sort1, sort2)[offset:limit]

            for knowhow in knowhows:
                member_name = Member.objects.filter(id=knowhow['member_id']).values('member_name').first().get(
                    'member_name')
                knowhow['member_name'] = member_name

                scrap_count = KnowhowScrap.objects.filter(status=1, knowhow=knowhow['id']).count()
                knowhow['scrap_count'] = scrap_count

        # 정렬이 스크랩순일 경우
        elif sorting == "스크랩순":
            # 스크랩 갯수에 따라 정렬
            sort1 = '-scrap_count'
            # 만약 스크랩 갯수가 같을 경우 최신순 정렬
            sort2 = '-id'

            # 인기순과 마찬가지로 스크랩된 수를 구하기 위해 annotate를 이용해 해당 게시물의 스크랩 횟수를 구해
            # 그 스크랩 수에 따라 정렬
            knowhows = Knowhow.objects.filter(condition, condition2) \
                           .annotate(scrap_count=Count('knowhowscrap__id', filter=Q(knowhowscrap__status=1))) \
                           .values(*columns2) \
                           .order_by(sort1, sort2)[offset:limit]

            for knowhow in knowhows:
                member_name = Member.objects.filter(id=knowhow['member_id']).values('member_name').first().get(
                    'member_name')
                knowhow['member_name'] = member_name

                like_count = KnowhowLike.objects.filter(status=1, knowhow=knowhow['id']).count()
                knowhow['like_count'] = like_count

        # 필터링된 게시물의 갯수
        # select-related로 post_like와 post_scrap을 post테이블에 join
        knowhows_count = Knowhow.objects.select_related('knowhowlike', 'knowhowscrap').filter(condition, condition2) \
            .annotate(member_name=F('member__member_name')) \
            .values(*columns3) \
            .annotate(like_count=Count(Q(knowhowlike__status=1)), scrap_count=Count(Q(knowhowscrap__status=1))) \
            .values('knowhow_title', 'member__member_name', 'knowhow_count', 'id', 'member_id', 'like_count',
                    'scrap_count') \
            .order_by(sort1, sort2).distinct().count()

        # 위에서 만들어진 knowhows에 다시 dict형태로 key값이 없을 경우 새로 만들어주는걸 이용하여 게시글과 작성자의 사진을 추가
        for knowhow in knowhows:
            knowhow_file = KnowhowFile.objects.filter(knowhow_id=knowhow['id']).values('file_url').first()
            profile = MemberProfile.objects.filter(member_id=knowhow['member_id']).values('file_url').first()
            knowhow['knowhow_file'] = knowhow_file['file_url']
            knowhow['profile'] = profile['file_url']


        datas = {
            'knowhows': knowhows,
            'knowhows_count': knowhows_count
        }

        return Response(datas)


# 노하우 게시물에 댓글 작성
class KnowhowReplyWriteApi(APIView):
    @transaction.atomic
    def post(self, request):
        data = request.data

        # 댓글의 작성한 노하우 게시물의 ID
        knowhow = Knowhow.objects.filter(id=data['knowhow_id']).values('member_id')

        # 댓글이 달릴때마다 누가 어떤 게시물에 댓글을 달았는지 알람테이블에 insert
        Alarm.objects.create(alarm_category=3, receiver_id=knowhow, sender_id=request.session['member']['id'], target_id=data['knowhow_id'])

        data = {
            'knowhow_reply_content': data['reply_content'],
            'knowhow_id': data['knowhow_id'],
            'member_id': request.session['member']['id']
        }

        KnowhowReply.objects.create(**data)

        return Response('success')


# 노하우 상세보기 REST
class KnowhowDetailApi(APIView):
    def get(self, request, knowhow_id, page):
        # 한번에 뿌려줄 댓글의 갯수
        row_count = 5
        offset = (page - 1) * row_count
        limit = row_count * page

        # 댓글 갯수
        reply_count = KnowhowReply.objects.filter(knowhow_id=knowhow_id).count()
        # 좋아요 갯수
        like_count = KnowhowLike.objects.filter(knowhow_id=knowhow_id, status=1).count()
        # 스크랩 갯수
        scrap_count = KnowhowScrap.objects.filter(knowhow_id=knowhow_id, status=1).count()
        # 게시글 작성 날짜
        knowhow_date = Knowhow.objects.filter(id=knowhow_id).values('created_date')

        # 댓글
        replies = KnowhowReply.objects\
            .filter(knowhow_id=knowhow_id).annotate(member_name=F('member__member_name'))\
            .values('member_name', 'knowhow__knowhow_content', 'member_id', 'created_date'\
                    , 'id', 'knowhow_reply_content', 'member__memberprofile__file_url')[offset:limit]

        data = {
            'replies': replies,
            'reply_count': reply_count,
            'knowhow_date': knowhow_date,
            'like_count': like_count,
            'scrap_count': scrap_count
        }

        return Response(data)

# 노하우 게시물 댓글 REST
class KnowhowReplyApi(APIView):
    # 댓글 삭제
    def delete(self, request, reply_id):
        KnowhowReply.objects.filter(id=reply_id).delete()
        return Response('success')

    # 댓글 수정
    def patch(self, request, reply_id):
        reply_content = request.data['reply_content']
        updated_date = timezone.now()

        reply = KnowhowReply.objects.get(id=reply_id)
        reply.knowhow_reply_content = reply_content
        reply.updated_date = updated_date
        reply.save(update_fields=['knowhow_reply_content', 'updated_date'])

        return Response('success')

# 노하우 게시물 스크랩 REST
class KnowhowScrapApi(APIView):
    def get(self, request, knowhow_id, member_id, scrap_status):
        # post_id = 게시물 id, member_id = 스크랩 누른 사람의 id, scrap_status = 스크랩을 on한건지 off한건지 확인
        # scrap_status가 TRUE이면 스크랩 on, FALSE이면 스크랩 off

        check_scrap_status = True

        # 만들어지면 True, 이미 있으면 False
        scrap, scrap_created = KnowhowScrap.objects.get_or_create(knowhow_id=knowhow_id, member_id=member_id)

        # 해당 게시물에 처음 스크랩을 누른 사람이면 위의 get_or_create에서 TRUE가 나오기 때문에 스크랩 ON
        if scrap_created:
            check_scrap_status = True

        # 스크랩을 처음으로 누른 사람이 아닌경우
        else:
            # rest js에서 전달된 scrap_status가 TRUE일 경우
            # (True값이 전달되는데 그냥 문자열로 인식되는탓인지 조건문에 그대로 사용하지 못해서 비교연산)
            if scrap_status == 'True':
                update_scrap = KnowhowScrap.objects.get(knowhow_id=knowhow_id, member_id=member_id)

                # post_scrap 테이블의 status컬럼의 값이 1일경우 on이기때문에 status를 1으로 설정
                update_scrap.status = 1
                update_scrap.save(update_fields=['status'])

                # 스크랩이 ON인지 OFF인지 화면에 전달하기 위해 ON일경우 True를 담아준다
                check_scrap_status = True

            else :
                update_scrap = KnowhowScrap.objects.get(knowhow_id=knowhow_id, member_id=member_id)
                # 스크랩 off이기 때문에 0으로 설정
                update_scrap.status = 0
                update_scrap.save(update_fields=['status'])
                # 스크랩이 off 되었기때문에 false를 담아준다
                check_scrap_status = False

        # 해당 게시물의 스크랩 갯수
        scrap_count = KnowhowScrap.objects.filter(knowhow_id=knowhow_id, status=1).count()

        datas = {
            'check_scrap_status': check_scrap_status,
            'scrap_count': scrap_count
        }

        return Response(datas)

# 노하우 게시물 좋아요 REST
class KnowhowLikeApi(APIView):
    def get(self, request, knowhow_id, member_id, like_status):

        check_like_status = True

        # print(knowhow_id, member_id, status)

        # 만들어지면 True, 이미 있으면 False
        like, like_created = KnowhowLike.objects.get_or_create(knowhow_id=knowhow_id, member_id=member_id)
        # 노하우 게시글 작성한 사람의 아이디
        knowhow = Knowhow.objects.filter(id=knowhow_id).values('member_id')

        # 해당 게시물에 처음 좋아요를 누른 사람이면 위의 get_or_create에서 TRUE가 나오기 때문에 좋아요 ON
        if like_created:
            check_like_status = True
            # 좋아요가 ON일 경우에 게시물 작성자에게 알람이 가도록 알람테이블에 INSERT(category 4번이 포스트 게시물 좋아요)
            Alarm.objects.create(alarm_category=2, receiver_id=knowhow, sender_id=member_id, target_id=knowhow_id)

        # 좋아요를 처음으로 누른 사람이 아닌경우
        else:
            # rest js에서 전달된 like_status가 TRUE일 경우(True값이 전달되는데 그냥 문자열로 인식되는탓인지 조건문에 그대로 사용하지 못해서 비교연산)
            if like_status == 'True':
                update_like = KnowhowLike.objects.get(knowhow_id=knowhow_id, member_id=member_id)

                update_like.status = 1
                update_like.save(update_fields=['status'])
                # 좋아요 on이기 때문에 True
                check_like_status = True

            else :
                update_like = KnowhowLike.objects.get(knowhow_id=knowhow_id, member_id=member_id)

                update_like.status = 0
                update_like.save(update_fields=['status'])
                # 좋아요 off기때문에 False
                check_like_status = False

        # 좋아요 갯수
        like_count = KnowhowLike.objects.filter(knowhow_id=knowhow_id, status=1).count()

        datas = {
            'check_like_status': check_like_status,
            'like_count': like_count
        }

        return Response(datas)