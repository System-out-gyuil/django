from knowhow.models import Knowhow
from rest_framework import serializers


class KnowhowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Knowhow
        fields = '__all__'
