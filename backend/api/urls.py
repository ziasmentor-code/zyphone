from django.urls import path
from .views import register
from .views import subscribe

urlpatterns = [
    path('api/register/', register),
    path('api/subscribe/', subscribe, name='subscribe'),
]