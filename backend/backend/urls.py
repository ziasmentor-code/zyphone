# backend/urls.py
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from users.views import MyTokenObtainPairView, register_user
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Admin Panel
    path('admin/', admin.site.urls),

    # ========================
    # USER AUTHENTICATION URLs
    # ========================
    # User registration
    path('api/users/register/', register_user, name='register_user'),
    
    # All user-related endpoints (profile, update, image upload)
    path('api/users/', include('users.urls')),
    
    # JWT Token endpoints
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ========================
    # OTHER APP URLs
    # ========================
    # Products app
    path('api/products/', include('products.urls')),
    
    # Cart app
    path('api/cart/', include('cart.urls')),
    
    # Orders app
    path('api/orders/', include('orders.urls')),

    # API root (if you have api/urls.py)
    path('', include('api.urls')),
]

# ========================
# MEDIA FILES SERVING (Development only)
# ========================
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)