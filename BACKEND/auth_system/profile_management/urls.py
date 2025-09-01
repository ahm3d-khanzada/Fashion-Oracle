from django.urls import path
#from .views import*
from .views import ProfileUpdate,OtherUserProfileView, FollowUnfollow,UserProfileView,ProfileDetailView,FollowingListView,SearchProfileView,PublicProfileView

urlpatterns = [
    path('user/profile/', UserProfileView.as_view(), name='user-profile'),
    path('profile/<uuid:user_id>/', OtherUserProfileView.as_view(), name='other-user-profile'),
    path('profile/update/', ProfileUpdate.as_view(), name='profile-update'),
    path('profile/<int:user_id>/', ProfileDetailView.as_view(), name='profile-detail'),
    path('profile/following/', FollowingListView.as_view(), name='profile-following-list'),
    path('profile/follow/<int:user_id>/<str:action>/', FollowUnfollow.as_view(), name='profile-follow-unfollow'),  # Follow/Unfollow a user
    path("search/", SearchProfileView.as_view(), name="search-profile"),  # New search route
    path("user/profile/public/<int:user_id>/", PublicProfileView.as_view(), name="public-profile"),
]



