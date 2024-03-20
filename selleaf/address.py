from selleaf.period import Period
from django.db import models


class Address(Period):
    address_zipcode = models.CharField(max_length=60, null=True, blank=False)
    address_city = models.CharField(max_length=255, null=False, blank=False)
    address_district = models.CharField(max_length=255, null=False, blank=False)
    address_detail = models.CharField(max_length=255, null=True, blank=False)

    class Meta:
        abstract = True
