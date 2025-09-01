from rest_framework import serializers
from .models import Profile
from django.urls import reverse

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    postsCount = serializers.IntegerField(source='post_count', read_only=True)
    followersCount = serializers.IntegerField(source='follower_count', read_only=True)
    followingCount = serializers.IntegerField(source='following_count', read_only=True)
    fullName = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    profile_pic = serializers.ImageField(required=False, allow_null=True, write_only=True)

    class Meta:
        model = Profile
        fields = [
            'user_id', 'username', 'fullName', 'bio', 'profile_pic', 'image',
            'postsCount', 'followersCount', 'followingCount', 'updated_at'
        ]
        read_only_fields = [
            'user_id', 'username', 'fullName', 'image',
            'postsCount', 'followersCount', 'followingCount', 'updated_at'
        ]

    def get_username(self, obj):
        return obj.user.email.split("@")[0]

    def get_fullName(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or None

    def get_image(self, obj):
        if obj.profile_pic and hasattr(obj.profile_pic, 'url'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_pic.url)
        return 'http://localhost:8000/media/profile_pic/default.png'

    def validate(self, data):
        if not self.instance and 'profile_pic' not in data:
            raise serializers.ValidationError({"profile_pic": "A profile picture is required for new profiles."})
        return data


class SearchSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    profile_url = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ["username", "full_name", "image", "profile_url"]

    def get_username(self, obj):
        return obj.user.email.split("@")[0]

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or None

    def get_profile_url(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(
            reverse("public-profile", kwargs={"user_id": obj.user.id})
        )

    def get_image(self, obj):
        if obj.profile_pic and hasattr(obj.profile_pic, 'url'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_pic.url)
        return 'http://localhost:8000/media/profile_pic/default.png'
