from django.urls import path

from alarm.views import AlarmView, AlarmAPI

app_name = 'alarm'

urlpatterns = [
    path('main/', AlarmView.as_view()),
    path('show/main/<int:page>', AlarmAPI.as_view()),
    path('update/', AlarmAPI.as_view()),
    path('remove/', AlarmAPI.as_view())

]
