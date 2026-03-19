from django.conf import settings
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class AccountManager(BaseUserManager):
    def create_user(self, username, email, phone_number, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        if not phone_number:
            raise ValueError("Phone number is required")

        user = self.model(
            username=username,
            email=self.normalize_email(email),
            phone_number=phone_number,
            **extra_fields,
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
        return self.create_user(username, email, phone_number, password, **extra_fields)


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


class Location(models.Model):
    account = models.OneToOneField(
        settings.AUTH_USER_MODEL,  # ← use settings, not direct Account import
        on_delete=models.CASCADE,
        related_name="location",
    )
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.account.username}'s Location"
