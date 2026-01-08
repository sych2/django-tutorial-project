from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import account


@admin.register(account)
class AccountAdmin(UserAdmin):
    # Fields shown in admin list view
    list_display = (
        "email",
        "username",
        "is_superuser",
        "is_staff",
        "is_active",
        "date_joined",
    )

    list_filter = (
        "date_joined",
        "last_login",
    )

    search_fields = (
        "email",
        "username",
    )

   
    readonly_fields = ("date_joined", "last_login")
