from django.contrib import admin
from .models import DailySalesReport


@admin.register(DailySalesReport)
class DailySalesReportAdmin(admin.ModelAdmin):
    list_display = ('restaurant', 'date', 'total_orders', 'total_revenue', 'total_customers', 'average_order_value')
    list_filter = ('date', 'restaurant')
    search_fields = ('restaurant__name',)
    ordering = ('-date',)
