from django.db import models

from qna.managers import QnAManager
from selleaf.period import Period


class QnA(Period):
    qna_title = models.CharField(max_length=255, null=False, blank=False)
    qna_content = models.CharField(max_length=255, null=False, blank=False)
    # QnA 게시 상태 - 게시 중(1), 삭제됨(0)
    qna_status = models.BooleanField(null=False, blank=False, default=True)
    # Managers
    objects = models.Manager()
    enabled_objects = QnAManager()

    class Meta:
        db_table = 'tbl_qna'
        ordering = ['-id']
