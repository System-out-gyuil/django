from django.urls import path

from post.views import PostCreateView, PostDetailView, PostReplyWriteApi, PostDetailApi, PostReplyApi, PostScrapApi, \
    PostLikeApi, PostUpdateView, PostDeleteView, PostLikeCountApi, PostScrapCountApi, PostReportView, \
    PostReplyReportView, PostListView, PostListApi

app_name = 'post'

urlpatterns = [
    # 포스트 작성
    path('create/', PostCreateView.as_view(), name='create'),
    # 포스트 상세
    path('detail/', PostDetailView.as_view(), name='detail'),
    # 포스트 수정
    path('update/', PostUpdateView.as_view(), name='update'),
    # 포스트 삭제
    path('delete/', PostDeleteView.as_view(), name='delete'),
    # 포스트 신고
    path('report/', PostReportView.as_view(), name='report'),
    path('reply/report/', PostReplyReportView.as_view(), name='report'),

    path('replies/write/', PostReplyWriteApi.as_view(), name='reply_write'),
    path('replies/list/<int:post_id>/<int:page>/', PostDetailApi.as_view(), name='reply_list'),
    path('replies/<int:reply_id>/', PostReplyApi.as_view()),
    # path('replies/like/<int:post_id>/<int:reply_id>/<int:member_id>/<str:like_status>/', PostReplyLikeApi.as_view()),

    path('scrap/<int:post_id>/<int:member_id>/<str:scrap_status>/', PostScrapApi.as_view()),
    path('like/<int:post_id>/<int:member_id>/<str:like_status>/', PostLikeApi.as_view()),
    path('like/count/<int:post_id>/', PostLikeCountApi.as_view()),
    path('scrap/count/<int:post_id>/', PostScrapCountApi.as_view()),

    path('list/', PostListView.as_view(), name='list'),
    path('list/<int:page>/<str:filters>/<str:sorting>/<str:types>', PostListApi.as_view(), name='list'),

    # 채널
    # path('channel/', ChannelView.as_view(), name='list'),

]
