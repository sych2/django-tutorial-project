import datetime

from django.conf import settings
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

# Create your models here.


class AccountManager(BaseUserManager):
    def create_user(self, username, email, phone_number, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        if not phone_number:
            raise ValueError("Phone number is required")

        email = self.normalize_email(email)

        user = self.model(
            username=username, email=email, phone_number=phone_number, **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(
        self, username, email, phone_number, password=None, **extra_fields
    ):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(
            username=username,
            email=email,
            phone_number=phone_number,
            password=password,
            **extra_fields,
        )


class Category(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

    # change to plural
    class Meta:
        verbose_name_plural = "cartegories"


class Customer(models.Model):
    account = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Employee(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone = models.CharField(max_length=50, unique=True)
    email = models.EmailField(max_length=100)
    password = models.CharField(max_length=100)
    is_staff = models.BooleanField(default=True, null=True)
    is_admin = models.BooleanField(default=False, null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


# All of our products
class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(default=0, decimal_places=2, max_digits=10)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, default=1)
    description = models.CharField(max_length=250, default="", blank=True, null=True)
    image = models.ImageField(upload_to="uploads/products/")

    # add sale
    is_sale = models.BooleanField(default=False)
    sale_price = models.DecimalField(default=0, decimal_places=2, max_digits=10)

    def __str__(self):
        return self.name


# Customer Orders
class Order(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    qualtity = models.IntegerField(default=1)
    address = models.CharField(max_length=100, default="", blank=True)
    phone = models.CharField(max_length=50)
    date = models.DateField(default=datetime.datetime.today)
    status = models.BooleanField(default=False)

    def __str__(self):
        return self.product


class Account(AbstractUser):

    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("employee", "Employee"),
        ("customer", "Customer"),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    phone_number = models.CharField(max_length=50, unique=True)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to="profile_images/", blank=True)

    REQUIRED_FIELDS = ["phone_number", "email", "first_name", "last_name"]

    objects = AccountManager()

    def __str__(self):
        return f"{self.username} ({self.role})"


class Location(models.Model):
    Account = models.OneToOneField(
        Account, on_delete=models.CASCADE, related_name="location"
    )
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}' Location"
