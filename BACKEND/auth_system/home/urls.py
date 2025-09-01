
from django.urls import path

from .views import *


urlpatterns = [
    path('password-reset/', PasswordResetAPIView.as_view(), name='password_reset'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmAPIView.as_view(), name='password_reset_confirm'),
    path('register/', RegisterView.as_view(), name='register'),
    path('email-verify/', VerifyEmail.as_view(), name='email-verify'),
    path('login/', LoginView.as_view(), name='login'),
    path('dashboard/',dashboardView.as_view(), name='profile'),
    path('changepassword/', ChangePasswordView.as_view(), name='changepassword'),
   # path('send-email-reset-password/',SendPasswordResetEmailView.as_view(), name='send-reset-password-email'),


]




    
   