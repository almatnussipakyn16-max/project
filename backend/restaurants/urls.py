from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RestaurantViewSet, RestaurantImageViewSet, ReviewViewSet
from .owner_views import (
    OwnerRestaurantViewSet,
    OwnerMenuViewSet,
    OwnerTableViewSet,
    OwnerOrderViewSet,
    OwnerReservationViewSet,
)

router = DefaultRouter()
router.register(r'', RestaurantViewSet, basename='restaurant')
router.register(r'images', RestaurantImageViewSet, basename='restaurant-image')
router.register(r'reviews', ReviewViewSet, basename='review')

# Owner panel router
owner_router = DefaultRouter()
owner_router.register(r'restaurant', OwnerRestaurantViewSet, basename='owner-restaurant')
owner_router.register(r'menu', OwnerMenuViewSet, basename='owner-menu')
owner_router.register(r'tables', OwnerTableViewSet, basename='owner-table')
owner_router.register(r'orders', OwnerOrderViewSet, basename='owner-order')
owner_router.register(r'reservations', OwnerReservationViewSet, basename='owner-reservation')

urlpatterns = [
    path('owner/', include(owner_router.urls)),
    path('', include(router.urls)),
]
