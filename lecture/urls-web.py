from django.urls import path

from lecture.views import LectureMainView, LectureDetailOnlineView, LectureDetailOfflineView, LectureTotalView, \
    LectureUploadOnlineView, LectureUploadOfflineView, LectureUpdateOnlineView, LectureUpdateOfflineView, \
    LectureDeleteView, LectureTotalApi, LectureMainApi, LectureReportView, LectureDetailCartAPI

app_name = 'lecture'

urlpatterns = [
    path('main/', LectureMainView.as_view(), name='main'),
    path('main/<int:page>', LectureMainApi.as_view(), name='main'),

    path('detail/online/', LectureDetailOnlineView.as_view(), name='detail-online'),
    path('detail/offline/', LectureDetailOfflineView.as_view(), name='detail-offline'),

    path('report/', LectureReportView.as_view(), name='report'),

    path('total/', LectureTotalView.as_view(), name='total'),
    path('total/<int:page>/<str:filters>/<str:sorting>/<str:type>', LectureTotalApi.as_view(), name='total'),

    path('upload/online/', LectureUploadOnlineView.as_view(), name='upload-online'),
    path('upload/offline/', LectureUploadOfflineView.as_view(), name='upload-offline'),

    path('update/online/', LectureUpdateOnlineView.as_view(), name='update-online'),
    path('update/offline/', LectureUpdateOfflineView.as_view(), name='update-offline'),

    path('delete/', LectureDeleteView.as_view(), name='delete'),

    # path('/apply/', ApplyView.as_view(), name='apply'),

    path('cart/api/', LectureDetailCartAPI.as_view(), name='detail-cart-api')
]
