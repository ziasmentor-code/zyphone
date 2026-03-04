from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction

from .models import Order, OrderItem
from cart.models import Cart, CartItem


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_order(request):

    user = request.user

    try:
        cart = Cart.objects.get(user=user)
    except Cart.DoesNotExist:
        return Response({"error": "Cart is empty"}, status=400)

    cart_items = CartItem.objects.filter(cart=cart)

    if not cart_items.exists():
        return Response({"error": "Cart is empty"}, status=400)

    total_price = 0

    with transaction.atomic():

        # Check stock and calculate total
        for item in cart_items:
            product = item.product

            if product.stock < item.quantity:
                return Response({
                    "error": f"Not enough stock for {product.name}"
                }, status=400)

            total_price += product.price * item.quantity

        # Create Order
        order = Order.objects.create(
            user=user,
            total_price=total_price
        )

        # Create OrderItems and reduce stock
        for item in cart_items:
            product = item.product

            product.stock -= item.quantity
            product.save()

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item.quantity
            )

        # Clear Cart
        cart_items.delete()

    return Response({
        "message": "Order placed successfully",
        "order_id": order.id,
        "total_price": total_price
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_history(request):

    user = request.user
    orders = Order.objects.filter(user=user).order_by('-created_at')

    data = []

    for order in orders:
        items = OrderItem.objects.filter(order=order)

        order_data = {
            "order_id": order.id,
            "total_price": order.total_price,
            "created_at": order.created_at,
            "items": []
        }

        for item in items:
            order_data["items"].append({
                "product_name": item.product.name,
                "price": item.product.price,
                "quantity": item.quantity
            })

        data.append(order_data)

    return Response(data)