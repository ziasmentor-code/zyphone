# orders/models.py
from django.db import models
from django.conf import settings
from products.models import Product


class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # ✅ Add these fields with defaults
    shipping_address = models.TextField(default='')  # Default empty string
    phone = models.CharField(max_length=15, default='')  # Default empty string
    is_paid = models.BooleanField(default=False)
    payment_method = models.CharField(max_length=50, default='COD')
    status = models.CharField(max_length=20, default='pending')  # pending, confirmed, shipped, delivered, cancelled

    def __str__(self):
        return f"Order {self.id} - {self.user.email}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # ✅ Add default

    def __str__(self):
        return f"{self.product.name} x{self.quantity}"