from django.contrib import admin
from .models import Restaurant, RestaurantImage, Review


@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'city', 'status', 'rating', 'total_reviews', 'created_at')
    list_filter = ('status', 'city', 'country', 'created_at')
    search_fields = ('name', 'description', 'owner__email', 'city')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('-created_at',)


@admin.register(RestaurantImage)
class RestaurantImageAdmin(admin.ModelAdmin):
    list_display = ('restaurant', 'caption', 'order', 'created_at')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('restaurant', 'user', 'rating', 'is_approved', 'is_flagged', 'created_at')
    list_filter = ('rating', 'is_approved', 'is_flagged', 'created_at')
    search_fields = ('restaurant__name', 'user__email', 'title', 'comment')
    ordering = ('-created_at',)
