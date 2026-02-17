from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import User
from restaurants.models import Restaurant


class Favorite(models.Model):
    """User's favorite restaurant."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('favorite')
        verbose_name_plural = _('favorites')
        db_table = 'favorites'
        unique_together = ['user', 'restaurant']
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'restaurant']),
        ]
    
    def __str__(self):
        return f'{self.user.email} - {self.restaurant.name}'
