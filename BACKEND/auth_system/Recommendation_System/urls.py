# recommendation/urls.py
from django.urls import path
from .views import ImageUploadView, RecommendationView

urlpatterns = [
    path('upload/', ImageUploadView.as_view(), name='image-upload'),
    path('recommend/', RecommendationView.as_view(), name='get-recommendation'),
]