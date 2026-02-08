import datetime
from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name
    #change to plural
    class Meta:
        verbose_name_plural = 'cartegories'


class Customer(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone = models.CharField(max_length=50)
    password = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'

class Employee(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone = models.CharField(max_length=50, unique=True)
    email = models.EmailField(max_length=100)
    password = models.CharField(max_length=100)
    is_staff = models.BooleanField(default=True, null=True)
    is_admin = models.BooleanField(default=False, null=True)



    def __str__(self):
        return f'{self.first_name} {self.last_name}'

#All of our products
class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(default = 0, decimal_places=2, max_digits=10 )
    category = models.ForeignKey(Category, on_delete=models.CASCADE, default=1)
    description = models.CharField(max_length=250, default='', blank = True, null= True )
    image = models.ImageField(upload_to='uploads/products/' )

    #add sale
    is_sale = models.BooleanField(default= False)
    sale_price = models.DecimalField(default= 0, decimal_places= 2, max_digits= 10)


    def __str__(self):
        return self.name

#Customer Orders
class Order(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, on_delete= models.CASCADE)
    qualtity = models.IntegerField(default=1)
    address = models.CharField(max_length=100, default='', blank=True)
    phone = models.CharField(max_length=50)
    date = models.DateField(default= datetime.datetime.today)
    status = models.BooleanField(default=False)

    def __str__(self):
        return self.product


class Account (AbstractUser):
    phone_number = models.CharField(max_length=50, unique=True)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to="profile_images/", blank=True)
    REQUIRED_FIELDS = ['phone_number', 'email', 'first_name', 'last_name']

    def __str__(self):
        return f"{self.username} ({self.phone_number})"
