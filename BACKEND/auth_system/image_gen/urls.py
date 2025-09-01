from django.urls import path
from .views import GenerateImageView, UserImagesView

urlpatterns = [
    path('generate/', GenerateImageView.as_view(), name='generate-image'),
    path('history/', UserImagesView.as_view(), name='user-images'),
]