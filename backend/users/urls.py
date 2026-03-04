from django.urls import path
from .views import test_user

urlpatterns = [
    path('', test_user),
]