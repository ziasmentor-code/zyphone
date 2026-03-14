from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

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