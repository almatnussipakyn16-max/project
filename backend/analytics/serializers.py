from rest_framework import serializers
from .models import DailySalesReport


class DailySalesReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailySalesReport
        fields = '__all__'
        read_only_fields = ['id', 'created_at']
