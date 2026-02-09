from django.contrib import admin
from .models import APIKey, Webhook


@admin.register(APIKey)
class APIKeyAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'key', 'is_active', 'rate_limit', 'created_at', 'last_used')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'user__email', 'key')


@admin.register(Webhook)
class WebhookAdmin(admin.ModelAdmin):
    list_display = ('url', 'user', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('url', 'user__email')
