from django.urls import path

from . import views
from .api_views import (CategoryListView, OrderDetailView, OrderListView,
                        OrderStatusUpdateView, ProductCreateView,
                        ProductDeleteView, ProductDetailView, ProductListView,
                        ProductUpdateView)

urlpatterns = [
    # ── Existing template routes ──────────────────────────
    path("", views.home, name="home"),
    path("about/", views.about, name="about"),
    path("login/", views.login_user, name="login"),
    path("logout/", views.logout_user, name="logout"),
    path("register/", views.register_user, name="register"),
    path("product/<int:pk>", views.product, name="product"),
    path("category/<str:foo>/", views.category, name="category"),
    # ── API routes ────────────────────────────────────────
    path("api/categories/", CategoryListView.as_view(), name="api-categories"),
    path("api/products/", ProductListView.as_view(), name="api-products"),
    path(
        "api/products/<int:pk>/", ProductDetailView.as_view(), name="api-product-detail"
    ),
    path(
        "api/products/create/", ProductCreateView.as_view(), name="api-product-create"
    ),
    path(
        "api/products/<int:pk>/update/",
        ProductUpdateView.as_view(),
        name="api-product-update",
    ),
    path(
        "api/products/<int:pk>/delete/",
        ProductDeleteView.as_view(),
        name="api-product-delete",
    ),
    path("api/orders/", OrderListView.as_view(), name="api-orders"),
    path("api/orders/<int:pk>/", OrderDetailView.as_view(), name="api-order-detail"),
    path(
        "api/orders/<int:pk>/status/",
        OrderStatusUpdateView.as_view(),
        name="api-order-status",
    ),
]
