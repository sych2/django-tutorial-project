from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin, UserManager 
import datetime



class MyAccountManager(UserManager):
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
        user.is_superuser = True
        user.save(using=self._db)
        return user




class account(AbstractUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    profile_image = models.ImageField(
        upload_to = '../profile_images',
        blank=True,
        null=True,
    )

    hide_email = models.BooleanField(default=True)

 
    objects = MyAccountManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email

class Category(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name  
class Customer(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone = models.CharField(max_length=50)
    email = models.EmailField(max_length=100)
    password = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'

#All of our products
class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(default = 0, decimal_places=2, max_digits=6 )
    category = models.ForeignKey(Category, on_delete=models.CASCADE, default=1) 
    description = models.CharField(max_length=250, default='', blank = True, null= True )
    image = models.ImageField(upload_to='uploads/products/' )
    
    def __str__(self):
        return self.email

#Customer Orders
class Order(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, on_delete= models.CASCADE)
    qualtity = models.IntegerField(default=1)
    address = models.CharField(max_length=100, default='', blank=True)
    phone = models.CharField(max_length=50)
    date = models.DateField(default=datetime.datetime.today)
    status = models.BooleanField(default=False)

    def __str__(self):
        return self.product