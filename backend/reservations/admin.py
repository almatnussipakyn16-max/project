from django.contrib import admin
from .models import Table, Reservation


@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
    list_display = ('table_number', 'restaurant', 'capacity', 'is_available')
    list_filter = ('is_available', 'restaurant')
    search_fields = ('table_number', 'restaurant__name')


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('reservation_number', 'user', 'restaurant', 'reservation_date', 'reservation_time', 'guest_count', 'status')
    list_filter = ('status', 'reservation_date', 'restaurant')
    search_fields = ('reservation_number', 'user__email', 'restaurant__name')
    ordering = ('-reservation_date', '-reservation_time')
