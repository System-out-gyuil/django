from rest_framework import serializers

from trade.models import Trade


class TradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trade
        fields = '__all__'
