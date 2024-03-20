from django.db import models

from member.models import Member
from plant.models import Plant
from selleaf.file import File
from selleaf.models import Like, Scrap, Tag
from selleaf.period import Period


class Post(Period):
    post_title = models.CharField(max_length=50, null=False)
    post_content = models.CharField(max_length=500, null=False)
    post_count = models.IntegerField(default=0, null=False)
    member = models.ForeignKey(Member, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_post'
        ordering = ['-id']


class PostFile(File):
    post = models.ForeignKey(Post, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_post_file'
        ordering = ['-id']


class PostLike(Like):
    post = models.ForeignKey(Post, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_post_like'
        ordering = ['-id']


class PostPlant(Plant):
    post = models.ForeignKey(Post, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_post_plant'


class PostScrap(Scrap):
    post = models.ForeignKey(Post, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_post_scrap'
        ordering = ['-id']


class PostTag(Tag):
    post = models.ForeignKey(Post, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_post_tag'


class PostCategory(Period):
    category_name = models.CharField(max_length=50, null=False)
    post = models.ForeignKey(Post, on_delete=models.PROTECT, null=False)


    class Meta:
        db_table = 'tbl_post_category'


class PostReply(Period):
    post_reply_content = models.CharField(null=False, max_length=50)
    post = models.ForeignKey(Post, on_delete=models.PROTECT, null=False)
    member = models.ForeignKey(Member, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_post_reply'
        ordering = ['-id']


class PostReplyLike(Like):
    post_reply = models.ForeignKey(PostReply, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_post_reply_like'
        ordering = ['-id']
