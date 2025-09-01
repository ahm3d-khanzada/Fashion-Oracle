 

from rest_framework import generics, status, permissions
from .models import Post, Like, Notification, Comment
from .serializers import PostSerializer, NotificationSerializer, CommentSerializer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from django.core.exceptions import ValidationError



# Create Post
class CreatePostView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
        
    def create(self, request, *args, **kwargs):
        # Make sure the request data is mutable
        mutable_data = request.data.copy()
        mutable_data['user'] = request.user.id
        serializer = self.get_serializer(data=mutable_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


# views.py
# views.py
class PostListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Post.objects.all().select_related('user__profile').order_by('-created_at')
    serializer_class = PostSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request  # Pass the request context
        return context


# Retrieve Post
class PostDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = 'post_id'


# Delete Post
class DeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer
    lookup_field = 'post_id'

    def get_queryset(self):
        if self.request.user.is_admin:
            return Post.objects.all()
        return Post.objects.filter(user=self.request.user)


#  List Comments for a Post
class ListCommentView(generics.ListAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = CommentSerializer

    def get_queryset(self):
        post_id = self.request.query_params.get('post_id')
        if not post_id:
            return Comment.objects.none()  # Empty queryset if no post_id provided
        return Comment.objects.filter(post_id=post_id)


# Create Comment
class CreateCommentView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        comment = serializer.save(user=self.request.user)
        post = comment.post
        if post.user != self.request.user:
            Notification.objects.get_or_create(
                sender=self.request.user, receiver=post.user,
                notification_type="comment", post=post, comment=comment
            )





class DeleteCommentView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise ValidationError("You can only delete your own comments.")
        instance.delete()


# Like or Unlike Post
from rest_framework.views import APIView
class LikePostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        post = get_object_or_404(Post, post_id=post_id)
        like, created = Like.objects.get_or_create(user=request.user, post=post)

        if created:
            # Create notification
            if post.user != request.user:
                Notification.objects.get_or_create(
                    sender=request.user,
                    receiver=post.user,
                    notification_type="like",
                    post=post
                )
            message = "Post liked successfully."
            liked = True
        else:
            # Remove like and notification
            Notification.objects.filter(
                sender=request.user,
                receiver=post.user,
                notification_type="like",
                post=post
            ).delete()
            like.delete()
            message = "Post unliked successfully."
            liked = False

        # Get updated like count
        like_count = Like.objects.filter(post=post).count()

        return Response({
            "message": message,
            "liked": liked,
            "likes": like_count
        }, status=status.HTTP_200_OK)
#view.py

# List Notifications
class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(receiver=self.request.user, is_read=False).order_by('-created_at')


# Mark Notification as Read
class MarkNotificationAsReadView(generics.UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "pk"

    def get_queryset(self):
        return Notification.objects.filter(receiver=self.request.user)

    def perform_update(self, serializer):
        serializer.instance.is_read = True
        serializer.save()
