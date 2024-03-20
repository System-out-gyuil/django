from django.db import models

# 비휴면 상태의 회원 목록만 가져오기 위한 매니저
# False(0)가 비휴면, True(1)가 휴면 상태
class MemberManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(member_status=False)
