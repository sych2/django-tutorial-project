from authentication.views import (CompleteProfileView,
                                  GoogleOAuthJWTExchangeView)
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path

from . import settings


def health(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("authentication.urls")),
    path("cart/", include("cart.urls")),
    path("home/", include("store.urls")),
    path('health/', health),
    path('accounts/', include('allauth.urls')),
    path('api/auth/google/token/', GoogleOAuthJWTExchangeView.as_view()),
    path('api/auth/complete-profile/', CompleteProfileView.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
