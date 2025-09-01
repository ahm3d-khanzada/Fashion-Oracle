# urls.py (Update to include VTON history endpoint)
from django.urls import path
from .views import UploadClothImage, UploadHumanImage, PerformVirtualTryOn, VTONHistoryView

urlpatterns = [
    path('upload-cloth/', UploadClothImage.as_view(), name='upload-cloth'),
    path('upload-human/', UploadHumanImage.as_view(), name='upload-human'),
    path('virtual-try-on/', PerformVirtualTryOn.as_view(), name='virtual-try-on'),
    path('vton-history/', VTONHistoryView.as_view(), name='vton-history'),
]