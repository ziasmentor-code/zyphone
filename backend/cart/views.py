from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Cart, CartItem
from .serializers import CartItemSerializer
from products.models import Product


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):

    user = request.user
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))

    product = get_object_or_404(Product, id=product_id)

    cart, created = Cart.objects.get_or_create(user=user)

    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product
    )

    cart_item.quantity += quantity
    cart_item.save()

    return Response({"message": "Added to cart"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_cart(request):

    user = request.user

    try:
        cart = Cart.objects.get(user=user)
    except Cart.DoesNotExist:
        return Response({"message": "Cart is empty"})

    items = CartItem.objects.filter(cart=cart)
    serializer = CartItemSerializer(items, many=True)

    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, product_id):

    user = request.user

    try:
        cart = Cart.objects.get(user=user)
        item = CartItem.objects.get(cart=cart, product_id=product_id)
        item.delete()
        return Response({"message": "Item removed from cart"})
    except:
        return Response({"error": "Item not found"}, status=404)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_cart_quantity(request, product_id):

    quantity = request.data.get("quantity")

    if not quantity or int(quantity) <= 0:
        return Response({"error": "Invalid quantity"}, status=400)

    user = request.user

    try:
        cart = Cart.objects.get(user=user)
        item = CartItem.objects.get(cart=cart, product_id=product_id)
        item.quantity = int(quantity)
        item.save()
        return Response({"message": "Cart updated"})
    except:
        return Response({"error": "Item not found"}, status=404)