from django.conf.urls.static import static
from django.contrib import admin
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
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
