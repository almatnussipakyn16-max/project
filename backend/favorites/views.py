from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Favorite
from .serializers import FavoriteSerializer
from restaurants.models import Restaurant


class FavoriteViewSet(viewsets.ModelViewSet):
    """ViewSet for managing user favorites."""
    
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return favorites for the current user."""
        return Favorite.objects.filter(user=self.request.user).select_related('restaurant')
    
    def create(self, request, *args, **kwargs):
        """Add a restaurant to favorites."""
        restaurant_id = request.data.get('restaurant')
        
        if not restaurant_id:
            return Response(
                {'error': 'restaurant field is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if restaurant exists
        restaurant = get_object_or_404(Restaurant, id=restaurant_id)
        
        # Check if already favorited
        favorite, created = Favorite.objects.get_or_create(
            user=request.user,
            restaurant=restaurant
        )
        
        if not created:
            return Response(
                {'message': 'Restaurant already in favorites'},
                status=status.HTTP_200_OK
            )
        
        serializer = self.get_serializer(favorite)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def perform_create(self, serializer):
        """Set the user when creating a favorite."""
        serializer.save(user=self.request.user)
