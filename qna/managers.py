from django.db import models


# models 쪽에 enabled_objects를 선언해서 게시 중(1)인 공지사항만 가져오기 위한 매니저
class QnAManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(qna_status=True)