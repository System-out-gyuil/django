from django.shortcuts import render
from django.views import View

from apply.models import Apply
from cart.models import CartDetail
from lecture.models import Lecture, LectureProductFile
from member.models import Member, MemberAddress
from order.models import Order, OrderMileage


class OrderView(View):
    # 카트 생성 확인 완료
    def get(self, request):

        apply_data = request.GET

        # 세션에 담겨있는 로그인 된 사용자 가져옴
        member = request.session['member']
        member = Member.objects.get(id=member['id'])

        # 현재 로그인된 사용자의 주소를 알아오기
        member_address = MemberAddress.objects.get(member_id=member.id)

        # 현재 로그인된
        apply = Apply.objects.get(id=request.GET['id'])
        # 강의
        lecture = Lecture.objects.get(id=apply.lecture_id)
        teacher_name = lecture.teacher.member.member_name

        mileages = OrderMileage.objects.filter(member_id=member.id).values('mileage', 'mileage_status')

        total = 0
        for mileage in mileages:
            if mileage['mileage_status'] == 1:
                total += mileage['mileage']
            elif mileage['mileage_status'] == 0:
                total -= mileage['mileage']

        context = {

            'member': member,
            'lecture': lecture,
            'apply': apply,
            'member_address': member_address,
            'teacher_name': teacher_name,
            'lecture_file': list(LectureProductFile.objects.filter(lecture_id=lecture.id).values('file_url'))[0],
            'total': total,
            # 'date': apply_data['date-input'],
            # 'time': apply_data['time-input'],
            # 'kit': apply_data['kit-input'],
            # 'member_id': member['member_id'],
            # 'lecture_id': lecture,
        }


        return render(request, 'payment/payment.html', context)

    def post(self, request):
        order_data = request.POST
        sender_name = order_data['order-name']
        main_number = order_data['order-phone']
        sub_number = order_data['phone-number']

class OrderCartView(View):
    def get(self, request, cart_id):

        # 세션에 담겨있는 로그인 된 사용자 가져옴
        member = request.session['member']
        member = Member.objects.get(id=member['id'])

        # 현재 로그인된 사용자의 주소를 알아오기
        member_address = MemberAddress.objects.get(member_id=member.id)

        cart_detail = CartDetail.objects.filter(cart_id = cart_id, cart_detail_status= 1)
        print(cart_detail)
        # 강의

        mileages = OrderMileage.objects.filter(member_id=member.id).values('mileage', 'mileage_status')

        print(mileages)
        total = 0
        for mileage in mileages:
            if mileage['mileage_status'] == 1:
                total += mileage['mileage']
            elif mileage['mileage_status'] == 0:
                total -= mileage['mileage']

        context = {

            'member': member,
            'member_address': member_address,
            'total': total,
            'cart':cart_id

        }

        return render(request, 'payment/payment.html', context)
