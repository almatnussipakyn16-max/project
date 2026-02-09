from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DailySalesReportViewSet

router = DefaultRouter()
router.register(r'', DailySalesReportViewSet, basename='daily-sales-report')

urlpatterns = [
    path('', include(router.urls)),
]
