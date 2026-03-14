# backend/urls.py
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from users.views import MyTokenObtainPairView, register_user
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    # User app endpoints
    path('api/users/register/', register_user, name='register_user'),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Other apps - each will have their own prefixes
    path('api/products/', include('products.urls')),  # /api/products/...
    path('api/cart/', include('cart.urls')),          # /api/cart/...
    path('api/orders/', include('orders.urls')),      # /api/orders/...

    # API root
    path('', include('api.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)