from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import User
from orders.models import Order


class Payment(models.Model):
    """Payment model."""
    
    class Status(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        PROCESSING = 'PROCESSING', _('Processing')
        COMPLETED = 'COMPLETED', _('Completed')
        FAILED = 'FAILED', _('Failed')
        REFUNDED = 'REFUNDED', _('Refunded')
    
    class Method(models.TextChoices):
        CARD = 'CARD', _('Credit/Debit Card')
        CASH = 'CASH', _('Cash')
        PAYPAL = 'PAYPAL', _('PayPal')
        STRIPE = 'STRIPE', _('Stripe')
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    
    transaction_id = models.CharField(_('transaction ID'), max_length=255, unique=True)
    amount = models.DecimalField(_('amount'), max_digits=10, decimal_places=2)
    method = models.CharField(_('payment method'), max_length=20, choices=Method.choices)
    status = models.CharField(_('status'), max_length=20, choices=Status.choices, default=Status.PENDING)
    
    # Payment gateway data
    gateway_response = models.JSONField(_('gateway response'), blank=True, null=True)
    
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('payment')
        verbose_name_plural = _('payments')
        db_table = 'payments'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['transaction_id']),
            models.Index(fields=['user', 'status']),
        ]
    
    def __str__(self):
        return f'Payment {self.transaction_id} - ${self.amount}'
