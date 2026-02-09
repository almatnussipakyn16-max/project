from rest_framework import permissions


class IsOrderOwnerOrRestaurantOwner(permissions.BasePermission):
    """
    Permission: Order owner or restaurant owner can view/modify
    """
    def has_object_permission(self, request, view, obj):
        # Admins can do anything
        if request.user.role == 'ADMIN':
            return True
        
        # Order owner can view their orders
        if obj.user == request.user:
            return True
        
        # Restaurant owner can view/modify their restaurant's orders
        if request.user.role == 'RESTAURANT_OWNER' and obj.restaurant.owner == request.user:
            return True
        
        return False


class CanModifyOrderStatus(permissions.BasePermission):
    """
    Only restaurant owners and admins can modify order status
    """
    def has_permission(self, request, view):
        return request.user.role in ['RESTAURANT_OWNER', 'ADMIN', 'STAFF']
