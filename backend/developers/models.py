from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import User
import secrets


class APIKey(models.Model):
    """API key model for developer portal."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='api_keys')
    name = models.CharField(_('name'), max_length=255)
    key = models.CharField(_('key'), max_length=100, unique=True)
    is_active = models.BooleanField(_('active'), default=True)
    
    # Rate limiting
    rate_limit = models.IntegerField(_('rate limit (requests/hour)'), default=1000)
    
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    last_used = models.DateTimeField(_('last used'), blank=True, null=True)
    
    class Meta:
        verbose_name = _('API key')
        verbose_name_plural = _('API keys')
        db_table = 'api_keys'
    
    def __str__(self):
        return f'{self.name} - {self.key[:10]}...'
    
    def save(self, *args, **kwargs):
        if not self.key:
            self.key = secrets.token_urlsafe(32)
        super().save(*args, **kwargs)


class Webhook(models.Model):
    """Webhook configuration model."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='webhooks')
    url = models.URLField(_('webhook URL'))
    events = models.JSONField(_('subscribed events'), default=list)
    is_active = models.BooleanField(_('active'), default=True)
    secret = models.CharField(_('secret'), max_length=100)
    
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('webhook')
        verbose_name_plural = _('webhooks')
        db_table = 'webhooks'
    
    def __str__(self):
        return f'Webhook - {self.url}'
    
    def save(self, *args, **kwargs):
        if not self.secret:
            self.secret = secrets.token_urlsafe(32)
        super().save(*args, **kwargs)
