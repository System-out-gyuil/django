from django.db import models

from selleaf.address import Address
from selleaf.file import File
from selleaf.period import Period


class Member(Period):
    member_email = models.CharField(max_length=255, null=False, blank=False)
    member_name = models.CharField(max_length=255, null=False, blank=False)
    member_type = models.TextField(blank=False, default="selleaf")
    # True: 휴면, False: 비휴면
    member_status = models.BooleanField(default=False)
    # True: 수신 동의, False: 수진 비동의
    marketing_agree = models.BooleanField(default=False)
    # True: 강사, False: 일반 회원
    sms_agree = models.BooleanField(default=False)
    # True: 관리자, False: 일반 회원
    admin_type = models.BooleanField(default=False)

    class Meta:
        db_table = 'tbl_member'
        ordering = ['-id']


class MemberAddress(Address):
    address_name = models.CharField(max_length=255, null=False, blank=False, default='가입 주소')
    member = models.ForeignKey(Member, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_member_address'


class MemberProfile(File):
    member = models.ForeignKey(Member, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_member_profile'
        ordering = ['-id']
