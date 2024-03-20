from django.db import models

from member.models import Member
from selleaf.period import Period


class Alarm(Period):
    sender = models.ForeignKey(Member, on_delete=models.PROTECT, null=False, related_name='sender')
    receiver = models.ForeignKey(Member, on_delete=models.PROTECT, null=False, related_name='receiver', blank=False)
    # 확인 True 미확인 False
    alarm_status = models.BooleanField(null=False, default=False)
    # 1. ApplyAlarm
    # 2. KnowhowLikeAlarm
    # 3. KnowhowReplyAlarm
    # 4. PostLikeAlarm
    # 5. PostReplyAlarm
    # 6. ReviewAlarm
    alarm_category = models.IntegerField(null=False, blank=False)
    target_id = models.IntegerField(null=False, blank=False)

    class Meta:
        db_table = 'tbl_alarm'
        ordering = ['-id']
