# products/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Product
from .serializers import ProductSerializer

@api_view(['GET'])
def getProducts(request):
    print("=" * 50)
    print("GET PRODUCTS API CALLED")
    print("=" * 50)
    
    # Get all products from database
    products = Product.objects.all()
    print(f"Products in database: {products.count()}")
    
    # Print each product
    for product in products:
        print(f"ID: {product.id}, Name: {product.name}, Price: {product.price}")
    
    # Serialize data
    serializer = ProductSerializer(products, many=True)
    print(f"Serialized data: {serializer.data}")
    print("=" * 50)
    
    return Response(serializer.data)

@api_view(['GET'])
def getProduct(request, pk):
    print("=" * 50)
    print(f"GET PRODUCT API CALLED for ID: {pk}")
    print("=" * 50)
    
    try:
        product = Product.objects.get(id=pk)
        print(f"Product found: {product.name}")
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    except Product.DoesNotExist:
        print(f"Product with ID {pk} not found")
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)