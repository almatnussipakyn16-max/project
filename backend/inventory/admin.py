from django.contrib import admin
from .models import InventoryItem


@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'restaurant', 'current_quantity', 'unit', 'is_low_stock', 'last_restocked')
    list_filter = ('restaurant', 'category', 'unit')
    search_fields = ('name', 'sku', 'category')
    
    def is_low_stock(self, obj):
        return obj.is_low_stock
    is_low_stock.boolean = True
