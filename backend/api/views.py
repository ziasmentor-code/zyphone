from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from products.models import Newsletter # 👈 Newsletter model import cheyyuka

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if User.objects.filter(username=username).exists():
        return Response({"message": "User already exists"}, status=400)

    User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    return Response({"message": "User created successfully"})

# ─────────────── ADD THIS SUBSCRIBE VIEW ───────────────
@api_view(['POST'])
@permission_classes([AllowAny])
def subscribe(request):
    email = request.data.get('email')
    
    if not email:
        return Response({"error": "Email is required"}, status=400)
    
    # Check if already subscribed
    if Newsletter.objects.filter(email=email).exists():
        return Response({"error": "This email is already subscribed!"}, status=400)
    
    # Save to database
    Newsletter.objects.create(email=email)
    
    return Response({"message": "Subscribed successfully!"}, status=201)