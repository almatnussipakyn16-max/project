from rest_framework import serializers
from .models import InventoryItem


class InventoryItemSerializer(serializers.ModelSerializer):
    is_low_stock = serializers.ReadOnlyField()
    
    class Meta:
        model = InventoryItem
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
