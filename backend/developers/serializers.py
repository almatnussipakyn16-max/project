from rest_framework import serializers
from .models import APIKey, Webhook


class APIKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = APIKey
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'last_used', 'key']


class WebhookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Webhook
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
