# views.py (Fixed to handle serializer validation and add debugging)
from PIL import Image
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .models import ClothImage, HumanImage, VTONHistory
from .serializers import ClothImageSerializer, HumanImageSerializer, VTONHistorySerializer
from rest_framework.permissions import IsAuthenticated
from .utils import save_temp_file
from .viton_pipeline import run_virtual_tryon_pipeline
import os
from django.conf import settings
import shutil
import logging

# Set up logging
logger = logging.getLogger(__name__)

def validate_image_type(image, expected_type):
    valid_extensions = {"png", "jpg", "jpeg"}
    file_extension = image.name.split('.')[-1].lower()

    if file_extension not in valid_extensions:
        raise ValidationError(f"Invalid {expected_type} image. Please upload a PNG, JPG, or JPEG image.")
    
    try:
        img = Image.open(image)
        img.verify()
    except Exception:
        raise ValidationError("Invalid image file.")

class UploadClothImage(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        logger.debug(f"UploadClothImage received data: {request.FILES}")
        serializer = ClothImageSerializer(data=request.data)
        if serializer.is_valid():
            try:
                validate_image_type(request.FILES['image'], "cloth")
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                logger.error(f"Validation error in UploadClothImage: {str(e)}")
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        logger.error(f"Serializer errors in UploadClothImage: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UploadHumanImage(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        logger.debug(f"UploadHumanImage received data: {request.FILES}")
        serializer = HumanImageSerializer(data=request.data)
        if serializer.is_valid():
            try:
                validate_image_type(request.FILES['image'], "human")
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                logger.error(f"Validation error in UploadHumanImage: {str(e)}")
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        logger.error(f"Serializer errors in UploadHumanImage: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PerformVirtualTryOn(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        logger.debug(f"PerformVirtualTryOn received files: {request.FILES}")
        cloth_image = request.FILES.get('clothImage')
        human_image = request.FILES.get('humanImage')

        if not cloth_image or not human_image:
            error_msg = "Both cloth and human images are required."
            logger.error(error_msg)
            return Response({"error": error_msg}, status=status.HTTP_400_BAD_REQUEST)

        # Validate image types first
        try:
            validate_image_type(cloth_image, "cloth")
            validate_image_type(human_image, "human")
        except ValidationError as e:
            logger.error(f"Image validation error: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Save images directly to models, bypassing strict serializer validation
        try:
            cloth_instance = ClothImage.objects.create(image=cloth_image)
            human_instance = HumanImage.objects.create(image=human_image)
        except Exception as e:
            logger.error(f"Error saving images to database: {str(e)}")
            return Response({"error": f"Failed to save images: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        cloth_path = save_temp_file(cloth_image, image_type="cloth")
        human_path = save_temp_file(human_image, image_type="human")
        logger.debug(f"Temp files saved: cloth={cloth_path}, human={human_path}")

        try:
            output_path = run_virtual_tryon_pipeline(human_path, cloth_path)
            logger.debug(f"Pipeline output: {output_path}")
            if not output_path or not os.path.exists(output_path):
                error_msg = "Virtual try-on pipeline failed to generate output."
                logger.error(error_msg)
                return Response({"error": error_msg}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Pipeline error: {str(e)}")
            return Response({"error": f"Pipeline error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Copy the generated image to media/vton_results/
        result_filename = f"vton_result_{request.user.id}_{int(cloth_instance.uploaded_at.timestamp())}.png"
        media_result_path = os.path.join(settings.MEDIA_ROOT, 'vton_results', result_filename)
        os.makedirs(os.path.dirname(media_result_path), exist_ok=True)
        shutil.copy(output_path, media_result_path)
        logger.debug(f"Generated image copied to: {media_result_path}")

        # Save VTON history
        result_url = request.build_absolute_uri("/static/finalimg.png")
        logger.debug(f"Result URL: {result_url}")
        vton_history = VTONHistory(
            user=request.user,
            cloth_image=cloth_instance,
            human_image=human_instance,
            generated_image=os.path.join('vton_results', result_filename)
        )
        vton_history.save()
        logger.debug(f"VTONHistory saved: user={request.user.id}, cloth={cloth_instance.id}, human={human_instance.id}")

        return Response({"result": result_url}, status=status.HTTP_200_OK)

class VTONHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        logger.debug(f"Fetching VTON history for user: {request.user.id}")
        vton_records = VTONHistory.objects.filter(user=request.user)[:3]
        serializer = VTONHistorySerializer(vton_records, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)