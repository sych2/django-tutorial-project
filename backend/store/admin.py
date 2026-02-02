from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Category, Customer, Product, Order, Employee, Account

# Register your models here.
admin.site.register(Account, UserAdmin)
admin.site.register(Category)
admin.site.register(Customer)
admin.site.register(Product)
admin.site.register(Order) 
admin.site.register(Employee)