
from rest_framework import serializers
from home.models import User
from home.utils import validate_email as validate_email_function
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import send_mail
from django.urls import reverse
from django.contrib.auth import get_user_model

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password']
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 8, 'help_text': 'Password must be at least 8 characters long'},
            'email': {'required': True, 'help_text': 'A valid email address is required'},
            'first_name': {'required': True, 'help_text': 'First name is required'},
            'last_name': {'required': True, 'help_text': 'Last name is required'}
        }

    def validate_email(self, value):
        if not validate_email_function(value):
            raise serializers.ValidationError("Invalid  email address.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password']
        )
        user.is_active = False
        user.save()
        return user

class EmailVerificationSerializer(serializers.Serializer):
    token = serializers.CharField()

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            raise serializers.ValidationError({"error": "Email and password are required."})

        user = authenticate(email=email, password=password)
        if user is None:
            raise serializers.ValidationError({"error": "Invalid email or password."})

        data['user'] = user
        return data

    
class dashboardSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('email', 'username', 'name')

    def get_name(self, obj):
        first_name = obj.first_name or ''
        last_name = obj.last_name or ''
        return f"{first_name} {last_name}".strip()

    def get_username(self, obj):
        return obj.email.split('@')[0] if obj.email else ''
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate(self, attrs):
        user = self.context['user']
        old_password = attrs.get('old_password')
        new_password = attrs.get('new_password')

        if not user.check_password(old_password):
            raise serializers.ValidationError({"old_password": "Old password is not correct"})
        if old_password == new_password:
            raise serializers.ValidationError({"new_password": "New password cannot be the same as the old password"})
        return attrs

    def save(self, **kwargs):
        user = self.context['user']
        new_password = self.validated_data['new_password']

        # Set and then it will hash new password
        user.set_password(new_password)
        user.save()




User = get_user_model()

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("No user is associated with this email address.")
        return value

    def save(self, request):
        user = User.objects.get(email=self.validated_data['email'])
        token_generator = PasswordResetTokenGenerator()

        uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
        token = token_generator.make_token(user)

        frontend_url = f"http://localhost:5173/#/reset-password/{uidb64}/{token}/"

        email_body = f"""
        Hello {user.first_name},

        You requested a password reset. Use the link below to reset your password:
        {frontend_url}

        If you didn't request a password reset, please ignore this email.
        """

        send_mail(
            subject="Password Reset Request",
            message=email_body,
            from_email=None,
            recipient_list=[self.validated_data['email']],
        )


from django.contrib.auth.password_validation import validate_password  # Import the validator

class PasswordResetConfirmSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)

    def validate(self, data):
        password = data.get('password')
        password2 = data.get('password2')
        if password != password2:
            raise serializers.ValidationError("Passwords do not match.")
        validate_password(password) 

        try:
            uidb64 = self.context.get('uidb64')
            token = self.context.get('token')
            user_id = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=user_id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise serializers.ValidationError('Token is invalid or expired.')
            data['user'] = user

        except DjangoUnicodeDecodeError:
            raise serializers.ValidationError('Token is invalid or expired.')
        return data
    def save(self):
        password = self.validated_data['password']
        user = self.validated_data['user']
        user.set_password(password)
        user.save()

