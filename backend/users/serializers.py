from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone', 'role', 'avatar', 
                  'is_staff', 'is_active', 'date_joined', 'created_at']
        read_only_fields = ['id', 'date_joined', 'created_at']
        ref_name = 'CustomUser'
