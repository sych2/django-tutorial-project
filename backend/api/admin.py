from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from api.models import account

class AccountAdmin(UserAdmin):
    list_display = ('email', 'username','date_joined','last_login', 'is_admin', 'is_staff')
    search_fields = ('email', 'username')
    readonly_fields = ('id', 'date_joined', 'last_login')

    filter_horizontal = ()
    list_filter = (
        "is_active",
        "is_staff",
        "is_superuser",
    )
    fieldsets = ()
admin.site.register(account, AccountAdmin)

# Register your models here.
 