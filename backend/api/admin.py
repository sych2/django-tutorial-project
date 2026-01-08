from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import account


@admin.register(account)
class AccountAdmin(UserAdmin):
    # Fields shown in admin list view
    list_display = (
        "email",
        "username",
        "is_admin",
        "is_staff",
        "is_active",
        "date_joined",
    )

    list_filter = (
        "is_admin",
        "is_staff",
        "is_active",
    )

    search_fields = (
        "email",
        "username",
    )

    ordering = ("email",)
    filter_horizontal = ("groups", "user_permissions")

    # Field layout when viewing/editing a user
    fieldsets = (
        (None, {
            "fields": ("email", "username", "password")
        }),
        ("Personal Info", {
            "fields": ("profile_image", "hide_email")
        }),
        ("Permissions", {
            "fields": (
                "is_active",
                "is_staff",
                "is_admin",
                "groups",
                "user_permissions",
            )
        }),
        ("Important Dates", {
            "fields": ("last_login", "date_joined")
        }),
    )

    # Field layout when creating a new user
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email",
                "username",
                "password1",
                "password2",
                "is_active",
                "is_staff",
                "is_admin",
            ),
        }),
    )

    readonly_fields = ("date_joined", "last_login")
