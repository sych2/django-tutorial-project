from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin


class MyAccountManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError("Email is required")
        if not username:
            raise ValueError("Username is required")

        user = self.model(
            email=self.normalize_email(email),
            username=username,
        )
        user.set_password(password)
        user.is_active = True
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password):
        user = self.create_user(email, username, password)
        user.is_staff = True
        user.is_admin = True
        user.is_superuser = True
        user.save(using=self._db)
        return user
    def create_staff(self, email, username, password):
        user = self.create_user(email, username, password)
        user.is_staff = True
        user.save(using=self._db)
        return user




class account(AbstractUser, PermissionsMixin):
    email = models.EmailField(unique=True)

    profile_image = models.ImageField(
        upload_to=('/profile_images'),
        blank=True,
        null=True,
    )

    hide_email = models.BooleanField(default=True)

 
    objects = MyAccountManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email
