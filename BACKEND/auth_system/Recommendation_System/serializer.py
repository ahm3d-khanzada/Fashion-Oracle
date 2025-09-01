# recommendation/serializers.py
from rest_framework import serializers
from .models import UploadedImage, Recommendation

class UploadedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedImage
        fields = ['id', 'image', 'uploaded_at']

class RecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommendation
        fields = ['id', 'generated_image', 'created_at']