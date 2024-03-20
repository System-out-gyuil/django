from datetime import datetime, timedelta

from django.db import transaction
from django.db.models import Count, Avg, Sum, F, Q
from django.shortcuts import render, redirect
from django.views import View
from rest_framework.response import Response
from rest_framework.views import APIView

from apply.models import Apply, Trainee
from cart.models import CartDetail, Cart
from lecture.models import LectureCategory, Lecture, LectureProductFile, LecturePlant, Kit, LectureReview, \
    LectureAddress, LectureScrap
from member.models import Member, MemberAddress, MemberProfile
from order.models import OrderMileage
from report.models import LectureReport
from selleaf.date import Date
from selleaf.time import Time
from teacher.models import Teacher


def date_range_with_weekdays(start, end, weekday_type):
    start_date = datetime.strptime(start, "%Y-%m-%d")
    end_date = datetime.strptime(end, "%Y-%m-%d")

    # 요일 타입 가져오기
    weekdays = list(map(int, weekday_type))

    target_weekday_numbers = [weekday % 7 for weekday in weekdays]

    dates = []
    for target_weekday_number in target_weekday_numbers:
        # 시작 날짜로부터 요일까지의 차이
        start_weekday_difference = (target_weekday_number - start_date.weekday() + 7) % 7

        # 시작 날짜에 차이를 더해서 해당 요일의 첫 번째 날짜를 구함
        target_date = start_date + timedelta(days=start_weekday_difference)

        while target_date <= end_date:
            dates.append(target_date.strftime("%Y-%m-%d"))
            target_date += timedelta(days=7)  # 한 주 뒤의 같은 요일로 이동

    return dates


def divide_time_intervals(start_time, end_time, interval):
    # 시작 시간과 끝 시간을 datetime 객체로 변환
    start = datetime.strptime(start_time, "%H:%M")
    end = datetime.strptime(end_time, "%H:%M")

    # 시간 간격을 분 단위로 변환
    interval_minutes = int(interval[:-3]) * 60

    # 결과를 저장할 리스트
    time_intervals = []

    # 시작 시간부터 끝 시간까지 시간 간격만큼씩 더해가며 시간대를 나눔
    while start + timedelta(minutes=interval_minutes) <= end:
        next_time = start + timedelta(minutes=interval_minutes)
        time_intervals.append((start.strftime("%H:%M"), next_time.strftime("%H:%M")))
        start = next_time

    # 남은 시간을 마지막에 추가
    if start < end:
        time_intervals.append((start.strftime("%H:%M"), end.strftime("%H:%M")))

    return time_intervals


class LectureMainView(View):
    def get(self, request):
        # 현재 로그인한 사용자의 주소 정보 가져오기
        member_address = MemberAddress.objects.get(member_id=request.session['member']['id'])
        address_city = member_address.address_city
        address_district = member_address.address_district
        # print(member_address)
        # print('=' * 10)
        # 같은 주소에 있는 강의 찾기
        lectures_with_same_address = Lecture.objects.filter(lectureaddress__address_city=address_city,
                                                            lectureaddress__address_district=address_district)

        # 필터링된 강의 목록 출력
        # for lecture in lectures_with_same_address:
        # print(lecture)

        # 위의 lectures_with_same_address가 현재 로그인한 사용자와 같은 지역에서 하는 강의임
        lectures_with_same_address = Lecture.objects.filter(
            lectureaddress__address_city=address_city,
            lectureaddress__address_district=address_district,
            lecture_status=False  # 현재 진행 중인 강의만 가져오도록 수정
        ).annotate(
            member_name=F('teacher__member__member_name')
        ).values(
            'lecture_title',
            'lecture_price',
            'member_name',
            'id',
            'teacher__member_id',
            'lecture_status'
        )

        # for lecture in lectures_with_same_address:
            # print(lecture)

        # 필터링된 강의 목록에 대한 추가 정보 가져오기
        for lecture in lectures_with_same_address:
            lecture_file = LectureProductFile.objects.filter(lecture_id=lecture['id']).values('file_url').first()
            profile = MemberProfile.objects.filter(member_id=lecture['teacher__member_id']).values(
                'file_url').first()
            lecture['lecture_file'] = lecture_file['file_url'] if lecture_file else None
            lecture['profile'] = profile['file_url'] if profile else None

            lecture_scrap = LectureScrap.objects.filter(lecture_id=lecture['id'],
                                                        member_id=request.session['member']['id']).values(
                'status').first()
            lecture['lecture_scrap'] = lecture_scrap[
                'status'] if lecture_scrap and 'status' in lecture_scrap else False

            product_plants = LecturePlant.objects.filter(lecture_id=lecture['id']).values('plant_name')
            product_list = [item['plant_name'] for item in product_plants]
            lecture['plant_name'] = product_list

        context = {
            'lectures': lectures_with_same_address,
            'member_address': member_address,
        }

        return render(request, 'lecture/web/lecture-main.html', context)


class LectureMainApi(APIView):
    def get(self, request, page):
        # 페이지당 행 수와 오프셋 설정
        row_count = 8
        offset = (page - 1) * row_count
        limit = row_count * page

        # 현재 로그인한 사용자 위치 가져오기
        member_address = MemberAddress.objects.get(member_id=request.session['member']['id'])
        address_city = member_address.address_city
        address_district = member_address.address_district

        # 해당 지역의 강의 목록 가져오기
        lectures = Lecture.objects.filter(
            lectureaddress__address_city=address_city,
            lectureaddress__address_district=address_district,
            lecture_status=False
        ).annotate(
            member_name=F('teacher__member__member_name')
        ).values(
            'lecture_title',
            'lecture_price',
            'member_name',
            'id',
            'teacher__member_id',
            'lecture_status'
        )

        # 각 강의에 대한 추가 정보 가져오기
        for lecture in lectures:
            # 강의 파일 정보 가져오기
            lecture_file = LectureProductFile.objects.filter(lecture_id=lecture['id']).values('file_url').first()
            lecture['lecture_file'] = lecture_file['file_url'] if lecture_file else None

            # 강사 프로필 정보 가져오기
            profile = MemberProfile.objects.filter(member_id=lecture['teacher__member_id']).values('file_url').first()
            lecture['profile'] = profile['file_url'] if profile else None

            # 강의 스크랩 정보 가져오기
            lecture_scrap = LectureScrap.objects.filter(lecture_id=lecture['id'],
                                                        member_id=request.session['member']['id']).values('status').first()
            lecture['lecture_scrap'] = lecture_scrap['status'] if lecture_scrap and 'status' in lecture_scrap else False

            # 강의 관련 식물 정보 가져오기
            product_plants = LecturePlant.objects.filter(lecture_id=lecture['id']).values('plant_name')
            product_list = [item['plant_name'] for item in product_plants]
            lecture['plant_name'] = product_list

        return Response(lectures[offset:limit])



class LectureTotalView(View):
    def get(self, request):

        lecture_count = Lecture.objects.count()

        context = {'lecture_count': lecture_count}

        return render(request, 'lecture/web/lecture-total.html', context)


class LectureTotalApi(APIView):
    def get(self, request, page, sorting, filters, type):
        # 현재 로그인한 사용자 정보 가져오기
        member = request.session['member']
        # 페이지당 행 수와 오프셋 설정
        row_count = 8
        offset = (page - 1) * row_count
        limit = row_count * page

        # print(type)

        # 필터 넣기
        condition = Q()
        condition2 = Q()
        sort1 = '-id'
        sort2 = '-id'

        if type == '리스/트리':
            condition2 |= Q(lecturecategory__category_name__contains='리스/트리')
        elif type == '바구니/센터피스/박스':
            condition2 |= Q(lecturecategory__category_name__contains='바구니/센터피스/박스')
        elif type == '가드닝/테라리움':
            condition2 |= Q(lecturecategory__category_name__contains='가드닝/테라리움')
        elif type == '기타':
            condition2 |= Q(lecturecategory__category_name__contains='기타')
        elif type == '전체':
            condition2 |= Q()


        filters = filters.split(',')
        for filter in filters:
            # print(filter.replace(',', ''))
            if filter.replace(',', '') == '관엽식물':
                condition |= Q(lectureplant__plant_name__contains='관엽식물')

            elif filter.replace(',', '') == '침엽식물':
                condition |= Q(lectureplant__plant_name__contains='침엽식물')

            elif filter.replace(',', '') == '희귀식물':
                condition |= Q(lectureplant__plant_name__contains='희귀식물')

            elif filter.replace(',', '') == '다육/선인장':
                condition |= Q(lectureplant__plant_name__contains='다육/선인장')

            elif filter.replace(',', '') == '기타':
                condition |= Q(lectureplant__plant_name__contains='기타')

            elif filter.replace(',', '') == '전체':
                condition = Q()

        # print(condition)

        if sorting == '최신순':
            sort1 = '-id'
            sort2 = '-created_date'

        elif sorting == "스크랩순":
            sort1 = '-scrap_count'
            sort2 = '-id'

        columns = [
            'lecture_title',
            'member_name',
            'id',
            'teacher__member_id'
        ]

        # select_related로 조인먼저 해준다음, annotate로 member 조인에서 가져올 values 가져온다음
        # like와 scrap의 갯수를 가상 컬럼으로 추가해서 넣어주고, 진짜 사용할 밸류들 가져온 후, distinct로 중복 제거
        lectures = Lecture.objects.select_related('lecturescrap').filter(condition, condition2, lecture_status=False) \
            .annotate(member_name=F('teacher__member__member_name')) \
            .values(*columns) \
            .annotate(scrap_count=Count(Q(lecturescrap__status=1))) \
            .values('id', 'lecture_title', 'lecture_price', 'teacher__member__member_name', 'teacher__member_id', 'scrap_count', 'online_status')\
            .order_by(sort1, sort2).distinct()

        lectures_count = Lecture.objects.select_related('lecturescrap').filter(condition, condition2, lecture_status=False)  \
            .annotate(member_name=F('teacher__member__member_name')) \
            .values(*columns)  \
            .annotate(scrap_count=Count(Q(lecturescrap__status=1)))  \
            .values('id', 'lecture_title', 'lecture_price', 'teacher__member__member_name', 'teacher__member_id', 'scrap_count', 'online_status') \
            .order_by(sort1, sort2).distinct().count()

        # print(lectures_count)

        # print(lectures)
        # print('=' * 20)
        # lecture에 lectures를 가상 컬럼을 만들어서 하나씩 추가해줌
        for lecture in lectures:
            lecture_file = LectureProductFile.objects.filter(lecture_id=lecture['id']).values('file_url').first()
            profile = MemberProfile.objects.filter(member_id=lecture['teacher__member_id']).values('file_url').first()

            lecture['lecture_file'] = lecture_file['file_url'] if lecture_file else None
            lecture['profile'] = profile['file_url'] if profile else None

            lecture_scrap = LectureScrap.objects.filter(lecture_id=lecture['id'], member_id=member['id']).values('status').first()
            lecture['lecture_scrap'] = lecture_scrap['status'] if lecture_scrap and 'status' in lecture_scrap else False

            product_plants = LecturePlant.objects.filter(lecture_id=lecture['id']).values('plant_name')
            product_list = [item['plant_name'] for item in product_plants]
            lecture['plant_name'] = product_list
            # print(lecture)


        # # 강의 목록 가져오기 (마감되지 않은 강의)
        # lectures = Lecture.objects.filter(lecture_status=False).annotate(
        #     member_name=F('teacher__member__member_name')
        # ).values(
        #     'lecture_title',
        #     'lecture_price',
        #     'member_name',
        #     'id',
        #     'teacher__member_id',  # 강사의 멤버 ID 가져오도록 수정
        #     'lecture_status',
        #     'online_status'
        # )
        #
        # # 각 강의에 대한 추가 정보 가져오기
        # for lecture in lectures:
        #     # 강의 파일 정보 가져오기
        #     lecture_file = LectureProductFile.objects.filter(lecture_id=lecture['id']).values('file_url').first()
        #     lecture['lecture_file'] = lecture_file['file_url'] if lecture_file else None
        #     # print(lecture_file)
        #
        #     # 강사 프로필 정보 가져오기
        #     profile = MemberProfile.objects.filter(member_id=lecture['teacher__member_id']).values('file_url').first()
        #     lecture['profile'] = profile['file_url'] if profile else None
        #
        #     # 강의 스크랩 정보 가져오기
        #     lecture_scrap = LectureScrap.objects.filter(lecture_id=lecture['id'], member_id=member['id']).values('status').first()
        #     lecture['lecture_scrap'] = lecture_scrap['status'] if lecture_scrap and 'status' in lecture_scrap else False
        #
        #     # 강의 관련 식물 정보 가져오기
        #     product_plants = LecturePlant.objects.filter(lecture_id=lecture['id']).values('plant_name')
        #     product_list = [item['plant_name'] for item in product_plants]
        #     lecture['plant_name'] = product_list

        lectures = lectures[offset:limit]

        datas = {
            'lectures': lectures,
            'lectures_count': lectures_count
        }

        # 페이징된 결과 반환
        return Response(datas)


class LectureDetailOnlineView(View):
    def get(self, request):
        member = request.session['member']
        lecture_id = request.GET.get('id')
        # print(member, lecture_id)
        lecture = Lecture.objects.filter(id=request.GET['id'], online_status=True) \
            .values('id', 'lecture_title', 'lecture_content', 'lecture_price', 'lecture_headcount', 'lecture_status',
                    'teacher_id', 'teacher__member__member_name', 'lecture_category__lecture_category_name',
                    'teacher__member__member_email', 'teacher__member_id').first()

        lecture_scrap = LectureScrap.objects.filter(lecture_id=lecture['id'],
                                                    member_id=member['id']).values('status').first()
        lecture['lecture_scrap'] = lecture_scrap['status'] if lecture_scrap and 'status' in lecture_scrap else False

        # 올린 강의 게시물을 작성한 사용자 찾기
        teacher_id = lecture['teacher_id']

        lectures = Lecture.objects.filter(teacher=teacher_id, lecture_status=False, online_status=True) \
            .values('id', 'lecture_title', 'lecture_price', 'lecture_content', 'teacher__member__member_name',
                    'teacher__member_id')

        for lte in lectures:
            lecture_scrap = LectureScrap.objects.filter(lecture_id=lte['id'],
                                                        member_id=member['id']).values('status').first()
            lte['lecture_scrap'] = lecture_scrap['status'] if lecture_scrap and 'status' in lecture_scrap else False
            product_img = LectureProductFile.objects.filter(lecture_id=lte['id']).values('file_url').first()

            if product_img:
                lte['product_img'] = product_img['file_url']
            else:
                # 기본값이나 스킵 처리 등을 추가할 수 있음
                lte['product_img'] = None  # 혹은 기본 이미지 URL 설정
            product_plants = LecturePlant.objects.filter(lecture_id=lte['id']).values('plant_name')
            product_plants_list = list(product_plants)
            product_list = [item['plant_name'] for item in product_plants_list]
            lte['plant_name'] = product_list

        # review 계산 연산식
        review_count = LectureReview.objects.filter(lecture_id=request.GET['id']).count()
        # 해당 강의에 대한 별점에 따른 리뷰 개수
        rating_counts = LectureReview.objects.filter(lecture_id=request.GET['id']).values('review_rating') \
            .annotate(count=Count('id'))

        # 별점 범위와 개수
        rating_dict = {str(i): 0 for i in range(1, 6)}
        # 각 별점에 따른 개수 저장
        for item in rating_counts:
            rating_dict[str(item['review_rating'])] = item['count']

        # 리뷰 평균 구하기
        # 해당 강의에 대한 리뷰들의 총합과 개수를 구함
        review_sum = LectureReview.objects.filter(lecture_id=request.GET['id']).aggregate(
            sum_rating=Sum('review_rating'),
            count=Count('id'))

        # 리뷰가 있는 경우에만 평균을 계산
        if review_sum['count'] > 0:
            average_rating = round(review_sum['sum_rating'] / review_sum['count'], 1)
        else:
            average_rating = 0

        dates = Date.objects.filter(lecture_id=lecture['id']).values('id', 'date')
        for date in dates:
            times = Time.objects.filter(date_id=date['id']).values('id', 'time')
        reviews = LectureReview.objects.filter(lecture_id=lecture['id']) \
            .values('id', 'review_title', 'review_content', 'review_rating', 'member__member_name')
        kits = Kit.objects.filter(lecture_id=lecture['id']).values('id', 'kit_name', 'kit_content')

        lecture_count = lectures.count()

        context = {
            'lecture': lecture,
            'lecture_files': list(LectureProductFile.objects.filter(lecture_id=lecture_id).values('file_url')),
            'lecture_file': list(LectureProductFile.objects.filter(lecture_id=lecture_id).values('file_url'))[0],
            'lecture_order_date': dates.order_by('date'),
            'reviews': reviews,
            'kits': kits,
            'lectures': lectures,
            'review_count': review_count,
            'rating_counts': rating_dict,
            'average_rating': average_rating,
            'lecture_count': lecture_count,
            'lecture_order_time': times.order_by('time'),

        }

        return render(request, 'lecture/web/lecture-detail-online.html', context)


class LectureDetailOfflineView(View):
    def get(self, request):
        member = request.session['member']
        lecture_id = request.GET.get('id')
        # print(member, lecture_id)
        lecture = Lecture.objects.filter(id=request.GET['id'], online_status=False) \
            .values('id', 'lecture_title', 'lecture_content', 'lecture_price', 'lecture_headcount', 'online_status',
                    'teacher_id', 'teacher__member__member_name', 'lecture_category__lecture_category_name',
                    'teacher__member__member_email', 'teacher__member_id').first()
        # print(lecture)
        lecture_scrap = LectureScrap.objects.filter(lecture_id=lecture['id'],
                                                    member_id=member['id']).values('status').first()
        lecture['lecture_scrap'] = lecture_scrap['status'] if lecture_scrap and 'status' in lecture_scrap else False

        # 올린 강의 게시물을 작성한 사용자 찾기
        teacher_id = lecture['teacher_id']

        lectures = Lecture.objects.filter(teacher=teacher_id, lecture_status=False, online_status=False) \
            .values('id', 'lecture_title', 'lecture_price', 'lecture_content', 'teacher__member__member_name',
                    'teacher__member_id')

        for lte in lectures:
            lecture_scrap = LectureScrap.objects.filter(lecture_id=lte['id'],
                                                        member_id=member['id']).values('status').first()
            lte['lecture_scrap'] = lecture_scrap['status'] if lecture_scrap and 'status' in lecture_scrap else False
            product_img = LectureProductFile.objects.filter(lecture_id=lte['id']).values('file_url').first()

            if product_img:
                lte['product_img'] = product_img['file_url']
            else:
                # 기본값이나 스킵 처리 등을 추가할 수 있음
                lte['product_img'] = None  # 혹은 기본 이미지 URL 설정
            product_plants = LecturePlant.objects.filter(lecture_id=lte['id']).values('plant_name')
            product_plants_list = list(product_plants)
            product_list = [item['plant_name'] for item in product_plants_list]
            lte['plant_name'] = product_list

        # review 계산 연산식
        review_count = LectureReview.objects.filter(lecture_id=request.GET['id']).count()
        # 해당 강의에 대한 별점에 따른 리뷰 개수
        rating_counts = LectureReview.objects.filter(lecture_id=request.GET['id']).values('review_rating') \
            .annotate(count=Count('id'))

        # 별점 범위와 개수
        rating_dict = {str(i): 0 for i in range(1, 6)}
        # 각 별점에 따른 개수 저장
        for item in rating_counts:
            rating_dict[str(item['review_rating'])] = item['count']

        # 리뷰 평균 구하기
        # 해당 강의에 대한 리뷰들의 총합과 개수를 구함
        review_sum = LectureReview.objects.filter(lecture_id=request.GET['id']).aggregate(
            sum_rating=Sum('review_rating'),
            count=Count('id'))

        # 리뷰가 있는 경우에만 평균을 계산
        if review_sum['count'] > 0:
            average_rating = round(review_sum['sum_rating'] / review_sum['count'], 1)
        else:
            average_rating = 0

        dates = Date.objects.filter(lecture_id=lecture['id']).values('id', 'date')
        for date in dates:
            times = Time.objects.filter(date_id=date['id']).values('id', 'time')
        reviews = LectureReview.objects.filter(lecture_id=lecture['id']) \
            .values('id', 'review_title', 'review_content', 'review_rating', 'member__member_name')
        address = LectureAddress.objects.filter(lecture_id=lecture['id']) \
            .values('id', 'address_city', 'address_district').first()

        lecture_count = lectures.count()

        context = {
            'lecture': lecture,
            'lecture_files': list(LectureProductFile.objects.filter(lecture_id=lecture_id).values('file_url')),
            'lecture_file': list(LectureProductFile.objects.filter(lecture_id=lecture_id).values('file_url'))[0],
            'lecture_order_date': dates.order_by('date'),
            'reviews': reviews,
            'address': address,
            'lectures': lectures,
            'review_count': review_count,
            'rating_counts': rating_dict,
            'average_rating': average_rating,
            'lecture_count': lecture_count,
            'lecture_order_time': times.order_by('time'),
        }

        return render(request, 'lecture/web/lecture-detail-offline.html', context)

    # apply로 보내주기
    @transaction.atomic()
    def post(self, request):
        # apply create
        print(request.POST)
        apply_data = request.POST

        lecture = Lecture.objects.get(id=apply_data['id'])
        member = request.session['member']
        member = Member.objects.get(id=member['id'])


        data = {
            'date': apply_data['date-input'],
            'time': apply_data['time-input'],
            'member': member,
            'lecture': lecture,
            'quantity': apply_data['kt-count-btn'],
        }

        apply = Apply.objects.create(**data)
        member_mileage = OrderMileage.objects.create()
        # 같이 듣는 사람 넣기
        name_inputs = request.POST.getlist('name_input')
        for name_input in name_inputs:
            Trainee.objects.create(lecture=lecture, trainee_name=name_input)

        return redirect(f'/order/order/?id={apply.id}')


class LectureDetailCartAPI(APIView):
    def post(self, request):
        apply_data = request.POST

        lecture = Lecture.objects.get(id=apply_data['id'])
        member = request.session['member']
        member = Member.objects.get(id=member['id'])

        data = {
            'date': apply_data['date-input'],
            'time': apply_data['time-input'],
            'member': member,
            'lecture': lecture,
            'quantity': apply_data['kt-count-btn'],
            'apply_status': -3
        }

        apply = Apply.objects.create(**data)

        cart = Cart.objects.filter(member_id = member, cart_status=0).values('id').first()

        cart_data = {
            'apply_id': apply.id,
            'cart_id': cart.get('id')
        }

        CartDetail.objects.create(**cart_data)

        # 같이 듣는 사람 넣기
        name_inputs = request.POST.getlist('name_input')
        for name_input in name_inputs:
            Trainee.objects.create(lecture=lecture, trainee_name=name_input)

        return Response("success")


class LectureUploadOnlineView(View):
    def get(self, request):
        return render(request, 'lecture/web/lecture-upload-online.html')

    @transaction.atomic
    def post(self, request):
        lecture_data = request.POST
        files = request.FILES

        member = request.session['member']

        data = {
            'lecture_price': lecture_data['price-input'],
            'lecture_headcount': lecture_data['number-input'],
            'lecture_title': lecture_data['title-input'],
            'lecture_content': lecture_data['content-text-area'],
            'teacher': Teacher.objects.get(member_id=member['id']),
            'lecture_category': LectureCategory.objects.create(lecture_category_name=lecture_data['product-index']),
            'online_status': True,
        }
        # Lecture create
        lecture = Lecture.objects.create(**data)

        # LecturePlant create
        plant_types = lecture_data.getlist('plant-type')
        for plant_type in plant_types:
            LecturePlant.objects.create(lecture=lecture, plant_name=plant_type)

        # 날짜, 시간 넣기
        start_date_input = request.POST.get('start-date-input')
        end_date_input = request.POST.get('end-date-input')
        weekday_type = request.POST.getlist('weekday-type')

        # 날짜 범위 및 요일 유형을 기반으로 날짜 리스트 가져오기
        dates = date_range_with_weekdays(start_date_input, end_date_input, weekday_type)

        # 강의 시간(시작 시간, 종료 시간, 강의 시간)
        start_time = request.POST.get('start-time-input')
        end_time = request.POST.get('end-time-input')
        interval = request.POST.get('time-type')

        # 시간대를 나누고 남은 시간을 추가하여 출력
        time_intervals = divide_time_intervals(start_time, end_time, interval)

        times = []
        # 계산된 시간대를 출력
        for interval in time_intervals:
            times.append(f"{interval[0]}~{interval[1]}")

        # 계산된 날짜를 출력
        # Date Create
        for date in dates:
            lecture_date = Date.objects.create(lecture=lecture, date=date)
            # Time Create
            for time in times:
                Time.objects.create(date=lecture_date, time=time)

        # # LectureProductFile create
        for key in files:
            LectureProductFile.objects.create(lecture=lecture, file_url=files[key])

        # Kit create
        diy_name_input = request.POST.getlist('diy-name-input')
        diy_content_input = request.POST.getlist('diy-content-input')
        for i in range(len(diy_name_input)):
            Kit.objects.create(lecture=lecture, kit_name=diy_name_input[i], kit_content=diy_content_input[i])

        return redirect(f'/lecture/detail/online/?id={lecture.id}')


class LectureUploadOfflineView(View):
    def get(self, request):
        return render(request, 'lecture/web/lecture-upload-offline.html')

    @transaction.atomic
    def post(self, request):
        lecture_data = request.POST
        files = request.FILES

        member = request.session['member']

        data = {
            'lecture_price': lecture_data['price-input'],
            'lecture_headcount': lecture_data['number-input'],
            'lecture_title': lecture_data['title-input'],
            'lecture_content': lecture_data['content-text-area'],
            'teacher': Teacher.objects.get(member_id=member['id']),
            'lecture_category': LectureCategory.objects.create(lecture_category_name=lecture_data['product-index']),
            'online_status': False,
        }
        # Lecture create
        lecture = Lecture.objects.create(**data)

        # LecturePlant create
        plant_types = lecture_data.getlist('plant-type')
        for plant_type in plant_types:
            LecturePlant.objects.create(lecture=lecture, plant_name=plant_type)

        # 강의 장소 넣어주기
        local_selected = request.POST.get('product-index-local')
        control_selected = request.POST.get('product-index-control')
        LectureAddress.objects.create(lecture=lecture, address_city=local_selected, address_district=control_selected,
                                      address_detail="입니다.")

        # 날짜, 시간 넣기
        start_date_input = request.POST.get('start-date-input')
        end_date_input = request.POST.get('end-date-input')
        weekday_type = request.POST.getlist('weekday-type')

        # 날짜 범위 및 요일 유형을 기반으로 날짜 리스트 가져오기
        dates = date_range_with_weekdays(start_date_input, end_date_input, weekday_type)

        # 강의 시간(시작 시간, 종료 시간, 강의 시간)
        start_time = request.POST.get('start-time-input')
        end_time = request.POST.get('end-time-input')
        interval = request.POST.get('time-type')

        # 시간대를 나누고 남은 시간을 추가하여 출력
        time_intervals = divide_time_intervals(start_time, end_time, interval)

        times = []
        # 계산된 시간대를 출력
        for interval in time_intervals:
            times.append(f"{interval[0]}~{interval[1]}")

        # 계산된 날짜를 출력
        # Date Create
        for date in dates:
            lecture_date = Date.objects.create(lecture=lecture, date=date)
            # Time Create
            for time in times:
                Time.objects.create(date=lecture_date, time=time)

        # LectureProductFile create
        for key in files:
            LectureProductFile.objects.create(lecture=lecture, file_url=files[key])

        return redirect(f'/lecture/detail/offline/?id={lecture.id}')


class LectureUpdateOnlineView(View):
    def get(self, request):
        lecture = Lecture.objects.get(id=request.GET['id'])
        kits = Kit.objects.filter(lecture_id=lecture.id).values()

        context = {
            'lecture': lecture,
            'kits': kits
        }
        # print(lecture)

        return render(request, "lecture/web/lecture-update-online.html", context)

    @transaction.atomic
    def post(self, request):
        data = request.POST
        lecture_id = data['id']

        # 수정할 게시물 가져오기
        lecture = Lecture.objects.get(id=lecture_id)

        # 게시물 중 카테고리 아이디 찾아오기
        lecture_category_number = Lecture.objects.get(id=lecture_id).lecture_category_id

        # 게시물 강의 구분 수정
        lecture_category = LectureCategory.objects.get(id=lecture_category_number)
        lecture_category.lecture_category_name = data['product-index']

        # 게시물 식물 종류 수정
        LecturePlant.objects.filter(lecture_id=lecture_id).delete()
        plant_types = data.getlist('plant-type')
        for plant_type in plant_types:
            LecturePlant.objects.create(lecture=lecture, plant_name=plant_type)

        # 현재 강의에서 Date id 찾아오기
        deleteDates = Date.objects.filter(lecture_id=lecture.id).values('id')
        deleteDateList = []
        for deleteDate in deleteDates:
            deleteDateList.append(deleteDate['id'])

        # 현재 강의에서 날짜를 통해 시간 찾아와서 삭제해주기
        deleteTime = Time.objects.filter(date_id__in=deleteDateList).delete()

        # 현재 강의에서 날짜를 찾아 해당 날짜들 삭제해주기
        realDeleteDate = Date.objects.filter(lecture_id=lecture.id).delete()

        # kit 수정
        diy_name_inputs = request.POST.getlist('diy-name-input')
        diy_content_inputs = request.POST.getlist('diy-content-input')

        kits = Kit.objects.filter(lecture_id=lecture.id)

        for i, kit in enumerate(kits):
            if i < len(diy_name_inputs):
                kit.kit_name = diy_name_inputs[i]
            if i < len(diy_content_inputs):
                kit.kit_content = diy_content_inputs[i]
            kit.save(update_fields=['kit_name', 'kit_content'])

        # # 날짜 정보 수정
        start_date_input = data.get('start-date-input')
        end_date_input = data.get('end-date-input')
        weekday_type = data.getlist('weekday-type')

        # 날짜 범위 및 요일 유형을 기반으로 날짜 리스트 가져오기
        dates = date_range_with_weekdays(start_date_input, end_date_input, weekday_type)

        # # 삭제할 강의를 찾고 그 시간을 없애주면 됨

        # 강의 시간(시작 시간, 종료 시간, 강의 시간)
        start_time = data.get('start-time-input')
        end_time = data.get('end-time-input')
        interval = data.get('time-type')

        # 시간대를 나누고 남은 시간을 추가하여 출력
        time_intervals = divide_time_intervals(start_time, end_time, interval)

        times = []
        # 계산된 시간대를 출력
        for interval in time_intervals:
            times.append(f"{interval[0]}~{interval[1]}")

        # 날짜 및 시간 데이터 생성
        for date in dates:
            lecture_date = Date.objects.create(lecture=lecture, date=date)
            for time in times:
                Time.objects.create(date=lecture_date, time=time)

        # 게시물 가격 수정
        lecture.lecture_price = data['price-input']
        # 게시물 인원 수정
        lecture.lecture_headcount = data['number-input']
        # 게시물 제목 수정
        lecture.lecture_title = data['title-input']
        # 게시물 내용 수정
        lecture.lecture_content = data['content-text-area']

        # 게시물 및 카테고리 정보 저장
        lecture.save(update_fields=['lecture_price', 'lecture_headcount', 'lecture_title', 'lecture_content'])
        lecture_category.save(update_fields=['lecture_category_name'])

        return redirect(f'/lecture/detail/online?id={lecture.id}')


class LectureUpdateOfflineView(View):
    def get(self, request):
        lecture = Lecture.objects.get(id=request.GET['id'])
        address = LectureAddress.objects.get(lecture_id=lecture.id)
        # print(address)

        context = {
            'lecture': lecture,
            'address': address,
        }
        # print(lecture)

        return render(request, "lecture/web/lecture-update-offline.html", context)

    @transaction.atomic
    def post(self, request):
        data = request.POST
        lecture_id = data['id']

        # 수정할 게시물 가져오기
        lecture = Lecture.objects.get(id=lecture_id)

        # # 게시물 중 카테고리 아이디 찾아오기
        lecture_category_number = Lecture.objects.get(id=lecture_id).lecture_category_id

        # 게시물 강의 구분 수정
        lecture_category = LectureCategory.objects.get(id=lecture_category_number)
        lecture_category.lecture_category_name = data['product-index']

        lecture_address = LectureAddress.objects.get(lecture_id=lecture.id)
        lecture_address.address_city = data['product-index-local']
        lecture_address.address_district = data['product-index-control']

        lecture_address.save(update_fields=['address_city', 'address_district'])

        # 게시물 식물 종류 수정
        LecturePlant.objects.filter(lecture_id=lecture_id).delete()
        plant_types = data.getlist('plant-type')
        for plant_type in plant_types:
            LecturePlant.objects.create(lecture=lecture, plant_name=plant_type)

        # 현재 강의에서 Date id 찾아오기
        deleteDates = Date.objects.filter(lecture_id=lecture.id).values('id')
        deleteDateList = []
        for deleteDate in deleteDates:
            deleteDateList.append(deleteDate['id'])

        # 현재 강의에서 날짜를 통해 시간 찾아와서 삭제해주기
        deleteTime = Time.objects.filter(date_id__in=deleteDateList).delete()

        # 현재 강의에서 날짜를 찾아 해당 날짜들 삭제해주기
        realDeleteDate = Date.objects.filter(lecture_id=lecture.id).delete()

        # # 날짜 정보 수정
        start_date_input = data.get('start-date-input')
        end_date_input = data.get('end-date-input')
        weekday_type = data.getlist('weekday-type')

        # 날짜 범위 및 요일 유형을 기반으로 날짜 리스트 가져오기
        dates = date_range_with_weekdays(start_date_input, end_date_input, weekday_type)

        # # 삭제할 강의를 찾고 그 시간을 없애주면 됨

        # 강의 시간(시작 시간, 종료 시간, 강의 시간)
        start_time = data.get('start-time-input')
        end_time = data.get('end-time-input')
        interval = data.get('time-type')

        # 시간대를 나누고 남은 시간을 추가하여 출력
        time_intervals = divide_time_intervals(start_time, end_time, interval)

        times = []
        # 계산된 시간대를 출력
        for interval in time_intervals:
            times.append(f"{interval[0]}~{interval[1]}")

        # 날짜 및 시간 데이터 생성
        for date in dates:
            lecture_date = Date.objects.create(lecture=lecture, date=date)
            for time in times:
                Time.objects.create(date=lecture_date, time=time)

        # 게시물 가격 수정
        lecture.lecture_price = data['price-input']
        # 게시물 인원 수정
        lecture.lecture_headcount = data['number-input']
        # 게시물 제목 수정
        lecture.lecture_title = data['title-input']
        # 게시물 내용 수정
        lecture.lecture_content = data['content-text-area']

        # 게시물 및 카테고리 정보 저장
        lecture.save(update_fields=['lecture_price', 'lecture_headcount', 'lecture_title', 'lecture_content'])
        lecture_category.save(update_fields=['lecture_category_name'])

        return redirect(f'/lecture/detail/offline?id={lecture.id}')


class LectureDeleteView(View):
    def get(self, request):
        Lecture.objects.filter(id=request.GET['id']).update(lecture_status=True)

        return redirect('/lecture/total')

class LectureReportView(View):
    @transaction.atomic
    def post(self, request):
        # 현재 로그인한 사용자 가져오기 --> 현재 로그인한 사용자가 그 게시물을 보고 있을 것이고 신고를 한다면 그 사용자가 할 것이기 때문
        member = request.session['member']

        # 현재 로그인한 사용자가 보고 있는 게시물 가져오기
        lecture = Lecture.objects.get(id=request.POST['lecture-id'])

        # 화면에서 사용자가 클릭한 신고 사유 가져오기
        report = request.POST['declaration']

        # 신고 생성
        LectureReport.object.create(report_content=report, member_id=member['id'], report_status=True, lecture=lecture)

        return redirect('/lecture/main')