import math

from django.db.models import Q
from rest_framework.response import Response
from rest_framework.views import APIView

from qna.models import QnA

class QnAListAPI(APIView):
    # API에서 QnA 목록을 가져오는 뷰
    # manager-qna.js에서 fetch로 요청받을 때 이 뷰가 사용된다
    def get(self, request):
        # 쿼리 스트링에서 검색 키워드와 페이지 값 받아오기
        keyword = request.GET.get('keyword', '')
        page = int(request.GET.get('page', 1))

        # 한 페이지에 띄울 신고 내역 수
        row_count = 10

        # 한 페이지에 표시할 신고 내역들을 슬라이싱 하기 위한 변수들
        offset = (page - 1) * row_count
        limit = page * row_count

        # 검색 조건식 선언
        condition = Q()

        # keyword로 뭐라도 받았다면, keyword가 포함된 신고 사유 or 신고자 닉네임 or 신고 대상의 제목을 검색
        if keyword:
            condition |= Q(qna_title__icontains=keyword)
            condition |= Q(qna_content__icontains=keyword)

        # 공지사항 표시에 필요한 tbl_notice의 컬럼들
        columns = [
            'id',
            'qna_title',
            'qna_content'
        ]

        # 게시 중인 공지사항의 제목과 내용을 10개씩 가져와서 notices에 할당(list)
        qnas = QnA.enabled_objects.values(*columns).filter(condition, id__isnull=False)

        # QnA 수
        total = qnas.count()

        # 페이지네이션에 필요한 정보들
        page_count = 5  # 화면에 표시할 페이지 숫자 버튼의 최대 개수

        has_next_page = QnA.enabled_objects.values(*columns)\
                            .filter(condition, id__isnull=False)[limit:limit+1].exists()

        end_page = math.ceil(page / page_count) * page_count  # 화면에 표시할 페이지 숫자 버튼 중 마지막 페이지
        start_page = end_page - page_count + 1  # 화면에 표시할 페이지 숫자 버튼 중 첫 페이지
        real_end = math.ceil(total / row_count)  # 전체 리스트의 마지막 페이지

        # end_page의 값이 real_end 보다 커지지 않게 조정
        end_page = real_end if end_page > real_end else end_page

        # end_page의 값이 0보다 작아지지 않게 조정
        if end_page == 0:
            end_page = 1

        # 페이지네이션에 사용할 정보 완성
        page_info = {
            'totalCount': total,
            'startPage': start_page,
            'endPage': end_page,
            'page': page,
            'realEnd': real_end,
            'pageCount': page_count,
            'hasNext': has_next_page
        }

        # 신고 목록을 QuerySet -> list 타입으로 변경
        qnas = list(qnas[offset:limit])

        # 신고 목록의 맨 뒤에 페이지네이션 정보 추가
        qnas.append(page_info)

        # 요청한 데이터 반환
        return Response(qnas)
