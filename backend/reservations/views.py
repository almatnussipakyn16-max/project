from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from datetime import datetime, timedelta
from django.db.models import Q
from django.utils import timezone
from .models import Table, Reservation
from .serializers import TableSerializer, ReservationSerializer
from .tasks import send_reservation_confirmation


class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all()
    serializer_class = TableSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    @action(detail=False, methods=['post'])
    def check_availability(self, request):
        """Check table availability for given date/time"""
        restaurant_id = request.data.get('restaurant')
        date = request.data.get('date')
        time = request.data.get('time')
        guests = request.data.get('guests')
        
        if not all([restaurant_id, date, time, guests]):
            return Response(
                {'error': 'restaurant, date, time, and guests are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Parse date and time
        reservation_date = datetime.strptime(date, '%Y-%m-%d').date()
        reservation_time = datetime.strptime(time, '%H:%M').time()
        reservation_datetime = datetime.combine(reservation_date, reservation_time)
        
        # Find suitable tables
        suitable_tables = Table.objects.filter(
            restaurant_id=restaurant_id,
            capacity__gte=guests,
            is_available=True
        )
        
        # Check for conflicting reservations (2 hour window)
        # A reservation conflicts if it's within 2 hours before or after our time
        time_window_start_dt = reservation_datetime - timedelta(hours=1)
        time_window_end_dt = reservation_datetime + timedelta(hours=1)
        
        # Get all reservations in the date range that could conflict
        conflicting_reservations = Reservation.objects.filter(
            restaurant_id=restaurant_id,
            status__in=['PENDING', 'CONFIRMED', 'SEATED']
        )
        
        # Filter for reservations that overlap with our time window
        # Reservation overlaps if:
        # (reservation_datetime >= time_window_start) AND (reservation_datetime <= time_window_end)
        conflicts = []
        for res in conflicting_reservations:
            res_datetime = datetime.combine(res.reservation_date, res.reservation_time)
            # Make timezone-aware for proper comparison
            if timezone.is_naive(res_datetime):
                res_datetime = timezone.make_aware(res_datetime)
            
            if time_window_start_dt <= res_datetime <= time_window_end_dt:
                conflicts.append(res.table_id)
        
        available_tables = suitable_tables.exclude(id__in=conflicts)
        
        if available_tables.exists():
            return Response({
                'available': True,
                'message': f'Tables available for {guests} guests',
                'available_tables': available_tables.count()
            })
        else:
            return Response({
                'available': False,
                'message': 'No tables available for this time slot',
                'suggestion': 'Try a different time or fewer guests'
            })
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm a reservation"""
        reservation = self.get_object()
        
        if reservation.status != 'PENDING':
            return Response(
                {'error': 'Can only confirm pending reservations'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reservation.status = 'CONFIRMED'
        reservation.save()
        
        # Send confirmation email
        send_reservation_confirmation.delay(reservation.id)
        
        return Response({'message': 'Reservation confirmed'})
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a reservation"""
        reservation = self.get_object()
        
        if reservation.status in ['COMPLETED', 'NO_SHOW']:
            return Response(
                {'error': 'Cannot cancel completed or no-show reservations'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reservation.status = 'CANCELLED'
        reservation.save()
        
        return Response({'message': 'Reservation cancelled'})
