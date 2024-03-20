from django.utils import timezone

from django.db import transaction
from django.db.models import F, Count, Q
from django.shortcuts import render, redirect
from django.utils.datastructures import MultiValueDictKeyError
from django.views import View
from rest_framework.response import Response
from rest_framework.views import APIView

from member.models import Member, MemberProfile, MemberAddress
from plant.models import Plant
from report.models import TradeReport
from trade.models import TradeCategory, Trade, TradeFile, TradePlant, TradeScrap


class TradeDetailView(View):
    def get(self, request):
        member = request.session['member']
        trade_id = request.GET.get('id')
        # upload 페이지에서 사용자가 올린 거래 게시물이 detail 화면에서 보여줘야 하기 때문에 trade 가져옴
        # 방금 올린 거래 게시물
        trade = Trade.objects.filter(id=trade_id).values('id', 'trade_title', 'trade_price', 'trade_content', 'member__member_name', 'kakao_talk_url', 'member_id', 'trade_category__category_name').first()

        trade_scrap = TradeScrap.objects.filter(trade_id=trade['id'], member_id=member['id']).values('status').first()
        trade['trade_scrap'] = trade_scrap['status'] if trade_scrap and 'status' in trade_scrap else False

        # 방금 올린 거래 게시물을 작성한 사용자 찾기
        member_search_trade = Trade.objects.filter(id=trade_id).values('member_id').first()
        # 방금 거래 게시물을 올린 사용자가 작성한 다른 거래 게시물들
        trades = Trade.objects.filter(member=member_search_trade['member_id'], status=True)\
            .values('id', 'trade_title', 'trade_price', 'trade_content', 'member__member_name', 'member_id')

        for td in trades:
            trade_scrap = TradeScrap.objects.filter(trade_id=td['id'], member_id=member['id']).values('status').first()
            td['trade_scrap'] = trade_scrap['status'] if trade_scrap and 'status' in trade_scrap else False
            product_img = TradeFile.objects.filter(trade_id=td['id']).values('file_url').first()
            td['product_img'] = product_img['file_url']
            product_plants = TradePlant.objects.filter(trade_id=td['id']).values('plant_name')
            product_plants_list = list(product_plants)
            product_list = [item['plant_name'] for item in product_plants_list]
            td['plant_name'] = product_list

        # 방금 거래 게시물을 올린 사용자가 작성한 다른 거래 게시물들의 개수를 구함
        user_trade_count = trades.count()
        context = {
            'trade': trade,
            'trade_files': list(TradeFile.objects.filter(trade_id=trade_id).values('file_url')),
            'trade_file': list(TradeFile.objects.filter(trade_id=trade_id).values('file_url'))[0],
            'trades': trades,
            'user_trade_count': user_trade_count,
        }

        return render(request, "trade/web/trade-detail.html", context)

class TradeReportView(View):
    @transaction.atomic
    def post(self, request):
        # 현재 로그인한 사용자 가져오기 --> 현재 로그인한 사용자가 그 게시물을 보고 있을 것이고 신고를 한다면 그 사용자가 할 것이기 때문
        member = request.session['member']

        # 현재 로그인한 사용자가 보고 있는 게시물 가져오기
        trade = Trade.objects.get(id=request.POST['trade-id'])

        # 화면에서 사용자가 클릭한 신고 사유 가져오기
        report = request.POST['declaration']

        # 신고 생성
        TradeReport.object1.create(report_content=report, member_id=member['id'], report_status=True, trade=trade)

        return redirect('/trade/main')

class TradeDetailApi(APIView):
    def get(self, request, trade_id):
        member = request.session['member']

        # 거래 게시물의 스크랩을 누른 사람 구하기
        # 스크랩이 눌린것 중 해당 게시글의 개수를 구해주면 됨
        trade_count = TradeScrap.objects.filter(status=True, trade_id=trade_id).count()
        return Response(trade_count)

class TradeUpdateView(View):
    def get(self, request):
        trade = Trade.objects.get(id=request.GET['id'])
        trade_files = TradeFile.objects.filter(trade=trade)
        context = {
            'trade': trade,
            'trade_files': list(trade_files)
        }
        return render(request, "trade/web/trade-update.html", context=context)

    @transaction.atomic
    def post(self, request):
        data = request.POST
        files = request.FILES

        trade_id = data['id']

        # 지금 시간
        time_now = timezone.now()

        # 수정할 거래 게시물 가져오기
        trade = Trade.objects.get(id=trade_id)

        # # 게시물중 카테고리 아이디 찾아오기
        # trade_category_number = Trade.objects.filter(id=trade_id).values('trade_category_id')
        trade_category_number = Trade.objects.get(id=trade_id).trade_category_id

        # 게시물 상품 구분 수정
        trade_category = TradeCategory.objects.get(id=trade_category_number)
        trade_category.category_name = data['product-index']
        
        # 게시물 상품 구분의 업데이트 날짜를 현재로 변경
        trade_category.updated_date = timezone.now()

        # 게시물 식물 종류 수정
        trade_plants = TradePlant.objects.filter(trade_id=trade_id).delete()
        plant_types = data.getlist('plant-type')
        for plant_type in plant_types:
            TradePlant.objects.create(trade=trade, plant_name=plant_type)

        # 게시물 가격 수정
        trade.trade_price = data['price-input']

        # 게시물 오픈채팅방 링크 수정
        trade.kakao_talk_url = data['chatting-input']

        # 게시물 제목 수정
        trade.trade_title = data['title-input']

        # 게시물 내용 수정
        trade.trade_content = data['content-input']

        # 게시물의 업데이트 날짜를 현재로 변경
        trade.updated_date = timezone.now()

        # 사진 파일 업데이트
        TradeFile.objects.filter(trade_id=trade_id).delete()
        for key in files:
            TradeFile.objects.create(trade=trade, file_url=files[key])

        # 게시물 update
        trade.save(update_fields=['trade_price', 'kakao_talk_url', 'trade_title', 'trade_content'])

        # 카테고리 update
        trade_category.save(update_fields=['category_name'])

        return redirect(f'/trade/detail/?id={trade.id}')


class TradeDeleteView(View):
    def get(self, request):
        Trade.objects.filter(id=request.GET['id']).update(status=False)

        return redirect('/trade/total')

class TradeMainApi(APIView):
    def get(self, request, page):

        member = request.session['member']
        row_count = 8
        offset = (page - 1) * row_count
        limit = row_count * page

        # 로그인한 사용자의 주소를 찾아오기( 주변 상품을 뿌려줄 때 사용해야 하기 때문 )
        member_home = MemberAddress.objects.filter(member_id=member['id']).values('address_city', 'address_district').first()

        # member_address 테이블에서 현재 로그인한 사용자와 같은 주소에 사는 사람들을 먼저 찾기
        local_persons = MemberAddress.objects.filter(address_city=member_home['address_city'],
                                                     address_district=member_home['address_district']).values('member_id')

        # 위의 local_persons가 현재 로그인한 사용자와 같은 지역에 사는 사람들임(자기 포함)
        # 이제 이걸 가지고 local_persons가 쓴 거래 게시물을 찾아서 뿌려주면 끝!
        local_person_list = []
        for local_person in local_persons:
            local_person_list.append(local_person['member_id'])

        trades = Trade.objects.filter(status=True, member_id__in=local_person_list).annotate(
            member_name=F('member__member_name')) \
            .values('trade_title', 'trade_price', 'member_name', 'id', 'member_id')

        for trade in trades:
            trade_file = TradeFile.objects.filter(trade_id=trade['id']).values('file_url').first()
            profile = MemberProfile.objects.filter(member_id=trade['member_id']).values('file_url').first()
            trade['trade_file'] = trade_file['file_url']
            trade['profile'] = profile['file_url']
            trade_scrap = TradeScrap.objects.filter(trade_id=trade['id'], member_id=member['id']).values('status').first()
            trade['trade_scrap'] = trade_scrap['status'] if trade_scrap and 'status' in trade_scrap else False

            product_plants = TradePlant.objects.filter(trade_id=trade['id']).values('plant_name')
            product_plants_list = list(product_plants)

            product_list = [item['plant_name'] for item in product_plants_list]
            trade['plant_name'] = product_list

        return Response(trades[offset:limit])

class TradeMainView(View):
    def get(self, request):

        # 현재 로그인한 사용자 정보 가져오기
        member = request.session['member']

        # 로그인한 사용자의 주소를 찾아오기( 주변 상품을 뿌려줄 때 사용해야 하기 때문 )
        member_home = MemberAddress.objects.filter(member_id=member['id']).values('address_city',
                                                                                  'address_district').first()

        # member_address 테이블에서 현재 로그인한 사용자와 같은 주소에 사는 사람들을 먼저 찾기
        # local_persons = MemberAddress.objects.filter(address_city=member_home['address_city'],
        #                                              address_district=member_home['address_district']).values('member_id')
        #
        # # 위의 local_persons가 현재 로그인한 사용자와 같은 지역에 사는 사람들임(자기 포함)
        # # 이제 이걸 가지고 local_persons가 쓴 거래 게시물을 찾아서 뿌려주면 끝!
        # local_person_list = []
        # for local_person in local_persons:
        #     local_person_list.append(local_person['member_id'])
        #
        # trades = Trade.objects.filter(status=True, member_id__in=local_person_list).annotate(
        #     member_name=F('member__member_name')) \
        #     .values('trade_title', 'trade_price', 'member_name', 'id', 'member_id')
        #
        # for trade in trades:
        #     trade_file = TradeFile.objects.filter(trade_id=trade['id']).values('file_url').first()
        #     profile = MemberProfile.objects.filter(member_id=trade['member_id']).values('file_url').first()
        #     trade['trade_file'] = trade_file['file_url']
        #     trade['profile'] = profile['file_url']
        #     # trade_scrap = TradeScrap.objects.filter(trade_id=trade['id'], member_id=member['id']).values(
        #     #     'status').first()
        #     # trade['trade_scrap'] = trade_scrap['status'] if trade_scrap and 'status' in trade_scrap else False
        #
        #     product_plants = TradePlant.objects.filter(trade_id=trade['id']).values('plant_name')
        #     product_plants_list = list(product_plants)
        #
        #     product_list = [item['plant_name'] for item in product_plants_list]
        #     trade['plant_name'] = product_list

        context = {
            # 'trades': trades,
            'member_home': member_home,
        }

        return render(request, "trade/web/trade-main.html", context)


class TradeTotalView(View):
    def get(self, request):
        return render(request, "trade/web/trade-total.html")


class TradeTotalApi(APIView):
    def get(self, request, page, sorting, filters, type):

        member = request.session['member']
        row_count = 8
        offset = (page - 1) * row_count
        limit = row_count * page

        condition = Q()
        condition2 = Q()
        sort1 = '-id'
        sort2 = '-id'

        if type == '상품':
            condition2 |= Q(trade_category__category_name__contains='상품')
        elif type == '식물':
            condition2 |= Q(trade_category__category_name__contains='식물')
        elif type == '수공예품':
            condition2 |= Q(trade_category__category_name__contains='수공예품')
        elif type == '테라리움':
            condition2 |= Q(trade_category__category_name__contains='테라리움')
        elif type == '기타':
            condition2 |= Q(trade_category__category_name__contains='기타')
        elif type == '전체':
            condition2 |= Q()

        filters = filters.split(',')

        for filter in filters:
            if filter.replace(',', '') == '관엽식물':
                condition |= Q(tradeplant__plant_name__contains='관엽식물')

            elif filter.replace(',', '') == '침엽식물':
                condition |= Q(tradeplant__plant_name__contains='침엽식물')

            elif filter.replace(',', '') == '희귀식물':
                condition |= Q(tradeplant__plant_name__contains='희귀식물')

            elif filter.replace(',', '') == '다육':
                condition |= Q(tradeplant__plant_name__contains='다육')

            elif filter.replace(',', '') == '선인장':
                condition |= Q(tradeplant__plant_name__contains='선인장')

            elif filter.replace(',', '') == '기타':
                condition |= Q(tradeplant__plant_name__contains='기타')

            elif filter.replace(',', '') == '전체':
                condition = Q()

        if sorting == '최신순':
            sort1 = '-id'
            sort2 = '-created_date'

        elif sorting == "스크랩순":
            sort1 = '-scrap_count'
            sort2 = '-id'

        columns = [
            'trade_title',
            'id',
            'member_id',
            'trade_price',
            'scrap_count'
        ]

        # select_related로 조인먼저 해준다음, annotate로 member 조인에서 가져올 values 가져온다음
        # scrap의 갯수를 가상 컬럼으로 추가해서 넣어주고, 진짜 사용할 밸류들 가져온 후, distinct로 중복 제거
        # trades = Trade.objects.select_related('tradescrap').filter(condition, condition2, status=1) \
        #     .annotate(member_name=F('member__member_name')) \
        #     .values(*columns) \
        #     .annotate(scrap_count=Count(Q(tradescrap__status=1))) \
        #     .values('trade_title', 'member_name', 'id', 'member_id', 'scrap_count', 'trade_price') \
        #     .order_by(sort1, sort2).distinct()

        # print(*list(trades), sep="\n")

        trades = Trade.objects.filter(condition, condition2, status=1)\
            .annotate(scrap_count=Count('tradescrap__id', filter=Q(tradescrap__status=1))).values(*columns)\
            .order_by(sort1, sort2)[offset:limit]
        for trade in trades:
            member_name = Member.objects.filter(id=trade['member_id']).values('member_name').first().get('member_name')
            trade['member_name'] = member_name



        # test = Trade.objects.filter(tradescrap__status=1).values('tradescrap__status').order_by('-tradescrap__status')
        # print(test)
        for trade in trades:
            trade_file = TradeFile.objects.filter(trade_id=trade['id']).values('file_url').first()
            profile = MemberProfile.objects.filter(member_id=trade['member_id']).values('file_url').first()
            trade['trade_file'] = trade_file['file_url']
            trade['profile'] = profile['file_url']
            trade_scrap = TradeScrap.objects.filter(trade_id=trade['id'], member_id=member['id']).values(
                'status').first()
            trade['trade_scrap'] = trade_scrap['status'] if trade_scrap and 'status' in trade_scrap else False

            product_plants = TradePlant.objects.filter(trade_id=trade['id']).values('plant_name')
            product_plants_list = list(product_plants)

            product_list = [item['plant_name'] for item in product_plants_list]
            trade['plant_name'] = product_list


        return Response(trades)


class TradeUploadView(View):
    def get(self, request):
        member = request.session['member']
        return render(request, "trade/web/trade-upload.html")

    @transaction.atomic
    def post(self, request):
        trade_data = request.POST
        files = request.FILES

        # 현재 로그인한 사용자
        member = request.session['member']

        # 상품 구분
        # trade_data['product-index']

        # 식물 종류
        # trade_data.getlist('plant-type')

        # 가격
        # trade_data['price-input']

        # 오픈 채팅방 링크
        # trade_data['chatting-input']

        # 거래 게시글 제목
        # trade_data['title-input']

        # 거래 게시글 내용
        # trade_data['content-input']

        # Trade create
        data = {
            'trade_price': trade_data['price-input'],
            'trade_title': trade_data['title-input'],
            'trade_content': trade_data['content-input'],
            'member': Member.objects.get(id=member['id']),
            'trade_category': TradeCategory.objects.create(category_name=trade_data['product-index']),
            'kakao_talk_url': trade_data['chatting-input'],
        }

        trade = Trade.objects.create(**data)

        # TradeFile create
        for key in files:
            TradeFile.objects.create(trade=trade, file_url=files[key])

        # TradePlant create
        plant_types = trade_data.getlist('plant-type')
        for plant_type in plant_types:
            TradePlant.objects.create(trade=trade, plant_name=plant_type)

        return redirect(f'/trade/detail/?id={trade.id}')