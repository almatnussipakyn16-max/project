from rest_framework import serializers
from .models import Table, Reservation


class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'reservation_number']
