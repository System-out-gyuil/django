from django.urls import path

from notice.views import NoticeWebView, NoticeListAPI

app_name = 'notice'

urlpatterns = [
    path('web/', NoticeWebView.as_view(), name='web'),
    path('list/', NoticeListAPI.as_view(), name='notice-list-api'),
]
