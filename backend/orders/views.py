# orders/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Order, OrderItem
from products.models import Product
import logging
import traceback
import sys

logger = logging.getLogger(__name__)

# ✅ GET orders list view
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_orders(request):
    """Get all orders for the logged-in user"""
    try:
        user = request.user
        print(f"\nFetching orders for user: {user.email}")
        
        # Get all orders for this user, ordered by newest first
        orders = Order.objects.filter(user=user).order_by('-created_at')
        
        # Format the response
        orders_data = []
        for order in orders:
            # Get items for this order
            items = OrderItem.objects.filter(order=order)
            items_data = []
            
            for item in items:
                items_data.append({
                    'id': item.id,
                    'product_id': item.product.id,
                    'product_name': item.product.name,
                    'product_image': item.product.image.url if hasattr(item.product, 'image') and item.product.image else None,
                    'quantity': item.quantity,
                    'price': float(item.price)
                })
            
            orders_data.append({
                'id': order.id,
                'created_at': order.created_at,
                'total_price': float(order.total_price),
                'shipping_address': order.shipping_address,
                'phone': order.phone,
                'payment_method': order.payment_method,
                'is_paid': order.is_paid,
                'status': order.status,
                'items': items_data,
                'items_count': len(items_data)
            })
        
        print(f"Found {len(orders_data)} orders")
        return Response(orders_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error fetching orders: {str(e)}")
        traceback.print_exc()
        return Response(
            {'error': 'Failed to fetch orders'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ✅ Get single order details
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order_detail(request, order_id):
    """Get details of a specific order"""
    try:
        user = request.user
        print(f"\nFetching order {order_id} for user: {user.email}")
        
        # Get the order (ensure it belongs to the user)
        try:
            order = Order.objects.get(id=order_id, user=user)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get items for this order
        items = OrderItem.objects.filter(order=order)
        items_data = []
        
        for item in items:
            items_data.append({
                'id': item.id,
                'product_id': item.product.id,
                'product_name': item.product.name,
                'product_image': item.product.image.url if hasattr(item.product, 'image') and item.product.image else None,
                'quantity': item.quantity,
                'price': float(item.price),
                'total': float(item.price * item.quantity)
            })
        
        order_data = {
            'id': order.id,
            'created_at': order.created_at,
            'total_price': float(order.total_price),
            'shipping_address': order.shipping_address,
            'phone': order.phone,
            'payment_method': order.payment_method,
            'is_paid': order.is_paid,
            'status': order.status,
            'items': items_data,
            'items_count': len(items_data)
        }
        
        return Response(order_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error fetching order: {str(e)}")
        traceback.print_exc()
        return Response(
            {'error': 'Failed to fetch order'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ✅ Your existing place_order view (keep as is)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_order(request):
    user = request.user
    data = request.data
    
    # Log everything for debugging
    print("\n" + "="*50)
    print("ORDER CREATION DEBUG")
    print("="*50)
    print(f"User: {user.email} (ID: {user.id})")
    print(f"Request data: {data}")
    print(f"Shipping address from data: {data.get('shipping_address')}")
    print(f"Phone from data: {data.get('phone')}")
    print(f"Total price from data: {data.get('total_price')}")
    print(f"Payment method from data: {data.get('payment_method')}")
    print(f"Items from data: {data.get('items')}")
    print("="*50)

    try:
        # 1. Check if user is authenticated
        if not user or not user.is_authenticated:
            print("ERROR: User not authenticated")
            return Response(
                {'error': 'User not authenticated'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # 2. Validate required fields
        required_fields = ['shipping_address', 'phone', 'total_price', 'items']
        for field in required_fields:
            if field not in data:
                print(f"ERROR: Missing required field: {field}")
                return Response(
                    {'error': f'{field} is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # 3. Validate items
        items = data.get('items')
        if not items or len(items) == 0:
            print("ERROR: No items in order")
            return Response(
                {'error': 'No items in order'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 4. Validate shipping_address and phone
        shipping_address = data.get('shipping_address', '').strip()
        phone = data.get('phone', '').strip()
        
        print(f"Processed shipping_address: '{shipping_address}'")
        print(f"Processed phone: '{phone}'")
        
        if not shipping_address:
            print("ERROR: Shipping address is empty")
            return Response(
                {'error': 'Shipping address cannot be empty'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not phone:
            print("ERROR: Phone number is empty")
            return Response(
                {'error': 'Phone number cannot be empty'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 5. Validate total_price
        try:
            total_price = float(data.get('total_price', 0))
            print(f"Total price parsed: {total_price}")
        except (TypeError, ValueError) as e:
            print(f"ERROR parsing total_price: {e}")
            return Response(
                {'error': 'Invalid total price format'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 6. Create the Order
        print("Attempting to create order...")
        try:
            order = Order.objects.create(
                user=user,
                shipping_address=shipping_address,
                phone=phone,
                total_price=total_price,
                payment_method=data.get('payment_method', 'COD'),
                is_paid=data.get('is_paid', False),
                status=data.get('status', 'pending')
            )
            print(f"Order created successfully with ID: {order.id}")
        except Exception as e:
            print(f"ERROR creating order: {str(e)}")
            print(traceback.format_exc())
            return Response(
                {'error': f'Database error creating order: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 7. Create Order Items
        print("\nProcessing order items...")
        for index, item in enumerate(items):
            try:
                print(f"Item {index + 1}: {item}")
                
                # Get product_id (can be 'product_id' or 'id')
                product_id = item.get('product_id') or item.get('id')
                if not product_id:
                    print(f"ERROR: Product ID missing in item {index + 1}")
                    # Delete the order if items fail
                    order.delete()
                    return Response(
                        {'error': f'Product ID missing in item {index + 1}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                print(f"Looking for product with ID: {product_id}")
                
                try:
                    product = Product.objects.get(id=product_id)
                    print(f"Found product: {product.name} (ID: {product.id})")
                except Product.DoesNotExist:
                    print(f"ERROR: Product with ID {product_id} not found")
                    order.delete()
                    return Response(
                        {'error': f'Product with ID {product_id} not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                
                # Get quantity
                try:
                    quantity = int(item.get('quantity', 1))
                    print(f"Quantity: {quantity}")
                except (TypeError, ValueError):
                    print(f"ERROR: Invalid quantity format: {item.get('quantity')}")
                    order.delete()
                    return Response(
                        {'error': f'Invalid quantity for item {index + 1}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Get price
                try:
                    price = float(item.get('price', product.price))
                    print(f"Price: {price}")
                except (TypeError, ValueError):
                    print(f"ERROR: Invalid price format: {item.get('price')}")
                    order.delete()
                    return Response(
                        {'error': f'Invalid price for item {index + 1}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Create order item
                try:
                    order_item = OrderItem.objects.create(
                        product=product,
                        order=order,
                        quantity=quantity,
                        price=price
                    )
                    print(f"OrderItem created: {order_item}")
                except Exception as e:
                    print(f"ERROR creating OrderItem: {str(e)}")
                    order.delete()
                    return Response(
                        {'error': f'Error creating order item: {str(e)}'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

                # Update stock if the field exists
                if hasattr(product, 'stock') and product.stock is not None:
                    try:
                        product.stock -= quantity
                        product.save()
                        print(f"Updated stock for {product.name}: {product.stock} remaining")
                    except Exception as e:
                        print(f"ERROR updating stock: {str(e)}")
                        # Don't fail order if stock update fails
                        pass

            except Exception as e:
                print(f"Unexpected error processing item {index + 1}: {str(e)}")
                print(traceback.format_exc())
                order.delete()
                return Response(
                    {'error': f'Error processing item {index + 1}: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        print("\n" + "="*50)
        print("ORDER PLACED SUCCESSFULLY!")
        print(f"Order ID: {order.id}")
        print(f"Total Items: {len(items)}")
        print(f"Total Price: ₹{total_price}")
        print("="*50 + "\n")
        
        return Response({
            'message': 'Order successfully placed!',
            'order_id': order.id,
            'total': total_price
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        print("\n" + "="*50)
        print("UNEXPECTED ERROR IN ORDER CREATION")
        print("="*50)
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        print("Traceback:")
        traceback.print_exc(file=sys.stdout)
        print("="*50 + "\n")
        
        return Response(
            {'error': f'Unexpected error: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )