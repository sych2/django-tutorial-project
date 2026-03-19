from authentication.models import Account
from django.contrib import admin

from .models import Category, Customer, Order, Product

admin.site.register(Account)
admin.site.register(Category)
admin.site.register(Customer)
admin.site.register(Order)
admin.site.register(Product)
