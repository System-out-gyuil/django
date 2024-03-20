from django.urls import path

from member.views import MemberJoinView, MemberLoginView, MemberLogoutView, MypageUpdateView, MypagePostListAPI, \
    MypagePostView, MypageShowView,  MypageShowReplyAPI, MypageReplyView, MypageShowReviewAPI, \
    MypageReviewView, MypageShowLikesAPI, MypageLikesView, MypageLecturesView, \
    MypageShowLecturesAPI, LectureReviewView, MypageScrapLecturesView, MypageScrapLectureAPI, MypageScrapTradeView, \
    MypageScrapTradeAPI, MypageTradesView, MypageTradesAPI, MypageTeacherView, MypageTeacherPlanView, MypageTeacherAPI, \
    MypageTraineeView, MypageTraineeAPI

app_name = 'member'

urlpatterns = [
    path('join/', MemberJoinView.as_view(), name='join'),
    path('login/', MemberLoginView.as_view(), name='login'),
    path('logout/', MemberLogoutView.as_view(), name='logout'),
    path('mypage/settings/',MypageUpdateView.as_view(), name='update'),
    path('mypage/show/', MypageShowView.as_view(),name='show'),
    path('mypage/posts/', MypagePostView.as_view(), name='mypost'),
    path('mypage/show/posts/<int:page>/', MypagePostListAPI.as_view()),
    path('mypage/show/replies/<int:page>/', MypageShowReplyAPI.as_view()),
    path('mypage/replies/', MypageReplyView.as_view()),
    path('mypage/show/reviews/<int:page>/', MypageShowReviewAPI.as_view()),
    path('mypage/reviews/', MypageReviewView.as_view()),
    path('mypage/likes/', MypageLikesView.as_view()),
    path('mypage/show/likes/<int:page>/', MypageShowLikesAPI.as_view()),
    path('mypage/delete-likes/<str:checker>/<int:id>/',MypageShowLikesAPI.as_view()),
    path('mypage/scraplectures/',MypageScrapLecturesView.as_view()),
    path('mypage/show/scraplectures/<int:page>',MypageScrapLectureAPI.as_view()),
    path('mypage/lectures/',MypageLecturesView.as_view(), name='lectures'),
    path('mypage/show/lectures/<int:page>', MypageShowLecturesAPI.as_view()),
    path('mypage/writereviews/<int:lecture_id>', LectureReviewView.as_view()),
    path('mypage/scraptrades/',MypageScrapTradeView.as_view()),
    path('mypage/show/scraptrades/<int:page>',MypageScrapTradeAPI.as_view()),
    path('mypage/trades/',MypageTradesView.as_view()),
    path('mypage/show/trades/<int:page>',MypageTradesAPI.as_view()),
    path('mypage/teachers/', MypageTeacherView.as_view()),
    path('mypage/teachers/plan/',MypageTeacherPlanView.as_view()),
    path('mypage/show/teachers/<int:page>', MypageTeacherAPI.as_view()),
    path('mypage/teachers/apply/<int:apply_id>',MypageTraineeView.as_view()),
    path('mypage/teachers/show/apply/<int:apply_id>', MypageTraineeAPI.as_view())


]
