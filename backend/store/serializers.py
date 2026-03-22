from rest_framework import serializers

from .models import Category, Order, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "name")


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
    )
    effective_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "price",
            "category",
            "category_id",
            "description",
            "image",
            "is_sale",
            "sale_price",
            "effective_price",
        )

    def get_effective_price(self, obj):
        if obj.is_sale and obj.sale_price:
            return obj.sale_price
        return obj.price


class OrderSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = (
            "id",
            "product",
            "product_name",
            "customer",
            "customer_name",
            "quantity",
            "address",
            "phone",
            "date",
            "status",
        )
        read_only_fields = ("id", "date", "customer")

    def get_customer_name(self, obj):
        return f"{obj.customer.account.first_name} {obj.customer.account.last_name}"


class OrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ("id", "status")
