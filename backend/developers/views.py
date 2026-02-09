from rest_framework import viewsets, permissions
from .models import APIKey, Webhook
from .serializers import APIKeySerializer, WebhookSerializer


class APIKeyViewSet(viewsets.ModelViewSet):
    queryset = APIKey.objects.all()
    serializer_class = APIKeySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class WebhookViewSet(viewsets.ModelViewSet):
    queryset = Webhook.objects.all()
    serializer_class = WebhookSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
