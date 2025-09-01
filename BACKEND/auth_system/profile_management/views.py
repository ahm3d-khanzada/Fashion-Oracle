""" # Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Profile
from .serializers import ProfileSerializer
from home.models import User
from rest_framework.exceptions import NotFound

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        profile = user.profile  # This will automatically get the profile due to the OneToOne relationship
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)


class OtherUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id, *args, **kwargs):
        try:
            user = User.objects.get(id=user_id)
            profile = user.profile  # OneToOne relationship
        except User.DoesNotExist:
            raise NotFound("User not found.")
        except Profile.DoesNotExist:
            raise NotFound("Profile not found.")

        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

class ProfileUpdate(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request):
        
        profile = request.user.profile
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from community.models import Notification
from community.serializers import NotificationSerializer
from django.contrib.auth import get_user_model
User = get_user_model()

class FollowUnfollow(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id, action):
        try:
            user_to_follow = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        if request.user == user_to_follow:
            return Response({"error": "You cannot follow yourself."}, status=400)

        if action == "follow":
            request.user.profile.following.add(user_to_follow.profile)

            # Prevent duplicate follow notifications
            if not Notification.objects.filter(
                sender=request.user, receiver=user_to_follow, notification_type="follow"
            ).exists():
                Notification.objects.create(
                    sender=request.user,
                    receiver=user_to_follow,
                    notification_type="follow"
                )

            return Response({"message": "Successfully followed the user."}, status=200)  

        elif action == "unfollow":
            request.user.profile.following.remove(user_to_follow.profile)

            # Del follow notification when unfollowing
            Notification.objects.filter(sender=request.user, receiver=user_to_follow, notification_type="follow").delete()

            return Response({"message": "Successfully unfollowed the user."}, status=200)

        return Response({"error": "Invalid action. Use 'follow' or 'unfollow'."}, status=400)



from community.models import Post                                # AS posts are inside community
from community.serializers import PostSerializer                 # AS posts are inside community


class ProfileDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            target_user = User.objects.get(id=user_id)
            profile = target_user.profile
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Optional: still include is_following field for UI
        is_following = request.user.profile.following.filter(id=profile.id).exists()

        posts = Post.objects.filter(user=target_user).order_by("-created_at")
        post_serializer = PostSerializer(posts, many=True)

        data = ProfileSerializer(profile).data
        data["is_following"] = is_following
        data["posts"] = post_serializer.data

        return Response(data, status=status.HTTP_200_OK)

class FollowingListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        following_profiles = request.user.profile.following.all()
        serializer = ProfileSerializer(following_profiles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



from .serializers import SearchSerializer
class SearchProfileView(APIView):
    def get(self, request):
        query = request.query_params.get("username", None)  # Get search query from URL
        if not query:
            return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

        profiles = Profile.objects.filter(user__email__icontains=query)  # Search in email
        
        if not profiles.exists():
            return Response({"message": "No users found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = SearchSerializer(profiles, many=True, context={"request": request})  # Pass request context
        return Response(serializer.data, status=status.HTTP_200_OK)


from rest_framework import generics
# Use existing profile serializer

class PublicProfileView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    lookup_field = "user_id"  
    permission_classes = []  # No authentication required
 """

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Profile
from .serializers import ProfileSerializer, SearchSerializer
from home.models import User
from community.models import Post, Notification
from community.serializers import PostSerializer, NotificationSerializer
from django.contrib.auth import get_user_model
from rest_framework import generics

User = get_user_model()

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        try:
            profile = user.profile
        except Profile.DoesNotExist:
            profile = Profile.objects.create(user=user)
        serializer = ProfileSerializer(profile, context={'request': request})
        posts = Post.objects.filter(user=user).order_by("-created_at")
        post_serializer = PostSerializer(posts, many=True, context={'request': request})
        data = serializer.data
        data['is_following'] = False
        data['posts'] = post_serializer.data
        return Response(data)

class ProfileUpdate(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request):
        user = request.user
        try:
            profile = user.profile
        except Profile.DoesNotExist:
            profile = Profile.objects.create(user=user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FollowUnfollow(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id, action):
        try:
            user_to_follow = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        if request.user == user_to_follow:
            return Response({"error": "You cannot follow yourself."}, status=400)

        if action == "follow":
            request.user.profile.following.add(user_to_follow.profile)
            if not Notification.objects.filter(
                sender=request.user, receiver=user_to_follow, notification_type="follow"
            ).exists():
                Notification.objects.create(
                    sender=request.user,
                    receiver=user_to_follow,
                    notification_type="follow"
                )
            return Response({"message": "Successfully followed the user."}, status=200)

        elif action == "unfollow":
            request.user.profile.following.remove(user_to_follow.profile)
            Notification.objects.filter(sender=request.user, receiver=user_to_follow, notification_type="follow").delete()
            return Response({"message": "Successfully unfollowed the user."}, status=200)

        return Response({"error": "Invalid action. Use 'follow' or 'unfollow'."}, status=400)

class ProfileDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            target_user = User.objects.get(id=user_id)
            profile = target_user.profile
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Profile.DoesNotExist:
            profile = Profile.objects.create(user=target_user)

        is_following = request.user.profile.following.filter(id=profile.id).exists()
        posts = Post.objects.filter(user=target_user).order_by("-created_at")
        post_serializer = PostSerializer(posts, many=True, context={'request': request})
        data = ProfileSerializer(profile, context={'request': request}).data
        data["is_following"] = is_following
        data["posts"] = post_serializer.data
        return Response(data, status=status.HTTP_200_OK)

class FollowingListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        following_profiles = request.user.profile.following.all()
        serializer = ProfileSerializer(following_profiles, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class SearchProfileView(APIView):
    def get(self, request):
        query = request.query_params.get("username", None)
        if not query:
            return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

        profiles = Profile.objects.filter(user__email__icontains=query)
        if not profiles.exists():
            return Response({"message": "No users found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = SearchSerializer(profiles, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)
from rest_framework.exceptions import NotFound
class PublicProfileView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    lookup_field = "user_id"
    permission_classes = []
    def get_serializer_context(self):
        return {'request': self.request}
    
class OtherUserProfileView(APIView):
      permission_classes = [IsAuthenticated]

      def get(self, request, user_id, *args, **kwargs):
        try:
            user = User.objects.get(id=user_id)
            profile = user.profile  # OneToOne relationship
        except User.DoesNotExist:
            raise NotFound("User not found.")
        except Profile.DoesNotExist:
            raise NotFound("Profile not found.")

        serializer = ProfileSerializer(profile)
        return Response(serializer.data)