# cart/views.py
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Cart, CartItem  # ✅ Remove Product from here
from products.models import Product  # ✅ Import Product from products app
import traceback

# ✅ GET cart view
@api_view(['GET'])
def cart_view(request):
    try:
        cart = get_or_create_cart(request)
        
        # Get cart items using related_name 'items'
        items = cart.items.all()
        items_data = []
        
        for item in items:
            items_data.append({
                'id': item.id,
                'product_id': item.product.id,
                'product_name': item.product.name,
                'product_price': float(item.product.price),
                'product_image': item.product.image.url if item.product.image else None,
                'quantity': item.quantity,
                'total': float(item.get_total())
            })
        
        # Use cart's get_total method
        cart_total = float(cart.get_total()) if items.exists() else 0
        
        return Response({
            'success': True,
            'cart_id': cart.id,
            'items': items_data,
            'total': cart_total,
            'item_count': items.count()
        })
    except Exception as e:
        print(f"Error in cart_view: {str(e)}")
        traceback.print_exc()
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ✅ POST add to cart
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request, product_id):
    """Add product to cart - Requires authentication"""
    try:
        user = request.user
        print(f"User authenticated: {user.is_authenticated}")
        print(f"User email: {user.email}")
        print(f"Adding product ID: {product_id}")
        
        # ✅ Use Product from products.models
        product = get_object_or_404(Product, id=product_id)
        
        # Get or create cart for authenticated user
        cart, created = Cart.objects.get_or_create(user=user)
        
        # Check if item already in cart
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': 1}
        )
        
        if not created:
            cart_item.quantity += 1
            cart_item.save()
        
        # Calculate totals using model methods
        item_total = float(cart_item.get_total())
        cart_total = float(cart.get_total())
        
        print(f"Item added successfully. Cart total: {cart_total}")
        
        return Response({
            'success': True,
            'message': 'Item added to cart',
            'cart_item': {
                'id': cart_item.id,
                'product_id': product.id,
                'product_name': product.name,
                'quantity': cart_item.quantity,
                'total': item_total
            },
            'cart_total': cart_total
        }, status=status.HTTP_200_OK)
        
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error adding to cart: {str(e)}")
        traceback.print_exc()
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ✅ POST increase quantity
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def increase_quantity(request, item_id):
    try:
        cart_item = get_object_or_404(CartItem, id=item_id)
        
        # Check if cart belongs to user
        if cart_item.cart.user != request.user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        cart_item.quantity += 1
        cart_item.save()
        
        return Response({
            'success': True,
            'new_quantity': cart_item.quantity,
            'item_total': float(cart_item.get_total()),
            'cart_total': float(cart_item.cart.get_total())
        })
    except Exception as e:
        print(f"Error increasing quantity: {str(e)}")
        traceback.print_exc()
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ✅ POST decrease quantity
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def decrease_quantity(request, item_id):
    try:
        cart_item = get_object_or_404(CartItem, id=item_id)
        
        # Check if cart belongs to user
        if cart_item.cart.user != request.user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        if cart_item.quantity > 1:
            cart_item.quantity -= 1
            cart_item.save()
            return Response({
                'success': True,
                'new_quantity': cart_item.quantity,
                'item_total': float(cart_item.get_total()),
                'cart_total': float(cart_item.cart.get_total())
            })
        else:
            cart_item.delete()
            return Response({
                'success': True,
                'item_deleted': True,
                'cart_total': float(cart_item.cart.get_total())
            })
    except Exception as e:
        print(f"Error decreasing quantity: {str(e)}")
        traceback.print_exc()
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ✅ DELETE remove item
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_cart_item(request, item_id):
    try:
        cart_item = get_object_or_404(CartItem, id=item_id)
        
        # Check if cart belongs to user
        if cart_item.cart.user != request.user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        cart = cart_item.cart
        cart_item.delete()
        
        return Response({
            'success': True,
            'message': 'Item removed from cart',
            'cart_total': float(cart.get_total())
        })
    except Exception as e:
        print(f"Error removing item: {str(e)}")
        traceback.print_exc()
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Helper function to get or create cart
def get_or_create_cart(request):
    if request.user.is_authenticated:
        cart, created = Cart.objects.get_or_create(user=request.user)
        return cart
    else:
        # Anonymous user - session based cart
        session_id = request.session.session_key
        if not session_id:
            request.session.create()
            session_id = request.session.session_key
        
        cart, created = Cart.objects.get_or_create(
            session_id=session_id,
            defaults={'user': None}
        )
        return cart