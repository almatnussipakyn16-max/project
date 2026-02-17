from django.contrib import admin
from .models import Restaurant, RestaurantImage, Review


@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'city', 'status', 'rating', 'total_reviews', 'created_at')
    list_filter = ('status', 'city', 'country', 'cuisine_types', 'created_at')
    search_fields = ('name', 'description', 'owner__email', 'city', 'address_line1')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('-created_at',)
    raw_id_fields = ('owner',)
    filter_horizontal = ('cuisine_types',)
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'slug', 'owner', 'description', 'status')
        }),
        ('Contact', {
            'fields': ('email', 'phone', 'website')
        }),
        ('Address', {
            'fields': ('address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country', 'latitude', 'longitude')
        }),
        ('Business Info', {
            'fields': ('cuisine_types', 'price_range', 'rating', 'total_reviews')
        }),
        ('Features', {
            'fields': ('delivery_available', 'takeout_available', 'reservation_available')
        }),
        ('Media', {
            'fields': ('logo', 'cover_image')
        }),
        ('Hours', {
            'fields': ('business_hours',),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('rating', 'total_reviews', 'created_at', 'updated_at')


@admin.register(RestaurantImage)
class RestaurantImageAdmin(admin.ModelAdmin):
    list_display = ('restaurant', 'caption', 'order', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('restaurant__name', 'caption')
    raw_id_fields = ('restaurant',)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('restaurant', 'user', 'rating', 'is_approved', 'is_flagged', 'created_at')
    list_filter = ('rating', 'is_approved', 'is_flagged', 'created_at')
    search_fields = ('restaurant__name', 'user__email', 'title', 'comment')
    ordering = ('-created_at',)
    raw_id_fields = ('restaurant', 'user')
    actions = ['approve_reviews', 'flag_reviews', 'unflag_reviews']
    
    def approve_reviews(self, request, queryset):
        """Approve selected reviews."""
        updated = queryset.update(is_approved=True)
        self.message_user(request, f'{updated} review(s) approved.')
    approve_reviews.short_description = "Approve selected reviews"
    
    def flag_reviews(self, request, queryset):
        """Flag selected reviews."""
        updated = queryset.update(is_flagged=True)
        self.message_user(request, f'{updated} review(s) flagged.')
    flag_reviews.short_description = "Flag selected reviews"
    
    def unflag_reviews(self, request, queryset):
        """Unflag selected reviews."""
        updated = queryset.update(is_flagged=False)
        self.message_user(request, f'{updated} review(s) unflagged.')
    unflag_reviews.short_description = "Unflag selected reviews"
