from rest_framework import serializers
from .models import Restaurant, RestaurantImage, Review


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'rating', 'total_reviews']


class RestaurantImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantImage
        fields = '__all__'


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
