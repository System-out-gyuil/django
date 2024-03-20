import random

from django.test import TestCase

from member.models import Member
from post.models import Post, PostFile


class PostTest(TestCase):
    member_queryset = Member.objects.all()
    for i in range(20):
        post_data = {
            'post_title': f'게시물 제목{i}',
            'post_content': f'게시물 내용{i}',
            'member': member_queryset[random.randint(0, len(member_queryset) - 1)],
        }
        post = Post.objects.create(**post_data)

        # PostFile 생성
        post_file_data = {
            'post': post,
            'file_url': 'https://imagedelivery.net/4aEUbX05h6IovGOQjgkfSw/88ed654b-a983-4019-dff7-921f0c15d700/public'
        }
        PostFile.objects.create(**post_file_data)

