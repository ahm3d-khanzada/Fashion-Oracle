
from django.urls import path
from .views import CreatePostView,PostListView, PostDetailView, DeleteView,LikePostView
from .views import  *
urlpatterns = [
    path('create/', CreatePostView.as_view(), name='create-post'),
    path('posts/', PostListView.as_view(), name='post-list'),
    path('<uuid:post_id>/', PostDetailView.as_view(), name='post-detail'),  # Using UUID in the URL
    path('delete/<uuid:post_id>/', DeleteView.as_view(), name='delete-post'),
    path('posts/<uuid:post_id>/like/', LikePostView.as_view(), name='post-like'),

    path('comments/', ListCommentView.as_view(), name='comment-list'),
    path('comments/create/', CreateCommentView.as_view(), name='comment-create'),
    #path('comments/<uuid:pk>/', UpdateCommentView.as_view(), name='comment-update'),
    path('comments/<uuid:pk>/delete/', DeleteCommentView.as_view(), name='comment-delete'),
    #path('comments/<uuid:comment_id>/like/', LikeCommentView.as_view(), name='comment-like'),
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/read/<uuid:pk>/', MarkNotificationAsReadView.as_view(), name='mark-notification-read'),

]

