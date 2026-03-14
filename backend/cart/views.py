from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Product, Cart, CartItem

def cart_view(request):
    cart = get_or_create_cart(request)
    return render(request, 'cart.html', {'cart': cart})

def add_to_cart(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    cart = get_or_create_cart(request)
    
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        defaults={'quantity': 1}
    )
    
    if not created:
        cart_item.quantity += 1
        cart_item.save()
    
    return JsonResponse({
        'success': True,
        'total': cart.get_total()
    })

def increase_quantity(request, item_id):
    cart_item = get_object_or_404(CartItem, id=item_id)
    cart_item.quantity += 1
    cart_item.save()
    
    return JsonResponse({
        'success': True,
        'new_quantity': cart_item.quantity,
        'item_total': cart_item.get_total(),
        'cart_total': cart_item.cart.get_total()
    })

def decrease_quantity(request, item_id):
    cart_item = get_object_or_404(CartItem, id=item_id)
    if cart_item.quantity > 1:
        cart_item.quantity -= 1
        cart_item.save()
    else:
        cart_item.delete()
        return JsonResponse({
            'success': True,
            'item_deleted': True,
            'cart_total': cart_item.cart.get_total()
        })
    
    return JsonResponse({
        'success': True,
        'new_quantity': cart_item.quantity,
        'item_total': cart_item.get_total(),
        'cart_total': cart_item.cart.get_total()
    })

def remove_cart_item(request, item_id):  # ഇത് 'view_cart' അല്ല, 'remove_cart_item' ആണ്
    cart_item = get_object_or_404(CartItem, id=item_id)
    cart = cart_item.cart
    cart_item.delete()
    
    return JsonResponse({
        'success': True,
        'cart_total': cart.get_total()
    })

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