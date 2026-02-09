from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from decimal import Decimal
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer
from .permissions import IsOrderOwnerOrRestaurantOwner, CanModifyOrderStatus
from .tasks import handle_order_cancellation
from promotions.models import Promotion


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsOrderOwnerOrRestaurantOwner]
    
    def get_permissions(self):
        if self.action == 'update_status':
            return [permissions.IsAuthenticated(), CanModifyOrderStatus()]
        return super().get_permissions()
    
    @action(detail=True, methods=['post'])
    def apply_promo(self, request, pk=None):
        """Apply promo code to order"""
        order = self.get_object()
        
        if order.status != 'PENDING':
            return Response(
                {'error': 'Can only apply promo to pending orders'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        promo_code = request.data.get('code')
        if not promo_code:
            return Response(
                {'error': 'Promo code is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            promotion = Promotion.objects.get(code=promo_code.upper())
        except Promotion.DoesNotExist:
            return Response(
                {'error': 'Invalid promo code'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate promotion
        if not promotion.is_valid():
            return Response(
                {'error': 'Promo code has expired or reached max uses'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check restaurant match
        if promotion.restaurant and promotion.restaurant != order.restaurant:
            return Response(
                {'error': 'This promo code is not valid for this restaurant'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check minimum order amount
        if order.subtotal < promotion.min_order_amount:
            return Response(
                {'error': f'Minimum order amount is ${promotion.min_order_amount}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Calculate discount
        if promotion.discount_type == 'PERCENTAGE':
            discount = (order.subtotal * promotion.discount_value) / 100
        else:  # FIXED
            discount = promotion.discount_value
        
        # Apply max discount limit
        if promotion.max_discount and discount > promotion.max_discount:
            discount = promotion.max_discount
        
        # Update order
        order.discount = discount
        order.total = order.subtotal + order.tax + order.delivery_fee - order.discount
        order.save()
        
        # Increment promo usage
        promotion.current_uses += 1
        promotion.save()
        
        serializer = self.get_serializer(order)
        return Response({
            'message': 'Promo code applied successfully',
            'discount': discount,
            'new_total': order.total,
            'order': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def cancel_order(self, request, pk=None):
        """Cancel an order"""
        order = self.get_object()
        
        # Can only cancel pending or confirmed orders
        if order.status not in ['PENDING', 'CONFIRMED']:
            return Response(
                {'error': 'Can only cancel pending or confirmed orders'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = 'CANCELLED'
        order.save()
        
        # Trigger cancellation tasks
        handle_order_cancellation.delay(order.id)
        
        return Response({'message': 'Order cancelled successfully'})
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update order status (restaurant owner only)"""
        order = self.get_object()
        new_status = request.data.get('status')
        
        if not new_status:
            return Response(
                {'error': 'Status is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate status transition
        valid_transitions = {
            'PENDING': ['CONFIRMED', 'CANCELLED'],
            'CONFIRMED': ['PREPARING', 'CANCELLED'],
            'PREPARING': ['READY'],
            'READY': ['OUT_FOR_DELIVERY', 'COMPLETED'],
            'OUT_FOR_DELIVERY': ['DELIVERED'],
            'DELIVERED': ['COMPLETED'],
        }
        
        if new_status not in valid_transitions.get(order.status, []):
            return Response(
                {'error': f'Invalid status transition from {order.status} to {new_status}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = new_status
        order.save()
        
        serializer = self.get_serializer(order)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def track(self, request, pk=None):
        """Track order in real-time"""
        order = self.get_object()
        
        status_steps = [
            'PENDING', 'CONFIRMED', 'PREPARING', 'READY', 
            'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED'
        ]
        
        current_index = status_steps.index(order.status) if order.status in status_steps else 0
        
        return Response({
            'order_id': order.id,
            'order_number': order.order_number,
            'status': order.status,
            'current_step': current_index + 1,
            'total_steps': len(status_steps),
            'estimated_delivery_time': order.estimated_delivery_time,
            'created_at': order.created_at,
            'updated_at': order.updated_at,
        })


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
