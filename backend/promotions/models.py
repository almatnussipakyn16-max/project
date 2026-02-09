from django.db import models
from django.utils.translation import gettext_lazy as _
from restaurants.models import Restaurant


class Promotion(models.Model):
    """Promotion model."""
    
    class DiscountType(models.TextChoices):
        PERCENTAGE = 'PERCENTAGE', _('Percentage')
        FIXED = 'FIXED', _('Fixed Amount')
        BOGO = 'BOGO', _('Buy One Get One')
    
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='promotions', null=True, blank=True)
    code = models.CharField(_('code'), max_length=50, unique=True)
    name = models.CharField(_('name'), max_length=255)
    description = models.TextField(_('description'))
    
    discount_type = models.CharField(_('discount type'), max_length=20, choices=DiscountType.choices)
    discount_value = models.DecimalField(_('discount value'), max_digits=10, decimal_places=2)
    
    # Validity
    start_date = models.DateTimeField(_('start date'))
    end_date = models.DateTimeField(_('end date'))
    
    # Usage limits
    max_uses = models.IntegerField(_('max uses'), blank=True, null=True)
    current_uses = models.IntegerField(_('current uses'), default=0)
    max_uses_per_user = models.IntegerField(_('max uses per user'), default=1)
    
    # Conditions
    minimum_order_amount = models.DecimalField(_('minimum order amount'), max_digits=10, decimal_places=2, default=0.00)
    
    is_active = models.BooleanField(_('active'), default=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('promotion')
        verbose_name_plural = _('promotions')
        db_table = 'promotions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f'{self.code} - {self.name}'
