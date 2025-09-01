from rest_framework import serializers
from .models import GeneratedImage
from django.contrib.auth import get_user_model

User = get_user_model()

class GeneratedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedImage
        fields = ['id', 'prompt', 'negative_prompt', 'image_data', 'created_at']
        read_only_fields = ['id', 'image_data', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']