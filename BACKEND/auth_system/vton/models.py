# models.py (Updated to use settings.AUTH_USER_MODEL)
from django.db import models
from django.conf import settings

class ClothImage(models.Model):
    image = models.ImageField(upload_to='cloth_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

class HumanImage(models.Model):
    image = models.ImageField(upload_to='human_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

class VTONHistory(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='vton_history')
    cloth_image = models.ForeignKey(ClothImage, on_delete=models.SET_NULL, null=True, related_name='vton_records')
    human_image = models.ForeignKey(HumanImage, on_delete=models.SET_NULL, null=True, related_name='vton_records')
    generated_image = models.ImageField(upload_to='vton_results/')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']  # Latest records first