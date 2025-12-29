from django.contrib import admin
from django.urls import path
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView 
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', CreateUserView.as_view(), name="register"),
    path('api/token/', TokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh/', TokenObtainPairView.as_view(), name="refersh"),
    path('api-auth/', include("rest_framework.urls")),
    path("api/", include("api.urls"))
]
