from django.urls import path
from cart.views import CartView, CartListAPI, CartAPI, CartCheckoutAPI

app_name = 'cart'

urlpatterns = [
    path('', CartView.as_view(), name='cart'),
    path('list/<int:cart_id>/', CartListAPI.as_view()),
    path('<int:detail_id>/',CartAPI.as_view()),
    path('checkout/<int:cart_id>/', CartCheckoutAPI.as_view())
]
