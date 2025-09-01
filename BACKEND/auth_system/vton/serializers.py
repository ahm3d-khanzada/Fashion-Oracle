from rest_framework import serializers
from .models import ClothImage, HumanImage, VTONHistory

class ClothImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothImage
        fields = ['id', 'image', 'uploaded_at']

class HumanImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HumanImage
        fields = ['id', 'image', 'uploaded_at']

class VTONHistorySerializer(serializers.ModelSerializer):
    cloth_image = ClothImageSerializer()
    human_image = HumanImageSerializer()
    generated_image = serializers.ImageField()

    class Meta:
        model = VTONHistory
        fields = ['id', 'cloth_image', 'human_image', 'generated_image', 'created_at']