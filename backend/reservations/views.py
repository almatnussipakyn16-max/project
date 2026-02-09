from rest_framework import viewsets, permissions
from .models import Table, Reservation
from .serializers import TableSerializer, ReservationSerializer


class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all()
    serializer_class = TableSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
