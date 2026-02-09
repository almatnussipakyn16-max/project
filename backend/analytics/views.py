from rest_framework import viewsets, permissions
from .models import DailySalesReport
from .serializers import DailySalesReportSerializer


class DailySalesReportViewSet(viewsets.ModelViewSet):
    queryset = DailySalesReport.objects.all()
    serializer_class = DailySalesReportSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
