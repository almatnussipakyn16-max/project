from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Ticket
from .serializers import TicketSerializer, TicketCreateSerializer


class TicketViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return TicketCreateSerializer
        return TicketSerializer
    
    def get_queryset(self):
        # Пользователи видят только свои тикеты
        user = self.request.user
        if user.role in ['ADMIN', 'STAFF']:
            return Ticket.objects.all()
        return Ticket.objects.filter(user=user)
    
    def perform_create(self, serializer):
        # ✅ Автоматически устанавливаем user из request
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        ticket = self.get_object()
        message = request.data.get('message')
        
        if not message:
            return Response(
                {'error': 'Message is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Добавьте логику для комментариев если есть модель Comment
        # Comment.objects.create(ticket=ticket, user=request.user, message=message)
        
        return Response({'status': 'Comment added'})