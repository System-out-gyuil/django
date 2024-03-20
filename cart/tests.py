import random

from django.test import TestCase

from cart.models import Cart, CartDetail
from lecture.models import Lecture, Kit
from member.models import Member


class CartTest(TestCase):
    member = Member.objects.get(id = 7)
    lecture = Lecture.objects.get(id =17)

    # Cart.objects.create(member = member)

    data = {
        'quantity': 5,
        'cart': Cart.objects.filter(member=member,cart_status=0).first(),
        'lecture': lecture,
        'date': lecture.date,
        'time': lecture.time,
        'kit': Kit.objects.filter(lecture=lecture).first()
    }

    CartDetail.objects.create(**data)


    #
    # cart_list = []
    # for i in range(50):
    #     cart_data = {
    #         'lecture_price': random.randint(100000, 500000),
    #         'lecture_headcount': i,
    #         'lecture_title': f'강의 제목{i}',
    #         'lecture_content': f'강의 내용{i}',
    #         'cart_status': random.randint(-2, 1),
    #         'member': member_queryset[random.randint(0, len(member_queryset) - 1)],
    #     }
    #     cart_list.append(Cart(**cart_data))
    # CartDetail.objects.create(cart_list)
    #
    #
    # member_queryset = Member.objects.all()
