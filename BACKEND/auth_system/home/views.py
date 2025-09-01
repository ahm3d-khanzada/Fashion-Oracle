from rest_framework import generics, status, response           # Registration
from django.urls import reverse
from django.contrib.sites.shortcuts import get_current_site
import jwt
from home.utils import Util
from rest_framework.permissions import AllowAny
from home.renderers import UserRenderer
from .import serializers, models
from .serializers import RegisterSerializer, LoginSerializer, EmailVerificationSerializer, ChangePasswordSerializer, PasswordResetSerializer, PasswordResetConfirmSerializer, dashboardSerializer
from django.conf import settings
  
from rest_framework_simplejwt.tokens import RefreshToken   # login
from django.contrib.auth import authenticate
from rest_framework.generics import GenericAPIView

from rest_framework.views import APIView                  # change_pass
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
            
from rest_framework.response import Response  # pass_rest
from django.shortcuts import render
from django.utils.encoding import smart_str
from django.contrib.auth import get_user_model
from django.http import Http404
from django.contrib.auth.tokens import PasswordResetTokenGenerator       # confirm_pass
from django.utils.http import urlsafe_base64_decode

from django.shortcuts import redirect
from rest_framework import response, status
from rest_framework import generics
import jwt
from django.conf import settings
from . import serializers, models
from datetime import datetime, timedelta

from rest_framework.exceptions import ValidationError  # Import this if not already

class RegisterView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = serializers.RegisterSerializer

    def post(self, request):
        data = request.data
        serializer = self.serializer_class(data=data)

        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            print("Registration validation error:", serializer.errors) 
            raise e 

        user = serializer.save()

        # Generate JWT token
        token_payload = {
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }
        token = jwt.encode(token_payload, settings.SECRET_KEY, algorithm='HS256')

        # Email verification link
        current_site = get_current_site(request).domain
        relative_link = reverse('email-verify')
        absurl = f"http://{current_site}{relative_link}?token={token}"

        email_body = f"""
        Hi {user.first_name},

        Please click the link below to verify your email:

        {absurl}

        This link will expire in 24 hours.

        Regards,
        Fashion Oracle Team
        """

        email_data = {
            'email_body': email_body,
            'to_email': user.email,
            'email_subject': 'Verify Your Email'
        }

        Util.send_email(email_data)

        return response.Response({
            'message': 'A verification link has been sent to your email. Please check your inbox.',
        }, status=status.HTTP_201_CREATED)


from django.http import HttpResponseRedirect  # Add this at the top

class VerifyEmail(generics.GenericAPIView):
    serializer_class = serializers.EmailVerificationSerializer

    def get(self, request):
        token = request.GET.get('token')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user = models.User.objects.get(id=payload['user_id'])

            if not user.is_verified:
                user.is_verified = True
                user.is_active = True
                user.save()

            # Real browser redirect
            return HttpResponseRedirect("http://localhost:5173/#/login")

        except jwt.ExpiredSignatureError:
            return HttpResponseRedirect("http://localhost:5173/#/expired-token")

        except jwt.exceptions.DecodeError:
            return HttpResponseRedirect("http://localhost:5173/#/invalid-token")
from rest_framework import status, response
from rest_framework.generics import GenericAPIView
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer

class LoginView(GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        user = authenticate(email=email, password=password)

        if user is None:
            return response.Response({'error': 'Invalid email or password.'}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)

        try:
            profile_pic = user.profile.profile_pic.url if user.profile.profile_pic else None
        except Exception:
            profile_pic = None

        return response.Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'id': user.id,
            'email': user.email,
            'username': user.email.split('@')[0],
            'name': f"{user.first_name} {user.last_name}".strip(),
            'is_admin': user.is_staff,
            'profile_pic': profile_pic  
        }, status=status.HTTP_200_OK)

class dashboardView(APIView):
  renderer_classes = [UserRenderer]
  permission_classes = [IsAuthenticated]
  def get(self, request, format=None):
    serializer = dashboardSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)

from rest_framework import status

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        serializer = ChangePasswordSerializer(data=request.data, context={'user': request.user})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        #Token Auth  del previous token then user is forced to relogin
        if hasattr(request.user, 'auth_token'):
            request.user.auth_token.delete()

        return Response({'msg': 'Password Changed Successfully'}, status=status.HTTP_200_OK)
    


class PasswordResetAPIView(APIView):
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(request=request)
            return Response({"message": "Password reset email sent"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


User = get_user_model()

class PasswordResetConfirmAPIView(APIView):
    def get(self, request, uidb64, token):
        try:
            user_id = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=user_id)
            token_generator = PasswordResetTokenGenerator()
            if not token_generator.check_token(user, token):
                raise Http404("Token is invalid or expired.")
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise Http404("Token is invalid or expired.")
        
        # If token is valid, render HTML page for password reset
        return render(request, 'pass_reset.html', {'uidb64': uidb64, 'token': token})

    def post(self, request, uidb64, token):
        context = {
            'uidb64': uidb64,
            'token': token,
        }
        serializer = PasswordResetConfirmSerializer(data=request.data, context=context)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Password has been reset successfully!"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)