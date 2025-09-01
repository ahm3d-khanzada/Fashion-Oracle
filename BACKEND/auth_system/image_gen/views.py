from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import GeneratedImage
from .serializers import GeneratedImageSerializer
from .utils.fashion_generator import FashionGenerator
from django.contrib.auth import get_user_model
import logging

logger = logging.getLogger(__name__)

class GenerateImageView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        generator = FashionGenerator()
        prompt = request.data.get('prompt', '')
        negative_prompt = request.data.get('negative_prompt', None)
        
        if not prompt:
            return Response(
                {"error": "Prompt is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Generate the image
            image_data = generator.generate(prompt, negative_prompt)
            
            # Save to database
            generated_image = GeneratedImage.objects.create(
                user=request.user,
                prompt=prompt,
                negative_prompt=negative_prompt,
                image_data=image_data
            )
            
            serializer = GeneratedImageSerializer(generated_image)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error generating image: {str(e)}")
            return Response(
                {"error": "Failed to generate image"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserImagesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        images = GeneratedImage.objects.filter(user=request.user).order_by('-created_at')
        serializer = GeneratedImageSerializer(images, many=True)
        return Response(serializer.data)