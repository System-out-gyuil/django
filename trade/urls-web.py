from django.urls import path

from trade.views import TradeMainView, TradeDetailView, TradeTotalView, TradeUploadView, TradeUpdateView, \
    TradeDeleteView, TradeTotalApi, TradeDetailApi, TradeReportView, TradeMainApi

app_name = 'trade'

urlpatterns = [
    # 거래 게시물 상세 페이지
    path('detail/', TradeDetailView.as_view(), name='detail'),
    path('detail/<int:trade_id>', TradeDetailApi.as_view(), name='detail'),

    # 거래 게시물 신고 뷰
    path('report/', TradeReportView.as_view(), name='report'),

    # 거래 게시물 수정 페이지
    path('update/', TradeUpdateView.as_view(), name='update'),

    # 거래 게시물 삭제 페이지
    path('delete/', TradeDeleteView.as_view(), name='delete'),

    # 거래 게시물 메인 페이지
    path('main/', TradeMainView.as_view(), name='main'),
    path('main/<int:page>', TradeMainApi.as_view(), name='total'),

    # 전체 거래 게시물 보기 페이지
    path('total/', TradeTotalView.as_view(), name='total'),
    path('total/<int:page>/<str:filters>/<str:sorting>/<str:type>', TradeTotalApi.as_view(), name='total'),

    # 거래 게시물 작성 페이지
    path('upload/', TradeUploadView.as_view(), name='upload'),
]
