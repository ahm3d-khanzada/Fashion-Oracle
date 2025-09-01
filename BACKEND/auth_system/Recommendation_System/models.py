from django.db import models
from django.conf import settings

class UploadedImage(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    image = models.ImageField(upload_to='uploads/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    class_label = models.CharField(max_length=20, null=True)
    
    def __str__(self):
        return f"{self.user.email if self.user else 'Anonymous'}'s image"

class Recommendation(models.Model):
    uploaded_image = models.OneToOneField(UploadedImage, on_delete=models.CASCADE, related_name='recommendation')
    generated_image = models.URLField()  # URL to generated image
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Recommendation for {self.uploaded_image}"
