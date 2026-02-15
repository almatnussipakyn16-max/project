from rest_framework import serializers
from .models import Ticket
from users.serializers import UserSerializer


class TicketSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    
    class Meta:
        model = Ticket
        fields = [
            'id', 'ticket_number', 'user', 'subject', 'category',  # ✅ Добавил category
            'priority', 'status', 'description', 'created_at', 
            'updated_at', 'assigned_to', 'resolved_at'
        ]
        read_only_fields = ['id', 'ticket_number', 'user', 'status', 'created_at', 'updated_at']


class TicketCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ['subject', 'category', 'priority', 'description']  # ✅ category есть