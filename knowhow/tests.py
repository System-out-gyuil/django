import random

from django.db.models import F, Count, Q
from django.test import TestCase

from knowhow.models import Knowhow, KnowhowFile, KnowhowRecommend, KnowhowTag
from member.models import Member
from post.models import PostTag


class KnowhowTest(TestCase):
    KnowhowFile.objects.filter(knowhow_id=32).delete()

    # columns = [
    #     'knowhow_title',
    #     'member_name',
    #     'knowhow_count',
    #     'id',
    #     'member_id'
    # ]
    # knowhows = Knowhow.objects.select_related('knowhowlike').filter() \
    #       .annotate(member_name=F('member__member_name')) \
    #       .values(*columns) \
    #       .annotate(like_count=Count('knowhowlike')) \
    #       .values('knowhow_title', 'member_name', 'knowhow_count', 'id', 'member_id', 'like_count').order_by(
    #     '-like_count', '-id').distinct()
    #
    # for knowhow in knowhows:
    #     print(knowhow['id'], knowhow['like_count'], sep=", ")

    # member_queryset = Member.objects.all()
    # for i in range(20):
    #     knowhow_data = {
    #         'knowhow_title': f'노하우 제목{i}',
    #         'knowhow_content': f'노하우 내용{i}',
    #         'member': member_queryset[random.randint(0, len(member_queryset) - 1)],
    #     }
    #     knowhow = Knowhow.objects.create(**knowhow_data)
    #
    #     for j in range(5):
    #         knowhow_file_data = {
    #             'knowhow': knowhow,
    #             'file_url': 'https://imagedelivery.net/4aEUbX05h6IovGOQjgkfSw/f3d07f4d-3eed-4101-f641-6651699ef400/public'
    #         }
    #         KnowhowFile.objects.create(**knowhow_file_data)
    #
    #     for j in range(5):
    #         knowhow_recommend = {
    #             'recommend_url': f'https://qweqwe.com/qweqe{j}',
    #             'recommend_content': f'식물키우기 좋은 장비{j}',
    #             'knowhow': knowhow,
    #         }
    #         KnowhowRecommend.objects.create(**knowhow_recommend)
    #
    #     for j in range(5):
    #         knowhow_tag = {
    #             'tag_name': f'노하우를 공유합니다.{j}',
    #             'knowhow': knowhow,
    #         }
    #         KnowhowTag.objects.create(**knowhow_tag)

    keyword = ''
    page = 1
    row_count = 10

    offset = (page - 1) * row_count
    limit = page * row_count

    condition = Q()

    if keyword:
        condition |= Q(tag_name__icontains=keyword)

    post_tags = PostTag.objects.filter(condition).values('tag_name').distinct().order_by('tag_name')
    print(post_tags)
