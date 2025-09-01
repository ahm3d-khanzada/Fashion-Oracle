
from rest_framework import serializers
from .models import Post,CommentLike,Comment,Notification,Like
from profile_management.models import Profile

from rest_framework import serializers
from .models import Post, Like
from profile_management.models import Profile


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['comment_id', 'user', 'post', 'text', 'created_at', 'updated_at']
        read_only_fields = ['comment_id', 'user', 'created_at', 'updated_at']


class PostSerializer(serializers.ModelSerializer):
    likes = serializers.IntegerField(source='likes.count', read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    profile_pic = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    isLiked = serializers.SerializerMethodField()
    is_verified = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'post_id', 'username', 'profile_pic', 'media', 'caption',
            'created_at', 'updated_at', 'likes', 'comments', 'isLiked', 'is_verified'
        ]
        extra_kwargs = {
            'caption': {'required': False, 'allow_blank': True}
        }

    def get_username(self, obj):
        return obj.user.email.split('@')[0] if obj.user and obj.user.email else None

    def get_isLiked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return obj.likes.count() > 0

    def get_profile_pic(self, obj):
     try:
        # Check if the user has a profile and profile_pic
        if hasattr(obj.user, 'profile') and obj.user.profile.profile_pic:
            profile_pic = obj.user.profile.profile_pic
            if hasattr(profile_pic, 'url'):
                return self.context['request'].build_absolute_uri(profile_pic.url)
     except Exception as e:
       
        print(f"Error fetching profile_pic: {e}")
     return 'http://localhost:8000/media/profile_pic/default.png'  # Return default if profile_pic is not available


    def get_is_verified(self, obj):
        return obj.likes.count() >= 3000

    def validate_media(self, value):
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("File size must be less than 10MB")
        if not value.name.lower().endswith(('png', 'jpg', 'jpeg', 'mp4', 'avi', 'mov')):
            raise serializers.ValidationError("Media file must be an image or video format.")
        return value

    def get_media(self, obj):
        if obj.media:
            return self.context['request'].build_absolute_uri(obj.media.url)
        return None

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['comment_id', 'user', 'post', 'text', 'created_at', 'updated_at', 'username']
        read_only_fields = ['comment_id', 'user', 'created_at', 'updated_at']

    def get_username(self, obj):
        # Assuming user.email is used and username is before '@'
        if obj.user and obj.user.email:
            return obj.user.email.split('@')[0]
        return ""
class CommentLikeSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Display the user's name or email
    comment = serializers.StringRelatedField()  # Display the comment's ID

    class Meta:
        model = CommentLike
        fields = ['user', 'comment', 'created_at']



#serializer.py
class NotificationSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    post_id = serializers.UUIDField(source="post.post_id", read_only=True)
    comment_id = serializers.UUIDField(source="comment.comment_id", read_only=True)
    like_id = serializers.SerializerMethodField()
    follow_id = serializers.SerializerMethodField()
    message = serializers.SerializerMethodField()  # <-- NEW FIELD

    class Meta:
        model = Notification
        fields = ["id", "sender", "notification_type", "post_id", "comment_id", "like_id", "follow_id", "is_read", "created_at", "message"]

    def get_sender(self, obj):
        if obj.sender:
            request = self.context.get('request')
            sender_info = {
                "id": obj.sender.id,
                "username": obj.sender.email.split('@')[0] if obj.sender.email else None,
                "first_name": obj.sender.first_name,
                "last_name": obj.sender.last_name,
                "profile_pic": None
            }
            try:
                if hasattr(obj.sender, 'profile') and obj.sender.profile.profile_pic:
                    profile_pic = obj.sender.profile.profile_pic
                    if hasattr(profile_pic, 'url') and request:
                        sender_info["profile_pic"] = request.build_absolute_uri(profile_pic.url)
            except Exception as e:
                print(f"Error fetching sender profile pic: {e}")
            if not sender_info["profile_pic"]:
                sender_info["profile_pic"] = 'http://localhost:8000/media/profile_pic/default.png'
            return sender_info
        return None

    def get_like_id(self, obj):
        if obj.notification_type == "like" and obj.post:
            like = Like.objects.filter(user=obj.sender, post=obj.post).first()
            return like.id if like else None
        return None

    def get_follow_id(self, obj):
        return obj.id if obj.notification_type == "follow" else None

    def get_post_notification_id(self, obj):
        return obj.id if obj.notification_type == "new_post" else None

    def get_message(self, obj):
        username = obj.sender.email.split('@')[0] if obj.sender and obj.sender.email else "Someone"
        if obj.notification_type == "like":
            return f"{username} liked your post"
        elif obj.notification_type == "comment":
            return f"{username} commented on your post"
        elif obj.notification_type == "follow":
            return f"{username} started following you"
        elif obj.notification_type == "new_post":
            return f"{username} uploaded a new post"
        else:
            return f"{username} sent you a notification"

    def get_notification_count(self, obj):
        # Count unread notifications for the user
        user = self.context.get('request').user
        return Notification.objects.filter(user=user, is_read=False).count()