from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Product
from .serializers import ProductSerializer

# 1. എല്ലാ പ്രോഡക്റ്റുകളും ലിസ്റ്റ് ചെയ്യാൻ
@api_view(['GET']) # എപ്പോഴും ഇത് ഒന്നാമത്
@permission_classes([AllowAny]) # ഇത് രണ്ടാമത്
def getProducts(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

# 2. ഒരു പ്രോഡക്റ്റ് മാത്രം കാണിക്കാൻ
@api_view(['GET'])
@permission_classes([AllowAny])
def getProduct(request, pk):
    try:
        product = Product.objects.get(id=pk) 
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)