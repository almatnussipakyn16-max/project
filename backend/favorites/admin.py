from django.contrib import admin
from .models import Favorite


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ['user', 'restaurant', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__email', 'restaurant__name']
    raw_id_fields = ['user', 'restaurant']
    readonly_fields = ['created_at']
    
    def has_add_permission(self, request):
        """Favorites should be added through the API."""
        return False
