from django.db import models
from django.conf import settings
from django.utils import timezone  # ഇത് import ചെയ്യുക

class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    
    def __str__(self):
        return self.name

class Cart(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(default=timezone.now)  # auto_now_add=True ന് പകരം default=timezone.now
    session_id = models.CharField(max_length=255, blank=True, null=True)
    
    def get_total(self):
        return sum(item.get_total() for item in self.items.all())

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    
    def get_total(self):
        return self.product.price * self.quantity