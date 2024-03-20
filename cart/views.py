from django.db import transaction
from django.utils import timezone

from django.db.models import F
from django.shortcuts import render, redirect
from django.views import View
from rest_framework.response import Response

from rest_framework.views import APIView

from apply.models import Apply
from cart.models import Cart, CartDetail
from lecture.models import Lecture
from member.models import MemberProfile


# 장바구니 서비스
class CartView(View):
    # 카트 생성 확인 완료
    def get(self, request):
        member = request.session['member']
        member_file = request.session['member_files']
        member_id = member.get('id')  # 멤버id 추출
        my_cart = Cart.objects.filter(member_id=member_id, cart_status=0)
        print(member_file[0]['file_url'])

        if not my_cart:
            # 장바구니가 없는 경우 새로운 장바구니 생성
            my_cart = Cart.objects.create(member_id=member_id)
        else:
            my_cart = my_cart.first()

        cart_id = my_cart.id
        context= {
            'cart_id':cart_id,
            'memberProfile':member_file[0]['file_url'],
            'member':member
        }



        return render(request, 'cart/cart.html', context)


class CartListAPI(APIView):
    # lecture detail 페이지에서 버튼을 누르면 정보입력
    def get(self, request, cart_id):
        print('api')
        details = []
        applies = Apply.objects.filter(member_id = request.session['member']['id'], apply_status=-3)
        for apply in applies:

            items = CartDetail.objects.filter(cart_id=cart_id,cart_detail_status=0, apply=apply)\
            .annotate(lecture_price=F('apply__lecture__lecture_price')
                      ,lecture_title=F('apply__lecture__lecture_title')
                      ,teacher_name=F('apply__lecture__teacher__member__member_name')
                      ,quantity=F('apply__quantity')
                      ,date=F('apply__date')
                      ,time=F('apply__time')
                      ,kit=F('apply__kit')
                      ,lecture_id = F('apply__lecture__id')
                      )\
            .values('id','quantity', 'lecture_title','date','kit','time','teacher_name','lecture_price','lecture_id')

            for detail in details:
                detail_file = Lecture.objects.filter(id = detail['lecture_id']).values('lectureplacefile__file_url').first()
                detail['lecture_file']= detail_file['lectureplacefile__file_url']

            if not items:  # items가 비어있는 경우 처리
                continue

            details.append(*items)

        return Response(details)



class CartAPI(APIView):
    def delete(self,request,detail_id):
        detail = CartDetail.objects.filter(id=detail_id).first()
        detail.cart_detail_status = -1
        detail.updated_date = timezone.now()
        detail.save(update_fields=['cart_detail_status','updated_date'])
        apply = Apply.objects.filter(id = detail['apply_id'])
        apply.apply_status = -1
        apply.updated_date = timezone.now()
        apply.save(update_fields=['apply_status','updated_date'])

        return Response('success')

    def get(self,request,detail_id):
        details = CartDetail.objects.filter(id=detail_id)\
            .annotate(lecture_title=F('apply__lecture__lecture_title')
                      ,lecture_price=F('apply__lecture__lecture_price')
                      ,quantity=F('apply__quantity'))\
            .values('lecture_title','lecture_price','quantity','id')

        return Response(details)

class CartCheckoutAPI(APIView):
    @transaction.atomic
    def post(self, request, cart_id):
        member_id = request.session['member']['id']
        cart = Cart.objects.filter(member_id=member_id, cart_status=0).first()
        cart_details = CartDetail.objects.filter(cart_detail_status= 0, cart_id=cart.id)
        for detail in cart_details:
            detail.cart_detail_status = 1
            detail.updated_date = timezone.now()
            detail.save(update_fields=['cart_detail_status','updated_date'])


        return redirect(f'/order/cart/order/{cart.id}')