# products/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.getProducts, name='products'),           # /api/products/
    path('<str:pk>/', views.getProduct, name='product'),    # /api/products/1/
]