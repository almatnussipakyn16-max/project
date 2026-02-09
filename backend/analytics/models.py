from django.db import models
from django.utils.translation import gettext_lazy as _
from restaurants.models import Restaurant


class DailySalesReport(models.Model):
    """Daily sales report model."""
    
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='daily_reports')
    date = models.DateField(_('date'))
    
    total_orders = models.IntegerField(_('total orders'), default=0)
    total_revenue = models.DecimalField(_('total revenue'), max_digits=10, decimal_places=2, default=0.00)
    total_customers = models.IntegerField(_('total customers'), default=0)
    average_order_value = models.DecimalField(_('average order value'), max_digits=10, decimal_places=2, default=0.00)
    
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('daily sales report')
        verbose_name_plural = _('daily sales reports')
        db_table = 'daily_sales_reports'
        unique_together = [['restaurant', 'date']]
        ordering = ['-date']
    
    def __str__(self):
        return f'{self.restaurant.name} - {self.date}'
