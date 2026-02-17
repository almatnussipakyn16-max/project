from django.contrib import admin
from .models import Table, Reservation


@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
    list_display = ('table_number', 'restaurant', 'capacity', 'location', 'is_available')
    list_filter = ('is_available', 'restaurant', 'capacity')
    search_fields = ('table_number', 'restaurant__name', 'location')
    raw_id_fields = ('restaurant',)
    actions = ['make_available', 'make_unavailable']
    
    def make_available(self, request, queryset):
        updated = queryset.update(is_available=True)
        self.message_user(request, f'{updated} table(s) marked as available.')
    make_available.short_description = "Mark as Available"
    
    def make_unavailable(self, request, queryset):
        updated = queryset.update(is_available=False)
        self.message_user(request, f'{updated} table(s) marked as unavailable.')
    make_unavailable.short_description = "Mark as Unavailable"


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('reservation_number', 'user', 'restaurant', 'reservation_date', 'reservation_time', 'guest_count', 'status', 'created_at')
    list_filter = ('status', 'reservation_date', 'restaurant', 'created_at')
    search_fields = ('reservation_number', 'user__email', 'restaurant__name')
    ordering = ('-reservation_date', '-reservation_time')
    raw_id_fields = ('user', 'restaurant', 'table')
    readonly_fields = ('reservation_number', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Reservation Info', {
            'fields': ('reservation_number', 'user', 'restaurant', 'table')
        }),
        ('Details', {
            'fields': ('reservation_date', 'reservation_time', 'guest_count', 'status', 'special_requests')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['confirm_reservations', 'cancel_reservations', 'mark_seated', 'mark_completed', 'mark_no_show']
    
    def confirm_reservations(self, request, queryset):
        updated = queryset.update(status='CONFIRMED')
        self.message_user(request, f'{updated} reservation(s) confirmed.')
    confirm_reservations.short_description = "Confirm Reservations"
    
    def cancel_reservations(self, request, queryset):
        updated = queryset.update(status='CANCELLED')
        self.message_user(request, f'{updated} reservation(s) cancelled.')
    cancel_reservations.short_description = "Cancel Reservations"
    
    def mark_seated(self, request, queryset):
        updated = queryset.update(status='SEATED')
        self.message_user(request, f'{updated} reservation(s) marked as seated.')
    mark_seated.short_description = "Mark as Seated"
    
    def mark_completed(self, request, queryset):
        updated = queryset.update(status='COMPLETED')
        self.message_user(request, f'{updated} reservation(s) marked as completed.')
    mark_completed.short_description = "Mark as Completed"
    
    def mark_no_show(self, request, queryset):
        updated = queryset.update(status='NO_SHOW')
        self.message_user(request, f'{updated} reservation(s) marked as no-show.')
    mark_no_show.short_description = "Mark as No-Show"
