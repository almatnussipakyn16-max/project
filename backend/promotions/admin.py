from django.contrib import admin
from .models import Promotion


@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'discount_type', 'discount_value', 'start_date', 'end_date', 'is_active')
    list_filter = ('discount_type', 'is_active', 'start_date', 'end_date')
    search_fields = ('code', 'name', 'description')
    ordering = ('-created_at',)
