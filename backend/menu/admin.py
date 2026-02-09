from django.contrib import admin
from .models import MenuCategory, MenuItem


@admin.register(MenuCategory)
class MenuCategoryAdmin(admin.ModelAdmin):
    list_display = ('restaurant', 'name', 'order', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('restaurant__name', 'name')
    ordering = ('restaurant', 'order')


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'is_available', 'is_featured', 'order_count')
    list_filter = ('is_available', 'is_featured', 'created_at')
    search_fields = ('name', 'description', 'category__name')
    ordering = ('category', 'name')
