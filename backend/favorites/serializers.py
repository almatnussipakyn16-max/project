from rest_framework import serializers
from .models import Favorite
from restaurants.serializers import RestaurantSerializer


class FavoriteSerializer(serializers.ModelSerializer):
    """Favorite serializer."""
    restaurant = RestaurantSerializer(read_only=True)
    restaurant_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Favorite
        fields = ['id', 'user', 'restaurant', 'restaurant_id', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
    
    def create(self, validated_data):
        """Create favorite with user from request context."""
        restaurant_id = validated_data.pop('restaurant_id')
        user = self.context['request'].user
        
        # Check if already favorited
        favorite, created = Favorite.objects.get_or_create(
            user=user,
            restaurant_id=restaurant_id
        )
        
        return favorite
