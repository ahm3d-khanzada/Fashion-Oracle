from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404
from .models import UploadedImage, Recommendation
from .serializer import UploadedImageSerializer, RecommendationSerializer
import torch
from torch import nn
import os
import uuid
from django.conf import settings
from torchvision import transforms, models
from PIL import Image, ImageEnhance
import numpy as np

# Model loading and helper functions
CLASSIFIER_PATH = os.path.join(settings.BASE_DIR, r'F:\Connecting (1)\Connecting\BACKEND\best_clothing_classifier.pth')
GENERATOR_PATH = os.path.join(settings.BASE_DIR, r'F:\Connecting (1)\Connecting\BACKEND\cgan_model.pth')
CLASS_LABELS = ['Full dress', 'Lower wear', 'Upper wear']

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Classifier loading
def load_classifier(model_path):
    model = models.resnet18(pretrained=False)
    model.fc = nn.Linear(model.fc.in_features, 3)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()
    return model

classifier = load_classifier(CLASSIFIER_PATH).to(device)

# Generator model
class Generator(nn.Module):
    def __init__(self, z_dim=100, num_classes=3, channels=3, hidden_dim=64):
        super(Generator, self).__init__()
        self.input_dim = z_dim + num_classes

        self.input_layer = nn.Sequential(
            nn.Linear(self.input_dim, hidden_dim * 16 * 4 * 4),
            nn.BatchNorm1d(hidden_dim * 16 * 4 * 4),
            nn.ReLU(inplace=True)
        )

        self.gen = nn.Sequential(
            nn.ConvTranspose2d(hidden_dim * 16, hidden_dim * 8, 4, 2, 1),
            nn.BatchNorm2d(hidden_dim * 8),
            nn.ReLU(inplace=True),
            nn.ConvTranspose2d(hidden_dim * 8, hidden_dim * 4, 4, 2, 1),
            nn.BatchNorm2d(hidden_dim * 4),
            nn.ReLU(inplace=True),
            nn.ConvTranspose2d(hidden_dim * 4, hidden_dim * 2, 4, 2, 1),
            nn.BatchNorm2d(hidden_dim * 2),
            nn.ReLU(inplace=True),
            nn.ConvTranspose2d(hidden_dim * 2, hidden_dim, 4, 2, 1),
            nn.BatchNorm2d(hidden_dim),
            nn.ReLU(inplace=True),
            nn.ConvTranspose2d(hidden_dim, channels, 4, 2, 1),
            nn.Tanh()
        )

    def forward(self, noise, labels):
        x = torch.cat([noise, labels], dim=1)
        x = self.input_layer(x)
        x = x.view(-1, 64*16, 4, 4)
        return self.gen(x)

generator = Generator(z_dim=100, num_classes=3, channels=3, hidden_dim=64).to(device)
checkpoint = torch.load(GENERATOR_PATH, map_location=device)
generator.load_state_dict(checkpoint['generator_state_dict'])
generator.eval()

# Image processing functions
def preprocess_image(image_path):
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    img = Image.open(image_path).convert("RGB")
    return transform(img).unsqueeze(0)

def classify_image(model, img_tensor, class_labels):
    with torch.no_grad():
        outputs = model(img_tensor)
    probs = torch.nn.functional.softmax(outputs, dim=1)
    return class_labels[torch.argmax(probs)], probs.squeeze().tolist()

def enhance_pil(image_pil):
    enhancer = ImageEnhance.Sharpness(image_pil)
    image_pil = enhancer.enhance(1.5)
    enhancer = ImageEnhance.Contrast(image_pil)
    image_pil = enhancer.enhance(1.0)
    enhancer = ImageEnhance.Brightness(image_pil)
    image_pil = enhancer.enhance(0.8)
    return image_pil

def generate_complementary(generator, predicted_class, class_labels, device):
    class_mapping = {
        'Full dress': 'Full dress',
        'Lower wear': 'Upper wear',
        'Upper wear': 'Lower wear'
    }
    target_class = class_mapping.get(predicted_class, 'Full dress')
    target_idx = class_labels.index(target_class)
    label = torch.zeros(1, len(class_labels)).to(device)
    label[0, target_idx] = 1
    noise = torch.randn(1, 100).to(device)
    with torch.no_grad():
        generated = generator(noise, label)
    return (generated.squeeze().permute(1, 2, 0).cpu().numpy() + 1) / 2

# Image upload API
class ImageUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = UploadedImageSerializer(data=request.data)
        if serializer.is_valid():
            image_file = request.FILES['image']
            
            # Ensure the uploads directory exists
            uploads_dir = os.path.join(settings.MEDIA_ROOT, 'uploads')
            os.makedirs(uploads_dir, exist_ok=True)

            # Save image to the uploads directory
            temp_path = os.path.join(uploads_dir, f"{uuid.uuid4()}.jpg")
            with open(temp_path, 'wb+') as f:
                for chunk in image_file.chunks():
                    f.write(chunk)

            # Classify image
            img_tensor = preprocess_image(temp_path).to(device)
            pred_class, _ = classify_image(classifier, img_tensor, CLASS_LABELS)

            if pred_class not in CLASS_LABELS:
                os.remove(temp_path)  # Remove the temp file if classification fails
                return Response({"error": "Invalid image category"}, status=400)

            # Save to database
            instance = serializer.save(
                user=request.user,
                class_label=pred_class,
                image=f"uploads/{os.path.basename(temp_path)}"
            )

            return Response({
                "id": instance.id,
                "imageUrl": request.build_absolute_uri(instance.image.url),
                "classLabel": pred_class
            }, status=201)

        return Response(serializer.errors, status=400)

class RecommendationView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def post(self, request):
        print("🚀 Received request data:", request.data)

        # Extract imageId safely
        image_id = request.data.get('imageId') or request.data.get('image_id')

        if not image_id:
            return Response({"error": "Missing 'imageId' in request"}, status=400)

        try:
            image_id = int(image_id)
            uploaded_image = UploadedImage.objects.get(id=image_id, user=request.user)
        except ValueError:
            return Response({"error": "Invalid imageId format"}, status=400)
        except UploadedImage.DoesNotExist:
            return Response({"error": "Image not found in database"}, status=404)

        print("✅ Found Uploaded Image:", uploaded_image)

        # Process the image and generate recommendation
        image_path = uploaded_image.image.path
        img_tensor = preprocess_image(image_path).to(device)

        # Predict class
        pred_class, _ = classify_image(classifier, img_tensor, CLASS_LABELS)
        print(f"✅ Predicted Class: {pred_class}")

        # Generate complementary image
        generated_image = generate_complementary(generator, pred_class, CLASS_LABELS, device)

        # Convert generated image to a saveable format
        generated_image = (generated_image * 255).astype(np.uint8)
        pil_image = Image.fromarray(generated_image)
        pil_image = pil_image.resize((128, 128))  # Resize to 128x128
        pil_image = enhance_pil(pil_image)  # Apply enhancements

        # Ensure the generated directory exists
        generated_dir = os.path.join(settings.MEDIA_ROOT, 'generated')
        os.makedirs(generated_dir, exist_ok=True)

        # Save the generated image
        gen_image_name = f"generated/{uuid.uuid4()}.jpg"
        full_path = os.path.join(settings.MEDIA_ROOT, gen_image_name)
        pil_image.save(full_path)

        # Save recommendation to DB
        recommendation = Recommendation.objects.create(
            uploaded_image=uploaded_image,
            generated_image=gen_image_name
        )

        return Response({
            "recommendationId": recommendation.id,
            "recommendationUrl": request.build_absolute_uri(settings.MEDIA_URL + gen_image_name)
        })