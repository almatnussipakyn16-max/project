from django.db import models
from django.utils.translation import gettext_lazy as _
from restaurants.models import Restaurant


class InventoryItem(models.Model):
    """Inventory item model."""
    
    class Unit(models.TextChoices):
        KG = 'KG', _('Kilograms')
        G = 'G', _('Grams')
        L = 'L', _('Liters')
        ML = 'ML', _('Milliliters')
        PCS = 'PCS', _('Pieces')
    
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='inventory_items')
    name = models.CharField(_('name'), max_length=255)
    sku = models.CharField(_('SKU'), max_length=100, blank=True)
    category = models.CharField(_('category'), max_length=100)
    
    # Quantity
    current_quantity = models.DecimalField(_('current quantity'), max_digits=10, decimal_places=2)
    unit = models.CharField(_('unit'), max_length=10, choices=Unit.choices)
    minimum_quantity = models.DecimalField(_('minimum quantity'), max_digits=10, decimal_places=2)
    
    # Pricing
    unit_cost = models.DecimalField(_('unit cost'), max_digits=10, decimal_places=2)
    
    # Tracking
    last_restocked = models.DateTimeField(_('last restocked'), blank=True, null=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('inventory item')
        verbose_name_plural = _('inventory items')
        db_table = 'inventory_items'
        unique_together = [['restaurant', 'sku']]
        indexes = [
            models.Index(fields=['restaurant', 'category']),
        ]
    
    def __str__(self):
        return f'{self.name} ({self.current_quantity} {self.unit})'
    
    @property
    def is_low_stock(self):
        return self.current_quantity <= self.minimum_quantity
