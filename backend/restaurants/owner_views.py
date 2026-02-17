from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from restaurants.models import Restaurant
from restaurants.serializers import RestaurantSerializer
from menu.models import MenuItem, MenuCategory
from menu.serializers import MenuItemSerializer, MenuCategorySerializer
from reservations.models import Table, Reservation
from reservations.serializers import TableSerializer, ReservationSerializer
from orders.models import Order
from orders.serializers import OrderSerializer


class IsRestaurantOwner(permissions.BasePermission):
    """Permission class to check if user is a restaurant owner."""
    
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.role == 'RESTAURANT_OWNER'
        )


class OwnerRestaurantViewSet(viewsets.ViewSet):
    """ViewSet for restaurant owners to manage their restaurant."""
    
    permission_classes = [permissions.IsAuthenticated, IsRestaurantOwner]
    
    def _get_owner_restaurant(self, request):
        """Helper to get owner's restaurant."""
        try:
            return Restaurant.objects.get(owner=request.user)
        except Restaurant.DoesNotExist:
            return None
    
    def list(self, request):
        """Get owner's restaurant."""
        restaurant = self._get_owner_restaurant(request)
        if not restaurant:
            return Response(
                {'error': 'No restaurant found for this owner'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = RestaurantSerializer(restaurant)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        """Update owner's restaurant."""
        restaurant = self._get_owner_restaurant(request)
        if not restaurant:
            return Response(
                {'error': 'No restaurant found for this owner'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = RestaurantSerializer(
            restaurant,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    def partial_update(self, request, pk=None):
        """Partially update owner's restaurant."""
        return self.update(request, pk)


class OwnerMenuViewSet(viewsets.ViewSet):
    """ViewSet for restaurant owners to manage their menu."""
    
    permission_classes = [permissions.IsAuthenticated, IsRestaurantOwner]
    
    def _get_owner_restaurant(self, request):
        """Helper to get owner's restaurant."""
        try:
            return Restaurant.objects.get(owner=request.user)
        except Restaurant.DoesNotExist:
            return None
    
    def list(self, request):
        """Get all menu items for owner's restaurant."""
        restaurant = self._get_owner_restaurant(request)
        if not restaurant:
            return Response(
                {'error': 'No restaurant found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        items = MenuItem.objects.filter(category__restaurant=restaurant)
        serializer = MenuItemSerializer(items, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        """Create a new menu item."""
        restaurant = self._get_owner_restaurant(request)
        if not restaurant:
            return Response(
                {'error': 'No restaurant found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = MenuItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def retrieve(self, request, pk=None):
        """Get a specific menu item."""
        restaurant = self._get_owner_restaurant(request)
        if not restaurant:
            return Response(
                {'error': 'No restaurant found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        item = get_object_or_404(
            MenuItem,
            pk=pk,
            category__restaurant=restaurant
        )
        serializer = MenuItemSerializer(item)
        return Response(serializer.data)
    
    def update(self, request, pk=None):
        """Update a menu item."""
        restaurant = self._get_owner_restaurant(request)
        if not restaurant:
            return Response(
                {'error': 'No restaurant found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        item = get_object_or_404(
            MenuItem,
            pk=pk,
            category__restaurant=restaurant
        )
        serializer = MenuItemSerializer(item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    def destroy(self, request, pk=None):
        """Delete a menu item."""
        restaurant = self._get_owner_restaurant(request)
        if not restaurant:
            return Response(
                {'error': 'No restaurant found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        item = get_object_or_404(
            MenuItem,
            pk=pk,
            category__restaurant=restaurant
        )
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class OwnerTableViewSet(viewsets.ViewSet):
    """ViewSet for restaurant owners to manage their tables."""
    
    permission_classes = [permissions.IsAuthenticated, IsRestaurantOwner]
    
    def _get_owner_restaurant(self, request):
        """Helper to get owner's restaurant."""
        try:
            return Restaurant.objects.get(owner=request.user)
        except Restaurant.DoesNotExist:
            return None
    
    def list(self, request):
        """Get all tables for owner's restaurant."""
        restaurant = self._get_owner_restaurant(request)
        if not restaurant:
            return Response(
                {'error': 'No restaurant found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        tables = Table.objects.filter(restaurant=restaurant)
        serializer = TableSerializer(tables, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        """Create a new table."""
        restaurant = self._get_owner_restaurant(request)
        if not restaurant:
            return Response(
                {'error': 'No restaurant found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        data = request.data.copy()
        data['restaurant'] = restaurant.id
        
        serializer = TableSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, pk=None):
        """Update a table."""
        restaurant = self._get_owner_restaurant(request)
        if not restaurant:
            return Response(
                {'error': 'No restaurant found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        table = get_object_or_404(Table, pk=pk, restaurant=restaurant)
        serializer = TableSerializer(table, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    def destroy(self, request, pk=None):
        """Delete a table."""
        restaurant = self._get_owner_restaurant(request)
        if not restaurant:
            return Response(
                {'error': 'No restaurant found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        table = get_object_or_404(Table, pk=pk, restaurant=restaurant)
        table.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class OwnerOrderViewSet(viewsets.ViewSet):
    """ViewSet for restaurant owners to manage orders."""
    
    permission_classes = [permissions.IsAuthenticated, IsRestaurantOwner]
    
    def _get_owner_restaurant(self, request):
        """Helper to get owner's restaurant."""
        try:
            return Restaurant.objects.get(owner=request.user)
        except Restaurant.DoesNotExist:
            return None
    
    def list(self, request):
        """Get all orders for owner's restaurant."""
        restaurant = self._get_owner_restaurant(request)
        if not restaurant:
            return Response(
                {'error': 'No restaurant found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        orders = Order.objects.filter(restaurant=restaurant).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        """Get a specific order."""
        restaurant = self._get_owner_restaurant(request)
        if not restaurant:
            return Response(
                {'error': 'No restaurant found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        order = get_object_or_404(Order, pk=pk, restaurant=restaurant)
        serializer = OrderSerializer(order)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update order status."""
        restaurant = self._get_owner_restaurant(request)
        if not restaurant:
            return Response(
                {'error': 'No restaurant found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        order = get_object_or_404(Order, pk=pk, restaurant=restaurant)
        new_status = request.data.get('status')
        
        if not new_status:
            return Response(
                {'error': 'Status is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate status
        valid_statuses = [choice[0] for choice in Order.Status.choices]
        if new_status not in valid_statuses:
            return Response(
                {'error': f'Invalid status. Must be one of: {valid_statuses}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = new_status
        order.save()
        
        serializer = OrderSerializer(order)
        return Response(serializer.data)


class OwnerReservationViewSet(viewsets.ViewSet):
    """ViewSet for restaurant owners to manage reservations."""
    
    permission_classes = [permissions.IsAuthenticated, IsRestaurantOwner]
    
    def _get_owner_restaurant(self, request):
        """Helper to get owner's restaurant."""
        try:
            return Restaurant.objects.get(owner=request.user)
        except Restaurant.DoesNotExist:
            return None
    
    def list(self, request):
        """Get all reservations for owner's restaurant."""
        restaurant = self._get_owner_restaurant(request)
        if not restaurant:
            return Response(
                {'error': 'No restaurant found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        reservations = Reservation.objects.filter(
            restaurant=restaurant
        ).order_by('-reservation_date', '-reservation_time')
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        """Get a specific reservation."""
        restaurant = self._get_owner_restaurant(request)
        if not restaurant:
            return Response(
                {'error': 'No restaurant found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        reservation = get_object_or_404(Reservation, pk=pk, restaurant=restaurant)
        serializer = ReservationSerializer(reservation)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def confirm(self, request, pk=None):
        """Confirm a reservation."""
        restaurant = self._get_owner_restaurant(request)
        if not restaurant:
            return Response(
                {'error': 'No restaurant found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        reservation = get_object_or_404(Reservation, pk=pk, restaurant=restaurant)
        
        if reservation.status != 'PENDING':
            return Response(
                {'error': 'Can only confirm pending reservations'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reservation.status = 'CONFIRMED'
        reservation.save()
        
        serializer = ReservationSerializer(reservation)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def reject(self, request, pk=None):
        """Reject a reservation."""
        restaurant = self._get_owner_restaurant(request)
        if not restaurant:
            return Response(
                {'error': 'No restaurant found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        reservation = get_object_or_404(Reservation, pk=pk, restaurant=restaurant)
        
        if reservation.status != 'PENDING':
            return Response(
                {'error': 'Can only reject pending reservations'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reservation.status = 'CANCELLED'
        reservation.save()
        
        serializer = ReservationSerializer(reservation)
        return Response(serializer.data)
