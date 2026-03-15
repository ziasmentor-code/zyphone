# users/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import UserProfileSerializer
import traceback

User = get_user_model()

# ✅ Custom JWT Token Serializer
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['email'] = user.email
        token['username'] = user.username
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add extra responses
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'username': self.user.username,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
        }
        return data

# ✅ Custom JWT Token View
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# ✅ Register user
@api_view(['POST'])
def register_user(request):
    try:
        data = request.data
        email = data.get('email')
        password = data.get('password')
        username = data.get('username', email.split('@')[0] if email else 'user')
        
        if not email or not password:
            return Response({'error': 'Email and password required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=email).exists():
            return Response({'error': 'User already exists'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(
            email=email,
            username=username,
            password=password
        )
        
        return Response({
            'success': True,
            'message': 'User created successfully',
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print(f"Error registering user: {str(e)}")
        traceback.print_exc()
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ✅ GET user profile
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    """Get current user profile"""
    try:
        user = request.user
        print(f"Fetching profile for user: {user.email}")
        
        profile_data = {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone': getattr(user, 'phone', ''),
            'address': getattr(user, 'address', ''),
            'profile_image': user.profile_image.url if hasattr(user, 'profile_image') and user.profile_image else None,
            'date_joined': user.date_joined,
            'last_login': user.last_login,
        }
        
        return Response(profile_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error fetching profile: {str(e)}")
        traceback.print_exc()
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ✅ UPDATE user profile
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """Update current user profile"""
    try:
        user = request.user
        data = request.data
        
        print(f"Updating profile for user: {user.email}")
        print(f"Update data: {data}")
        
        # Update fields
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'phone' in data:
            user.phone = data['phone']
        if 'address' in data:
            user.address = data['address']
        
        user.save()
        
        return Response({
            'success': True,
            'message': 'Profile updated successfully',
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'phone': getattr(user, 'phone', ''),
                'address': getattr(user, 'address', ''),
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error updating profile: {str(e)}")
        traceback.print_exc()
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ✅ UPLOAD profile image
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_profile_image(request):
    """Upload profile image"""
    try:
        user = request.user
        print(f"Uploading image for user: {user.email}")
        
        if 'image' not in request.FILES:
            return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        image = request.FILES['image']
        
        # Check file size (max 5MB)
        if image.size > 5 * 1024 * 1024:
            return Response({'error': 'Image size should be less than 5MB'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Check file type
        allowed_types = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp']
        if image.content_type not in allowed_types:
            return Response({'error': 'Only JPEG, PNG, JPG, GIF and WEBP images are allowed'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Save image to user model
        if hasattr(user, 'profile_image'):
            # Delete old image if exists
            if user.profile_image:
                user.profile_image.delete()
            
            user.profile_image = image
            user.save()
            
            image_url = request.build_absolute_uri(user.profile_image.url)
            
            return Response({
                'success': True,
                'message': 'Image uploaded successfully',
                'image_url': image_url
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'User model does not have profile_image field'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        print(f"Error uploading image: {str(e)}")
        traceback.print_exc()
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ✅ DELETE profile image
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_profile_image(request):
    """Delete profile image"""
    try:
        user = request.user
        
        if hasattr(user, 'profile_image') and user.profile_image:
            user.profile_image.delete()
            user.profile_image = None
            user.save()
            
            return Response({
                'success': True,
                'message': 'Profile image deleted successfully'
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'No profile image to delete'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        print(f"Error deleting image: {str(e)}")
        traceback.print_exc()
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)