from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login', views.MLoginView.as_view(), name='login_page'),
    path('registration', views.MRegistrationView.as_view(), name='register_page'),
    path('logout', views.MLogoutView.as_view(), name='logout_page'),
    path('friends', views.friendsearch, name='friends_searching_page'),
    path('client/', views.client, name='game_client_page'),
    path('create_friendship', views.create_friendship, name='create_friendship'),
    path('shop/', views.shop, name="shop"),
    path('shop/buy/figure', views.buy_figure, name='buy_figure'),
    path('api/friends/delete', views.delete_friendship, name="delete_friendship")
]
