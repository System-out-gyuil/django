from django.db import transaction
from django.db.models import F, Q, Count, Value
from django.shortcuts import render, redirect
from django.utils import timezone
from django.views import View
from rest_framework.response import Response
from rest_framework.views import APIView

from alarm.models import Alarm
from knowhow.models import KnowhowTag, KnowhowFile
from member.models import Member, MemberProfile
from post.models import Post, PostCategory, PostTag, PostPlant, PostFile, PostReply, PostLike, PostScrap, PostReplyLike
from report.models import PostReport, PostReplyReport


# 포스트 작성페이지
class PostCreateView(View):
    def get(self, request):
        # 작성페이지로 이동
        return render(request, 'community/web/post/create-post.html')

    @transaction.atomic
    def post(self, request):
        # 작성페이지에서 입력한 값들
        data = request.POST
        # 작성페이지에서 업로드한 파일들
        files = request.FILES

        # 현재 로그인된 사람의 정보
        member = Member(**request.session['member'])

        # 포스트
        post = {
            'post_title': data['post-title'],
            'post_content': data['post-content'],
            'member': member
        }

        # 포스트 테이블에 insert
        post_data = Post.objects.create(**post)

        # 카테고리
        post_category = {
            'category_name': data['post-category'],
            'post': post_data
        }

        # 포스트 카테고리 테이블에 insert
        PostCategory.objects.create(**post_category)

        # 포스트 태그
        post_tag = {
            'tag_name': data['post-tags'],
            'post': post_data
        }

        # 포스트 태그 테이블에 insert
        PostTag.objects.create(**post_tag)

        # 식물 종류가 다중선택이라 getList로 list 타입으로 가져옴
        plant_types = data.getlist('plant-type')

        # 식물 종류
        for plant_type in plant_types:
            # print(plant_type)
            PostPlant.objects.create(post=post_data, plant_name=plant_type)

        # 첨부파일
        for key in files:
            # print(key)
            PostFile.objects.create(post=post_data, file_url=files[key])

        # 작성이 완료되면 포스트 상세 페이지로 이동하기위해 redirect로 detail view로 요청
        # 쿼리스트링으로 방금 작성된 게시물의 id를 가지고 이동
        return redirect(f'/post/detail/?id={post_data.id}')


# 포스트 상세 페이지
class PostDetailView(View):
    def get(self, request):
        # 포스트 작성페이지에서 쿼리스트링으로 담아서 보냈던 값을 받아옴 - request.GET['id']
        post = Post.objects.get(id=request.GET['id'])
        # 세션에 담겨있는 현제 로그인 된 사람의 ID
        session_member_id = request.session['member']['id']
        # 현제 로그인한 사람의 프로필 사진
        session_profile = MemberProfile.objects.get(id=session_member_id)
        # 상세페이지로 처음 이동했을 때 댓글 갯수
        reply_count = PostReply.objects.filter(post_id=post.id).values('id').count()
        # 게시글을 작성한 사람의 프로필
        member_profile = MemberProfile.objects.get(id=post.member_id)
        # 포스트 태그
        post_tags = PostTag.objects.filter(post_id__gte=1).values('tag_name')
        # 포스트 카테고리
        post_category = PostCategory.objects.filter(post_id=post).values('category_name').first()
        # 식물 종류
        post_plant = PostPlant.objects.filter(post_id=post.id).values('plant_name')

        # 상세페이지로 왔을 때 처음 표시될 스크랩과 좋아요 상태(on, off)
        post_scrap = PostScrap.objects.filter(post_id=post, member_id=session_member_id, status=1).exists()
        post_like = PostLike.objects.filter(post_id=post, member_id=session_member_id, status=1).exists()

        # 상세페이지에 들어올때마다(새로고침 등) 조회수 1 증가
        post.post_count += 1
        post.save(update_fields=['post_count'])

        # 포스트 파일에서 작성자가 업로드 한 사진들
        post_files = list(post.postfile_set.all())
        # 메인 사진으로 사용할 사진
        post_file = list(post.postfile_set.all())[0]
        # 포스트 게시글 작성자
        post_writer = Post.objects.filter(member_id=post.member_id).values('member__member_name').first()
        post_writer = post_writer['member__member_name']
        # templet으로 보낼 내용이 많아서 context에 담아서 한번에 전송
        context = {
            'post': post,
            'post_files': post_files,
            'post_file': post_file,
            'post_tags': post_tags,
            'reply_count': reply_count,
            'member_profile': member_profile,
            'post_category': post_category,
            'post_plant': post_plant,
            'post_writer': post_writer,
            'post_scrap': post_scrap,
            'post_like': post_like,
            'session_profile': session_profile
        }

        # context에 담긴 내용을 가지고 상세페이지 이동
        return render(request, 'community/web/post/post-detail.html', context)


# post 게시글 신고
class PostReportView(View):
    def post(self, request):
        # 현제 로그인된 사람의 id
        member_id = request.session['member']['id']
        # 신고하기 버튼을 눌렀을때 form태그에 담긴 신고 내용
        data = request.POST
        # 어떤 게시글을 신고 하였는지
        post_id = request.GET['id']

        # 위의 값들을 datas에 dict형태로 담기
        datas = {
            'member_id': member_id,
            'post_id': post_id,
            'report_content': data['report-content']
        }

        # 포스트 신고 테이블에 insert(datas를 언패킹하여)
        PostReport.object.create(**datas)

        # 신고를 완료하면 해당 게시글의 id를 담고 다시 post detail view로 이동
        return redirect(f'/post/detail/?id={post_id}')


# 포스트 댓글 신고
class PostReplyReportView(View):
    def post(self, request):
        data = request.POST
        # 현재 로그인 된 사람의 ID(신고 한 사람)
        member_id = request.session['member']['id']
        # 어떤 게시글의 댓글인지 확인하기 위해 게시글 ID
        post_id = request.GET['id']
        # 댓글 id
        reply_id = data['reply-report-reply-id']

        datas = {
            'member_id': member_id,
            'post_reply_id': reply_id,
            'report_content': data['reply-report-content']
        }

        # 포스트 댓글 신고 테이블에 insert
        PostReplyReport.object.create(**datas)

        # 댓글 신고 후 다시 PostDetailView로 요청
        return redirect(f'/post/detail/?id={post_id}')


# 포스트 상세보기 rest
class PostDetailApi(APIView):
    def get(self, request, post_id, page):
        # 요청마다 보여 줄 댓글의 갯수
        row_count = 5
        # 몇번째 페이지인지
        offset = (page - 1) * row_count
        # 최대치
        limit = row_count * page

        # 댓글 갯수
        reply_count = PostReply.objects.filter(post_id=post_id).count()
        # 좋아요 갯수
        like_count = PostLike.objects.filter(post_id=post_id, status=1).count()
        # 스크랩 갯수
        scrap_count = PostScrap.objects.filter(post_id=post_id, status=1).count()
        # 게시글 작성 날짜
        post_date = Post.objects.filter(id=post_id).values('created_date')

        # 댓글
        replies = PostReply.objects \
                      .filter(post_id=post_id).annotate(member_name=F('member__member_name')) \
                      .values('member_name', 'post__post_content', 'member_id', 'created_date', 'id',
                              'post_reply_content', 'member__memberprofile__file_url')[offset:limit]

        data = {
            'replies': replies,
            'reply_count': reply_count,
            'post_date': post_date,
            'like_count': like_count,
            'scrap_count': scrap_count
        }

        # response에 data를 담아서 templat으로 보내줌
        return Response(data)


# 포스트 수정하기
class PostUpdateView(View):
    def get(self, request):
        post_id = request.GET.get('id')

        # 포스트 수정하기 페이지로 이동 시 기존에 작성되어 있던 내용을 가져감
        post = Post.objects.get(id=post_id)
        post_file = list(post.postfile_set.values('file_url'))

        context = {
            'post': post,
            'post_files': post_file
        }

        # context를 담아서 포스트 수정페이지로 이동
        return render(request, 'community/web/post/edit-post.html', context)

    @transaction.atomic
    def post(self, request):
        # 수정 페이지에서 수정 후 수정완료 버튼 클릭 시 form태그에서 전송된 데이터들
        datas = request.POST
        files = request.FILES

        post_id = request.GET['id']

        # 현재 시간
        time_now = timezone.now()

        # 수정할 포스트 게시글 아이디
        post = Post.objects.get(id=post_id)

        # 노하우 게시글 수정
        post.post_title = datas['post-title']
        post.post_content = datas['post-content']
        post.updated_date = time_now
        post.save(update_fields=['post_title', 'post_content', 'updated_date'])

        # 포스트 카테고리 수정
        post_category = PostCategory.objects.get(post_id=post_id)

        post_category.category_name = datas['post-category']
        post_category.updated_date = time_now
        post_category.save(update_fields=['category_name', 'updated_date'])

        # 포스트 식물종류 수정
        plant_types = datas.getlist('plant-type')

        PostPlant.objects.filter(post_id=post_id).delete()

        for plant_type in plant_types:
            PostPlant.objects.create(post_id=post_id, plant_name=plant_type, updated_date=time_now)

        # 포스트 태그 수정
        post_tag = PostTag.objects.get(post_id=post_id)
        post_tag.tag_name = datas['post-tags']
        post_tag.updated_date = timezone.now()
        post_tag.save(update_fields=['tag_name', 'updated_date'])

        PostFile.objects.filter(post_id=post_id).delete()

        for key in files:
            PostFile.objects.create(post_id=post_id, file_url=files[key])

        return redirect(f'/post/detail/?id={post_id}')


# 포스트 삭제
class PostDeleteView(View):
    @transaction.atomic
    def get(self, request):
        post_id = request.GET['id']
        # 포스트 태그 삭제
        PostTag.objects.filter(post_id=post_id).delete()
        # 포스트 파일 삭제
        PostFile.objects.filter(post_id=post_id).delete()
        # 포스트 댓글 삭제
        PostReply.objects.filter(post_id=post_id).delete()
        # 포스트 카테고리 삭제
        PostCategory.objects.filter(post_id=post_id).delete()
        # 포스트 식물 종류 삭제
        PostPlant.objects.filter(post_id=post_id).delete()
        # 포스트 스크랩 삭제
        PostScrap.objects.filter(post_id=post_id).delete()
        # 포스트 좋아요 삭제
        PostLike.objects.filter(post_id=post_id).delete()
        # 포스트 게시물 삭제
        Post.objects.filter(id=post_id).delete()

        # 삭제 완료 후 포스트 목록으로 이동
        return redirect(f'/post/list/')


# 포스트 댓글 작성 REST
class PostReplyWriteApi(APIView):
    @transaction.atomic
    def post(self, request):
        data = request.data
        post = Post.objects.filter(id=data['post_id']).values('member_id')

        # 댓글 작성 시 해당 게시글 작성자에게 알람이 가도록 알람 테이블에 INSERT
        Alarm.objects.create(alarm_category=5, receiver_id=post, sender_id=request.session.get('member')['id'], target_id=data['post_id'])

        # print(data)
        data = {
            'post_reply_content': data['reply_content'],
            'post_id': data['post_id'],
            'member_id': request.session.get('member')['id']
        }

        # 포스트 댓글 테이블에 INSERT
        PostReply.objects.create(**data)

        # 템플릿에 다시 보내줄 내용이 없기 때문에 RETURN값이 없다
        return Response('success')


# 포스트 댓글 REST
class PostReplyApi(APIView):
    # 포스트 댓글 삭제
    def delete(self, request, reply_id):
        PostReply.objects.filter(id=reply_id).delete()
        return Response('success')

    # 포스트 댓글 수정
    def patch(self, request, reply_id):
        # print(request)
        reply_content = request.data['reply_content']
        updated_date = timezone.now()

        reply = PostReply.objects.get(id=reply_id)
        reply.post_reply_content = reply_content
        reply.updated_date = updated_date
        reply.save(update_fields=['post_reply_content', 'updated_date'])

        return Response('success')


# 포스트 게시물 스크랩 REST
class PostScrapApi(APIView):
    # post_id = 게시물 id, member_id = 스크랩 누른 사람의 id, scrap_status = 스크랩을 on한건지 off한건지 확인
    # scrap_status가 TRUE이면 스크랩 on, FALSE이면 스크랩 off
    def get(self, request, post_id, member_id, scrap_status):

        check_scrap_status = True

        # 만들어지면 True, 이미 있으면 False
        scrap, scrap_created = PostScrap.objects.get_or_create(post_id=post_id, member_id=member_id)

        # 해당 게시물에 처음 스크랩을 누른 사람이면 위의 get_or_create에서 TRUE가 나오기 때문에 스크랩 ON
        if scrap_created:
            check_scrap_status = True

        # 스크랩을 처음으로 누른 사람이 아닌경우
        else:
            # rest js에서 전달된 scrap_status가 TRUE일 경우
            # (True값이 전달되는데 그냥 문자열로 인식되는탓인지 조건문에 그대로 사용하지 못해서 비교연산)
            if scrap_status == 'True':
                update_scrap = PostScrap.objects.get(post_id=post_id, member_id=member_id)

                # post_scrap 테이블의 status컬럼의 값이 1일경우 on이기때문에 status를 1으로 설정
                update_scrap.status = 1
                update_scrap.save(update_fields=['status'])

                # 스크랩이 ON인지 OFF인지 화면에 전달하기 위해 ON일경우 True를 담아준다
                check_scrap_status = True

            else :
                update_scrap = PostScrap.objects.get(post_id=post_id, member_id=member_id)
                # 스크랩 off이기 때문에 0으로 설정
                update_scrap.status = 0
                update_scrap.save(update_fields=['status'])
                # 스크랩이 off 되었기때문에 false를 담아준다
                check_scrap_status = False

        # 해당 게시물의 스크랩 갯수
        scrap_count = PostScrap.objects.filter(post_id=post_id, status=1).count()

        datas = {
            'check_scrap_status': check_scrap_status,
            'scrap_count': scrap_count
        }

        return Response(datas)


# 포스트 게시물 좋아요 REST
class PostLikeApi(APIView):
    # post_id = 게시물 id, member_id = 좋아요 누른 사람의 id, like_status = 좋아요를 on한건지 off한건지 확인
    # like_status가 TRUE이면 좋아요 on, FALSE이면 좋아요 off
    def get(self, request, post_id, member_id, like_status):

        check_like_status = True

        # 만들어지면 True, 이미 있으면 False
        like, like_created = PostLike.objects.get_or_create(post_id=post_id, member_id=member_id)
        post = Post.objects.filter(id=post_id).values('member_id')


        # 해당 게시물에 처음 좋아요를 누른 사람이면 위의 get_or_create에서 TRUE가 나오기 때문에 좋아요 ON
        if like_created:
            check_like_status = True
            # 좋아요가 ON일 경우에 게시물 작성자에게 알람이 가도록 알람테이블에 INSERT(category 4번이 포스트 게시물 좋아요)
            Alarm.objects.create(alarm_category=4, receiver_id=post, sender_id=member_id, target_id=post_id)

        # 좋아요를 처음으로 누른 사람이 아닌경우
        else:
            # rest js에서 전달된 like_status가 TRUE일 경우(True값이 전달되는데 그냥 문자열로 인식되는탓인지 조건문에 그대로 사용하지 못해서 비교연산)
            if like_status == 'True':
                update_like = PostLike.objects.get(post_id=post_id, member_id=member_id)

                update_like.status = 1
                update_like.save(update_fields=['status'])
                # 좋아요 on이기 때문에 True
                check_like_status = True

            else :
                update_like = PostLike.objects.get(post_id=post_id, member_id=member_id)

                update_like.status = 0
                update_like.save(update_fields=['status'])
                # 좋아요 off기때문에 False
                check_like_status = False

        # 좋아요 갯수
        like_count = PostLike.objects.filter(post_id=post_id, status=1).count()

        datas = {
            'check_like_status': check_like_status,
            'like_count': like_count
        }

        return Response(datas)


# 포스트 좋아요 갯수
class PostLikeCountApi(APIView):
    def get(self, request, post_id):

        like_count = PostLike.objects.filter(post_id=post_id, status=1).count()

        return Response(like_count)


# 포스트 스크랩 갯수
class PostScrapCountApi(APIView):
    def get(self, request, post_id):

        scrap_count = PostScrap.objects.filter(post_id=post_id, status=1).count()

        return Response(scrap_count)


# 포스트 목록
class PostListView(View):
    def get(self, request):

        # 초기 화면에 나올 전체 포스트 게시글 갯수
        post_count = Post.objects.count()

        context = {
            'post_count': post_count
        }

        return render(request, 'community/web/post/post.html', context)


# 포스트 목록 REST
class PostListApi(APIView):
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
            condition2 |= Q(postcategory__category_name__contains='식물 키우기')
        elif types == '관련 제품':
            condition2 |= Q(postcategory__category_name__contains='관련 제품')
        elif types == '테라리움':
            condition2 |= Q(postcategory__category_name__contains='테라리움')
        elif types == '스타일링':
            condition2 |= Q(postcategory__category_name__contains='스타일링')
        elif types == '전체':
            condition2 |= Q()

        # 값을 문자열에 콤마(, )로 연결해서 담겨져 오기 때문에 콤마 단위로 split()함수를 사용해서 나누어줌
        filters = filters.split(',')
        # 콤마 단위로 나누어 준 값들은 ex) ',관엽식물' 이런식으로 나뉘어 지기 때문에 콤마를 제거 후 비교 하여 condition에 담아준다
        for filter in filters:
            if filter.replace(',', '') == '관엽식물':
                condition |= Q(postplant__plant_name__contains='관엽식물')

            elif filter.replace(',', '') == '침엽식물':
                condition |= Q(postplant__plant_name__contains='침엽식물')

            elif filter.replace(',', '') == '희귀식물':
                condition |= Q(postplant__plant_name__contains='희귀식물')

            elif filter.replace(',', '') == '다육':
                condition |= Q(postplant__plant_name__contains='다육')

            elif filter.replace(',', '') == '선인장':
                condition |= Q(postplant__plant_name__contains='선인장')

            elif filter.replace(',', '') == '기타':
                condition |= Q(postplant__plant_name__contains='기타')

            elif filter.replace(',', '') == '전체':
                condition = Q()

        # 정렬 방식에 따라 사용할 values가 다르기 때문에 세가지로 나누어 사용
        columns1 = [
            'post_title',
            'member_id',
            'post_count',
            'id',
            'like_count'
        ]

        columns2 = [
            'post_title',
            'member_id',
            'post_count',
            'id',
            'scrap_count',
        ]

        columns3 = [
            'post_title',
            'member_id',
            'post_count',
            'id'
        ]

        # 정렬이 최신순일 경우
        if sorting == '최신순':
            # -id를 통해 최신순이지만, 생성일에 따라 확실하게 정렬
            sort1 = '-id'
            sort2 = '-created_date'

            # 여기서 condition과 columns로 값을 뽑아주고 order_by절에 sort1과 sort2를 사용함(기본적으로 sort1으로 정렬이지만
            # 만약 sort1 에 해당하는 값이 같으면 sort2 기준으로 정렬 후 offset과 limit로 슬라이싱
            posts = Post.objects.filter(condition, condition2).values(*columns3).order_by(sort1, sort2)\
                [offset:limit]

            # 게시글 작성자와 좋아요 해당 게시물의 좋아요 갯수, 스크랩 갯수를
            # key-value 형식으로 추가해준다
            for post in posts:
                # 각각의 게시물마다 작성자를 구하여 posts에 추가
                member_name = Member.objects.filter(id=post['member_id']).values('member_name').first().get(
                    'member_name')
                post['member_name'] = member_name

                like_count = PostLike.objects.filter(status=1, post=post['id']).count()
                post['like_count'] = like_count

                scrap_count = PostScrap.objects.filter(status=1, post=post['id']).count()
                post['scrap_count'] = scrap_count

        # 정렬이 인기순일 경우
        elif sorting == '인기순':
            # 좋아요 갯수에 따라 정렬
            sort1 = '-like_count'
            # 좋아요 갯수가 같을 경우 조회수 순으로 정렬
            sort2 = '-post_count'

            # 위의 경우와 같지만 좋아요 갯수를 구해야 하기 때문에 annotate 를 이용해 집계함수 Count를 사용하여 해당 게시글의
            # 좋아요 갯수를 구한 후 구해진 좋아요 갯수에 따라 정렬
            posts = Post.objects.filter(condition, condition2) \
                           .annotate(like_count=Count('postlike__id', filter=Q(postlike__status=1))) \
                           .values(*columns1) \
                           .order_by(sort1, sort2)[offset:limit]

            for post in posts:
                member_name = Member.objects.filter(id=post['member_id']).values('member_name').first().get(
                    'member_name')
                post['member_name'] = member_name

                scrap_count = PostScrap.objects.filter(status=1, post=post['id']).count()
                post['scrap_count'] = scrap_count

        # 정렬이 스크랩순일 경우
        elif sorting == "스크랩순":
            # 스크랩 갯수에 따라 정렬
            sort1 = '-scrap_count'
            # 만약 스크랩 갯수가 같을 경우 최신순 정렬
            sort2 = '-id'

            # 인기순과 마찬가지로 스크랩된 수를 구하기 위해 annotate를 이용해 해당 게시물의 스크랩 횟수를 구해
            # 그 스크랩 수에 따라 정렬
            posts = Post.objects.filter(condition, condition2) \
                           .annotate(scrap_count=Count('postscrap__id', filter=Q(postscrap__status=1))) \
                           .values(*columns2) \
                           .order_by(sort1, sort2)[offset:limit]

            for post in posts:
                member_name = Member.objects.filter(id=post['member_id']).values('member_name').first().get(
                    'member_name')
                post['member_name'] = member_name

                like_count = PostLike.objects.filter(status=1, post=post['id']).count()
                post['like_count'] = like_count

        # 필터링된 게시물의 갯수
        # select-related로 post_like와 post_scrap을 post테이블에 join
        posts_count = Post.objects.select_related('postlike', 'postscrap').filter(condition, condition2) \
            .annotate(member_name=F('member__member_name')) \
            .values(*columns3) \
            .annotate(like_count=Count(Q(postlike__status=1)), scrap_count=Count(Q(postscrap__status=1))) \
            .values('post_title', 'member__member_name', 'post_count', 'id', 'member_id', 'like_count',
                    'scrap_count') \
            .order_by(sort1, sort2).distinct().count()

        # 위에서 만들어진 posts에 다시 dict형태로 key값이 없을 경우 새로 만들어주는걸 이용하여 게시글과 작성자의 사진을 추가
        for post in posts:
            post_file = PostFile.objects.filter(post_id=post['id']).values('file_url').first()
            profile = MemberProfile.objects.filter(member_id=post['member_id']).values('file_url').first()
            post['post_file'] = post_file['file_url']
            post['profile'] = profile['file_url']

        datas = {
            'posts': posts,
            'posts_count': posts_count
        }

        return Response(datas)


# # channel
# class ChannelView(View):
#     def get(self, request):
#         # 노하우태그와 포스트 태그를 중복제거한 후 union
#         # 어노테이트에 파일 추가
#         # 중복 제거된 태그이름으로 조회
#         post_tags = PostTag.objects.annotate(posts=F('post_id'), knowhows=Value(0), tag_names=Count('id')).values('tag_name', 'posts', 'knowhows').order_by('-tag_names')
#         knowhow_tags = KnowhowTag.objects.annotate(posts=Value(0), knowhows=F('knowhow_id'), tag_names=Count('id')).values('tag_name', 'posts', 'knowhows').order_by('-tag_names')
#         tags = post_tags.union(knowhow_tags)
#
#         filtering_tags = []
#
#         for tag in tags:
#             print(tag)
#             filtering_tags.append(tag['tag_name'])
#
#         filtering_tags = set(filtering_tags)
#
#         print(filtering_tags)
#
#         filtered_tags = PostTag.objects.values('tag_name').annotate(tag_names=Count('id')).values('tag_names', 'tag_name').order_by('-tag_names')
#
#         for tag in filtered_tags:
#             print(tag)
#         # for tag in tags:




        # for tag in tags:
        #     if tag['posts'] != 0:
        #         post_file = PostFile.objects.filter(post_id=tag['posts']).values('file_url').first()
        #         tag['post_file'] = post_file['file_url']
        #
        #     else:
        #         knowhow_file = KnowhowFile.objects.filter(knowhow_id=tag['knowhows']).values('file_url').first()
        #         tag['knowhow_file'] = knowhow_file['file_url']

            # print(tag)

        # print(type(tags))
        #
        # context = {
        #     'filtering_tags': filtering_tags,
        # }
        #
        # return render(request, 'community/web/channel.html', context)
