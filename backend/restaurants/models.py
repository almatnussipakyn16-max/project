from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import User


class Restaurant(models.Model):
    """Restaurant model."""
    
    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', _('Active')
        INACTIVE = 'INACTIVE', _('Inactive')
        PENDING = 'PENDING', _('Pending Approval')
        SUSPENDED = 'SUSPENDED', _('Suspended')
    
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_restaurants')
    name = models.CharField(_('name'), max_length=255)
    slug = models.SlugField(_('slug'), unique=True)
    description = models.TextField(_('description'))
    email = models.EmailField(_('email'))
    phone = models.CharField(_('phone'), max_length=20)
    website = models.URLField(_('website'), blank=True)
    
    # Address
    address_line1 = models.CharField(_('address line 1'), max_length=255)
    address_line2 = models.CharField(_('address line 2'), max_length=255, blank=True)
    city = models.CharField(_('city'), max_length=100)
    state = models.CharField(_('state/province'), max_length=100)
    postal_code = models.CharField(_('postal code'), max_length=20)
    country = models.CharField(_('country'), max_length=100)
    latitude = models.DecimalField(_('latitude'), max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(_('longitude'), max_digits=9, decimal_places=6, blank=True, null=True)
    
    # Images
    logo = models.ImageField(_('logo'), upload_to='restaurants/logos/', blank=True, null=True)
    cover_image = models.ImageField(_('cover image'), upload_to='restaurants/covers/', blank=True, null=True)
    
    # Business info
    cuisine_types = models.JSONField(_('cuisine types'), default=list, help_text='List of cuisine types')
    price_range = models.IntegerField(_('price range'), choices=[(1, '$'), (2, '$$'), (3, '$$$'), (4, '$$$$')], default=2)
    status = models.CharField(_('status'), max_length=20, choices=Status.choices, default=Status.PENDING)
    
    # Rating
    rating = models.DecimalField(_('rating'), max_digits=3, decimal_places=2, default=0.00)
    total_reviews = models.IntegerField(_('total reviews'), default=0)
    
    # Features
    delivery_available = models.BooleanField(_('delivery available'), default=True)
    takeout_available = models.BooleanField(_('takeout available'), default=True)
    reservation_available = models.BooleanField(_('reservation available'), default=True)
    
    # Business hours (stored as JSON for flexibility)
    business_hours = models.JSONField(_('business hours'), default=dict)
    
    # Tracking
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    is_deleted = models.BooleanField(_('deleted'), default=False)
    deleted_at = models.DateTimeField(_('deleted at'), blank=True, null=True)
    
    class Meta:
        verbose_name = _('restaurant')
        verbose_name_plural = _('restaurants')
        db_table = 'restaurants'
        ordering = ['-rating', '-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['status']),
            models.Index(fields=['city']),
            models.Index(fields=['rating']),
        ]
    
    def __str__(self):
        return self.name


class RestaurantImage(models.Model):
    """Restaurant gallery images."""
    
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(_('image'), upload_to='restaurants/gallery/')
    caption = models.CharField(_('caption'), max_length=255, blank=True)
    order = models.IntegerField(_('order'), default=0)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    
    class Meta:
        verbose_name = _('restaurant image')
        verbose_name_plural = _('restaurant images')
        db_table = 'restaurant_images'
        ordering = ['order', '-created_at']
    
    def __str__(self):
        return f'{self.restaurant.name} - Image {self.id}'


class Review(models.Model):
    """Restaurant review model."""
    
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(_('rating'), choices=[(i, str(i)) for i in range(1, 6)])
    title = models.CharField(_('title'), max_length=255)
    comment = models.TextField(_('comment'))
    
    # Owner response
    response = models.TextField(_('response'), blank=True)
    response_at = models.DateTimeField(_('response at'), blank=True, null=True)
    
    # Moderation
    is_approved = models.BooleanField(_('approved'), default=True)
    is_flagged = models.BooleanField(_('flagged'), default=False)
    
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    
    class Meta:
        verbose_name = _('review')
        verbose_name_plural = _('reviews')
        db_table = 'reviews'
        unique_together = [['restaurant', 'user']]
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['restaurant', 'rating']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f'{self.user.email} - {self.restaurant.name} ({self.rating}★)'

