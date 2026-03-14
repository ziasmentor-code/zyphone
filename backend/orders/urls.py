# orders/urls.py
from django.urls import path
from . import views

# ✅ IMPORTANT: These URLs will be prefixed with 'api/orders/' from main urls.py
# So:
# - 'create/' becomes '/api/orders/create/'
# - '' becomes '/api/orders/'
# - '<int:order_id>/' becomes '/api/orders/123/'
# - 'my-orders/' becomes '/api/orders/my-orders/'

urlpatterns = [
    # Order creation
    path('create/', views.place_order, name='place_order'),
    
    # Get user orders list
    path('', views.get_user_orders, name='user-orders'),
    
    # Get single order details
    path('<int:order_id>/', views.get_order_detail, name='order-detail'),
    
    # Alternative endpoint for my-orders (optional)
    path('my-orders/', views.get_user_orders, name='my-orders'),
]