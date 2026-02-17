from django.contrib import admin
from .models import Ticket


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('ticket_number', 'user', 'subject', 'category', 'status', 'priority', 'assigned_to', 'created_at')
    list_filter = ('status', 'priority', 'category', 'created_at')
    search_fields = ('ticket_number', 'subject', 'description', 'user__email')
    ordering = ('-created_at',)
    raw_id_fields = ('user', 'assigned_to')
    readonly_fields = ('ticket_number', 'created_at', 'updated_at', 'resolved_at')
    
    fieldsets = (
        ('Ticket Info', {
            'fields': ('ticket_number', 'user', 'subject', 'description', 'category')
        }),
        ('Status & Priority', {
            'fields': ('status', 'priority', 'assigned_to')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'resolved_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = [
        'mark_as_open',
        'mark_as_in_progress',
        'mark_as_resolved',
        'mark_as_closed',
        'set_priority_low',
        'set_priority_medium',
        'set_priority_high',
        'set_priority_urgent',
    ]
    
    def mark_as_open(self, request, queryset):
        updated = queryset.update(status='OPEN')
        self.message_user(request, f'{updated} ticket(s) marked as open.')
    mark_as_open.short_description = "Mark as Open"
    
    def mark_as_in_progress(self, request, queryset):
        updated = queryset.update(status='IN_PROGRESS')
        self.message_user(request, f'{updated} ticket(s) marked as in progress.')
    mark_as_in_progress.short_description = "Mark as In Progress"
    
    def mark_as_resolved(self, request, queryset):
        from django.utils import timezone
        updated = queryset.update(status='RESOLVED', resolved_at=timezone.now())
        self.message_user(request, f'{updated} ticket(s) marked as resolved.')
    mark_as_resolved.short_description = "Mark as Resolved"
    
    def mark_as_closed(self, request, queryset):
        updated = queryset.update(status='CLOSED')
        self.message_user(request, f'{updated} ticket(s) marked as closed.')
    mark_as_closed.short_description = "Mark as Closed"
    
    def set_priority_low(self, request, queryset):
        updated = queryset.update(priority='LOW')
        self.message_user(request, f'{updated} ticket(s) priority set to Low.')
    set_priority_low.short_description = "Set Priority: Low"
    
    def set_priority_medium(self, request, queryset):
        updated = queryset.update(priority='MEDIUM')
        self.message_user(request, f'{updated} ticket(s) priority set to Medium.')
    set_priority_medium.short_description = "Set Priority: Medium"
    
    def set_priority_high(self, request, queryset):
        updated = queryset.update(priority='HIGH')
        self.message_user(request, f'{updated} ticket(s) priority set to High.')
    set_priority_high.short_description = "Set Priority: High"
    
    def set_priority_urgent(self, request, queryset):
        updated = queryset.update(priority='URGENT')
        self.message_user(request, f'{updated} ticket(s) priority set to Urgent.')
    set_priority_urgent.short_description = "Set Priority: Urgent"
