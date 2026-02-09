from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import User
from restaurants.models import Restaurant
from menu.models import MenuItem


class Order(models.Model):
    """Order model."""
    
    class Status(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        CONFIRMED = 'CONFIRMED', _('Confirmed')
        PREPARING = 'PREPARING', _('Preparing')
        READY = 'READY', _('Ready')
        OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY', _('Out for Delivery')
        DELIVERED = 'DELIVERED', _('Delivered')
        COMPLETED = 'COMPLETED', _('Completed')
        CANCELLED = 'CANCELLED', _('Cancelled')
    
    class OrderType(models.TextChoices):
        DELIVERY = 'DELIVERY', _('Delivery')
        TAKEOUT = 'TAKEOUT', _('Takeout')
        DINE_IN = 'DINE_IN', _('Dine In')
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='orders')
    order_number = models.CharField(_('order number'), max_length=50, unique=True)
    
    # Order details
    order_type = models.CharField(_('order type'), max_length=20, choices=OrderType.choices)
    status = models.CharField(_('status'), max_length=20, choices=Status.choices, default=Status.PENDING)
    
    # Pricing
    subtotal = models.DecimalField(_('subtotal'), max_digits=10, decimal_places=2)
    tax = models.DecimalField(_('tax'), max_digits=10, decimal_places=2)
    delivery_fee = models.DecimalField(_('delivery fee'), max_digits=10, decimal_places=2, default=0.00)
    discount = models.DecimalField(_('discount'), max_digits=10, decimal_places=2, default=0.00)
    total = models.DecimalField(_('total'), max_digits=10, decimal_places=2)
    
    # Delivery info
    delivery_address = models.JSONField(_('delivery address'), blank=True, null=True)
    delivery_instructions = models.TextField(_('delivery instructions'), blank=True)
    estimated_delivery_time = models.DateTimeField(_('estimated delivery time'), blank=True, null=True)
    actual_delivery_time = models.DateTimeField(_('actual delivery time'), blank=True, null=True)
    
    # Tracking
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('order')
        verbose_name_plural = _('orders')
        db_table = 'orders'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order_number']),
            models.Index(fields=['user', 'status']),
            models.Index(fields=['restaurant', 'status']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f'Order #{self.order_number}'


class OrderItem(models.Model):
    """Order item model."""
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.PROTECT)
    quantity = models.IntegerField(_('quantity'), default=1)
    unit_price = models.DecimalField(_('unit price'), max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(_('subtotal'), max_digits=10, decimal_places=2)
    special_instructions = models.TextField(_('special instructions'), blank=True)
    modifiers = models.JSONField(_('modifiers'), default=list)
    
    class Meta:
        verbose_name = _('order item')
        verbose_name_plural = _('order items')
        db_table = 'order_items'
    
    def __str__(self):
        return f'{self.menu_item.name} x {self.quantity}'
