from django.urls import path

from order.views import OrderView, OrderCartView

app_name = 'order'

urlpatterns = [
    path('order/', OrderView.as_view(), name='order'),
    path('cart/order/<int:cart_id>', OrderCartView.as_view())
]
