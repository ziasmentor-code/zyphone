from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from products.models import Newsletter # 👈 Newsletter model import cheyyuka

User = get_user_model()

# backend/api/views.py

@api_view(['POST'])
def register(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    # യൂസർനെയിം അയച്ചിട്ടില്ലെങ്കിൽ ഇമെയിൽ തന്നെ യൂസർനെയിം ആയി എടുക്കുക
    username = request.data.get('username', email) 

    if not email or not password:
        return Response({'error': 'Please provide email and password'}, status=400)

    try:
        user = User.objects.create_user(
            username=username, # ഇവിടെ username നിർബന്ധമായും നൽകണം
            email=email,
            password=password
        )
        return Response({'message': 'User registered successfully'}, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

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