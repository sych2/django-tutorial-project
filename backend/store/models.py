from django.conf import settings
from django.db import models
from django.utils import timezone


class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name




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


class Order(models.Model):
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders")

    quantity = models.PositiveIntegerField(default=1)
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=50)
    date = models.DateTimeField(default=timezone.now)
    status = models.BooleanField(default=False)



    def __str__(self):
        return f"Order #{self.id} - {self.product.name}"
