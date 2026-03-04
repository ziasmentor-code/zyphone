from django.urls import path
from .views import place_order, order_history

urlpatterns = [
    path('place/', place_order),
      path('history/', order_history),
]