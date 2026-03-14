from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from .serializers import MyTokenObtainPairSerializer  # import custom serializer

User = get_user_model()

# JWT login view
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer  # use custom serializer

# User registration view
@api_view(['POST'])
def register_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'error': 'Email and password required'}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(email=email).exists():
        return Response({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(email=email, password=password)
    return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)