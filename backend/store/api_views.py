from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import Category, Order, Product
from .permissions import IsAdminOrEmployee, IsAdminRole
from .serializers import (CategorySerializer, OrderSerializer,
                          OrderStatusSerializer, ProductSerializer)

# ============================================================
# Category Views
# ============================================================


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


# ============================================================
# Product Views
# ============================================================


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.select_related("category").all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.select_related("category").all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]


class ProductCreateView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminRole]


class ProductUpdateView(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminRole]


class ProductDeleteView(generics.DestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminRole]


# ============================================================
# Order Views
# ============================================================


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAdminOrEmployee]

    def get_queryset(self):
        return (
            Order.objects.select_related("product", "customer__account")
            .all()
            .order_by("-date")
        )


class OrderDetailView(generics.RetrieveAPIView):
    queryset = Order.objects.select_related("product", "customer__account").all()
    serializer_class = OrderSerializer
    permission_classes = [IsAdminOrEmployee]


class OrderStatusUpdateView(generics.UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderStatusSerializer
    permission_classes = [IsAdminOrEmployee]
    http_method_names = ["patch"]
