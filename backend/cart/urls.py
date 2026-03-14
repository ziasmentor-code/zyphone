from django.urls import path
from . import views

urlpatterns = [
    path('', views.cart_view, name='cart_view'),
    path('add/<int:product_id>/', views.add_to_cart, name='add_to_cart'),
    path('increase/<int:item_id>/', views.increase_quantity, name='increase'),
    path('decrease/<int:item_id>/', views.decrease_quantity, name='decrease'),
    path('remove/<int:item_id>/', views.remove_cart_item, name='remove'),  # remove_from_cart -> remove_cart_item
]