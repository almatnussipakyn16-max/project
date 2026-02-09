from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from decimal import Decimal
from .models import Promotion
from .serializers import PromotionSerializer


class PromotionViewSet(viewsets.ModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    @action(detail=False, methods=['post'])
    def validate(self, request):
        """Validate a promo code"""
        code = request.data.get('code')
        order_total = request.data.get('order_total', 0)
        restaurant_id = request.data.get('restaurant')
        
        if not code:
            return Response(
                {'error': 'Promo code is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            promotion = Promotion.objects.get(code=code.upper())
        except Promotion.DoesNotExist:
            return Response(
                {'valid': False, 'error': 'Invalid promo code'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Validate
        if not promotion.is_valid():
            return Response({
                'valid': False,
                'error': 'Promo code has expired or reached max uses'
            })
        
        if promotion.restaurant and str(promotion.restaurant.id) != str(restaurant_id):
            return Response({
                'valid': False,
                'error': 'This promo code is not valid for this restaurant'
            })
        
        if Decimal(str(order_total)) < promotion.min_order_amount:
            return Response({
                'valid': False,
                'error': f'Minimum order amount is ${promotion.min_order_amount}'
            })
        
        # Calculate discount
        if promotion.discount_type == 'PERCENTAGE':
            discount = (Decimal(str(order_total)) * promotion.discount_value) / 100
        else:
            discount = promotion.discount_value
        
        if promotion.max_discount and discount > promotion.max_discount:
            discount = promotion.max_discount
        
        return Response({
            'valid': True,
            'discount': float(discount),
            'discount_type': promotion.discount_type,
            'title': promotion.title,
            'description': promotion.description
        })
