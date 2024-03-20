from django.urls import path

from teacher.views import TeacherEntryView, TeacherSubView

app_name = 'teacher'

urlpatterns = [
    path('entry/', TeacherEntryView.as_view(), name='entry'),
    path('sub/', TeacherSubView.as_view(), name='sub'),
]
