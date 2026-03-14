from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    price = serializers.ReadOnlyField(source='product.price')

    class Meta:
        model = OrderItem
        fields = ['product_name', 'price', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True, source='orderitem_set')

    class Meta:
        model = Order
        fields = ['id', 'total_price', 'created_at', 'items']