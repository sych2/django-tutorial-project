from django.conf import settings
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils import timezone

# ===============================
# Custom User Manager
# ===============================


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
        extra_fields.setdefault("role", "admin")

        return self.create_user(
            username=username,
            email=email,
            phone_number=phone_number,
            password=password,
            **extra_fields,
        )


# ===============================
# Account (Custom User)
# ===============================


class Account(AbstractUser):

    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("employee", "Employee"),
        ("customer", "Customer"),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="customer")
    phone_number = models.CharField(max_length=50, unique=True)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to="profile_images/", blank=True)

    REQUIRED_FIELDS = ["phone_number", "email", "first_name", "last_name"]

    objects = AccountManager()

    def __str__(self):
        return f"{self.username} ({self.role})"


# ===============================
# Category
# ===============================


class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name


# ===============================
# Customer Profile
# ===============================


class Customer(models.Model):
    account = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="customer_profile",
        null=True,
        blank=True,
    )
    phone = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.account.first_name} {self.account.last_name}"


# ===============================
# Product
# ===============================


class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(
        Category, on_delete=models.PROTECT, related_name="products"
    )
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to="uploads/products/")

    is_sale = models.BooleanField(default=False)
    sale_price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )

    def __str__(self):
        return self.name


# ===============================
# Order
# ===============================


class Order(models.Model):
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    customer = models.ForeignKey(
        Customer, on_delete=models.CASCADE, related_name="orders"
    )
    quantity = models.PositiveIntegerField(default=1)
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=50)
    date = models.DateTimeField(default=timezone.now)
    status = models.BooleanField(default=False)

    def __str__(self):
        return f"Order #{self.id} - {self.product.name}"


# ===============================
# Location
# ===============================


class Location(models.Model):
    account = models.OneToOneField(
        Account, on_delete=models.CASCADE, related_name="location"
    )
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.account.username}'s Location"
