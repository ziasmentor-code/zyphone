from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer

# 1. എല്ലാ പ്രോഡക്റ്റുകളും ലിസ്റ്റ് ചെയ്യാൻ (List View)
@api_view(['GET'])
def getProducts(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

# 2. ഒരു പ്രോഡക്റ്റ് മാത്രം കാണിക്കാൻ (Detail View)
@api_view(['GET'])
def getProduct(request, pk):
    try:
        # നിങ്ങളുടെ മോഡലിൽ 'id' ആണോ '_id' ആണോ എന്ന് ഉറപ്പുവരുത്തുക
        product = Product.objects.get(id=pk) 
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=404)