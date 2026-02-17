from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, Address


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'role', 'is_email_verified', 'is_active', 'created_at')
    list_filter = ('role', 'is_active', 'is_email_verified', 'created_at')
    search_fields = ('email', 'first_name', 'last_name', 'phone')
    ordering = ('-created_at',)
    actions = ['ban_users', 'unban_users', 'make_owner', 'make_staff', 'make_customer']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'phone', 'avatar', 'date_of_birth', 'bio')}),
        (_('Role & Permissions'), {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Verification'), {'fields': ('is_email_verified', 'is_2fa_enabled')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'role'),
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at', 'last_login', 'date_joined')
    
    def ban_users(self, request, queryset):
        """Ban selected users."""
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} user(s) successfully banned.')
    ban_users.short_description = "Ban selected users"
    
    def unban_users(self, request, queryset):
        """Unban selected users."""
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} user(s) successfully unbanned.')
    unban_users.short_description = "Unban selected users"
    
    def make_owner(self, request, queryset):
        """Change role to restaurant owner."""
        updated = queryset.update(role='RESTAURANT_OWNER')
        self.message_user(request, f'{updated} user(s) changed to Restaurant Owner role.')
    make_owner.short_description = "Make Restaurant Owner"
    
    def make_staff(self, request, queryset):
        """Change role to staff."""
        updated = queryset.update(role='STAFF', is_staff=True)
        self.message_user(request, f'{updated} user(s) changed to Staff role.')
    make_staff.short_description = "Make Staff"
    
    def make_customer(self, request, queryset):
        """Change role to customer."""
        updated = queryset.update(role='CUSTOMER')
        self.message_user(request, f'{updated} user(s) changed to Customer role.')
    make_customer.short_description = "Make Customer"


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'label', 'city', 'state', 'country', 'is_default')
    list_filter = ('is_default', 'country', 'state')
    search_fields = ('user__email', 'city', 'postal_code', 'address_line1')
    ordering = ('-created_at',)
