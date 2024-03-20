from django.db.models import F, Q
from django.test import TestCase

from knowhow.models import Knowhow
from post.models import Post, PostReplyLike


class AdminTests(TestCase):
    order = 'recent'
    keyword = ''
    page = 1

    row_count = 10

    offset = (page - 1) * row_count
    limit = page * row_count

    condition = Q()

    if keyword:
        condition |= Q(member_name__icontains=keyword)
        condition |= Q(reply_content__icontains=keyword)

    columns = [
        'reply_member_id',
        'reply_member_name',
        'target_title',
        'reply_id',
        'reply_content',
        'reply_created',
    ]

    post_replies = Post.objects.annotate(
        reply_member_id=F('postreply__member_id'),
        reply_member_name=F('postreply__member__member_name'),
        target_title=F('post_title'),
        reply_id=F('postreply__id'),
        reply_content=F('postreply__post_reply_content'),
        reply_created=F('postreply__created_date')
    ).values(*columns).filter(condition, reply_member_id__isnull=False)

    knowhow_replies = Knowhow.objects.annotate(
        reply_member_id=F('knowhowreply__member_id'),
        reply_member_name=F('knowhowreply__member__member_name'),
        target_title=F('knowhow_title'),
        reply_id=F('knowhowreply__id'),
        reply_content=F('knowhowreply__knowhow_reply_content'),
        reply_created=F('knowhowreply__created_date')
    ).values(*columns).filter(condition, reply_member_id__isnull=False)

    for post_reply in post_replies:
        post_reply['target_type'] = '커뮤니티'
    print(post_replies)

    for knowhow_reply in knowhow_replies:
        knowhow_reply['target_type'] = '노하우'
    print(knowhow_replies)
