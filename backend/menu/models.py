from django.db import models
from django.utils.translation import gettext_lazy as _
from restaurants.models import Restaurant


class MenuCategory(models.Model):
    """Menu category model."""
    
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='menu_categories')
    name = models.CharField(_('name'), max_length=100)
    description = models.TextField(_('description'), blank=True)
    order = models.IntegerField(_('order'), default=0)
    is_active = models.BooleanField(_('active'), default=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('menu category')
        verbose_name_plural = _('menu categories')
        db_table = 'menu_categories'
        ordering = ['order', 'name']
        unique_together = [['restaurant', 'name']]
    
    def __str__(self):
        return f'{self.restaurant.name} - {self.name}'


class MenuItem(models.Model):
    """Menu item model."""
    
    category = models.ForeignKey(MenuCategory, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(_('name'), max_length=255)
    description = models.TextField(_('description'))
    price = models.DecimalField(_('price'), max_digits=10, decimal_places=2)
    image = models.ImageField(_('image'), upload_to='menu/items/', blank=True, null=True)
    
    # Nutritional info
    calories = models.IntegerField(_('calories'), blank=True, null=True)
    allergens = models.JSONField(_('allergens'), default=list)
    dietary_tags = models.JSONField(_('dietary tags'), default=list)
    
    # Availability
    is_available = models.BooleanField(_('available'), default=True)
    is_featured = models.BooleanField(_('featured'), default=False)
    preparation_time = models.IntegerField(_('preparation time (minutes)'), default=15)
    
    # Tracking
    order_count = models.IntegerField(_('order count'), default=0)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    is_deleted = models.BooleanField(_('deleted'), default=False)
    
    class Meta:
        verbose_name = _('menu item')
        verbose_name_plural = _('menu items')
        db_table = 'menu_items'
        ordering = ['category', 'name']
        indexes = [
            models.Index(fields=['category', 'is_available']),
            models.Index(fields=['is_featured']),
        ]
    
    def __str__(self):
        return f'{self.name} - ${self.price}'
