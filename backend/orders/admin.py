from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('menu_item', 'quantity', 'unit_price', 'subtotal')
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'user', 'restaurant', 'order_type', 'status', 'total', 'created_at')
    list_filter = ('status', 'order_type', 'created_at')
    search_fields = ('order_number', 'user__email', 'restaurant__name')
    ordering = ('-created_at',)
    inlines = [OrderItemInline]
    raw_id_fields = ('user', 'restaurant')
    readonly_fields = ('order_number', 'created_at', 'updated_at', 'subtotal', 'tax', 'delivery_fee', 'discount', 'total')
    
    fieldsets = (
        ('Order Info', {
            'fields': ('order_number', 'user', 'restaurant', 'order_type', 'status')
        }),
        ('Pricing', {
            'fields': ('subtotal', 'tax', 'delivery_fee', 'discount', 'total')
        }),
        ('Delivery', {
            'fields': ('delivery_address', 'delivery_instructions', 'estimated_delivery_time', 'actual_delivery_time'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_confirmed', 'mark_as_preparing', 'mark_as_ready', 'mark_as_delivered', 'mark_as_cancelled']
    
    def mark_as_confirmed(self, request, queryset):
        updated = queryset.update(status='CONFIRMED')
        self.message_user(request, f'{updated} order(s) marked as confirmed.')
    mark_as_confirmed.short_description = "Mark as Confirmed"
    
    def mark_as_preparing(self, request, queryset):
        updated = queryset.update(status='PREPARING')
        self.message_user(request, f'{updated} order(s) marked as preparing.')
    mark_as_preparing.short_description = "Mark as Preparing"
    
    def mark_as_ready(self, request, queryset):
        updated = queryset.update(status='READY')
        self.message_user(request, f'{updated} order(s) marked as ready.')
    mark_as_ready.short_description = "Mark as Ready"
    
    def mark_as_delivered(self, request, queryset):
        updated = queryset.update(status='DELIVERED')
        self.message_user(request, f'{updated} order(s) marked as delivered.')
    mark_as_delivered.short_description = "Mark as Delivered"
    
    def mark_as_cancelled(self, request, queryset):
        updated = queryset.update(status='CANCELLED')
        self.message_user(request, f'{updated} order(s) marked as cancelled.')
    mark_as_cancelled.short_description = "Mark as Cancelled"
