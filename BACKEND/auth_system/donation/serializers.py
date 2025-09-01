from rest_framework import serializers
from .models import Donation, DonationRequest, Rating
from home.models import User

class FileUploadSerializer(serializers.Serializer):
    file = serializers.ImageField()



class DonationSerializer(serializers.ModelSerializer):
    images = serializers.ListField(child=serializers.URLField(), required=False, max_length=3)
    clothType = serializers.CharField(source='cloth_type')
    season = serializers.CharField(source='seasonal_clothing')
    isAnonymous = serializers.BooleanField(source='anonymous')
    pickupAddress = serializers.CharField(source='pick_up_address')
    phoneNo = serializers.CharField(source='phone_no', required=True)

    class Meta:
        model = Donation
        fields = [
            'id', 'donor', 'full_name', 'city', 'phoneNo', 'email', 'username',
            'clothType', 'condition', 'gender', 'category', 'images', 'quantity',
            'size', 'season', 'pickupAddress', 'isAnonymous', 'status', 'created_at'
        ]
        read_only_fields = ['donor', 'status', 'created_at']

    def validate_images(self, value):
        if len(value) > 3:
            raise serializers.ValidationError("A maximum of 3 images can be uploaded.")
        return value

    def create(self, validated_data):
        cloth_type = validated_data.pop('cloth_type', None)
        seasonal_clothing = validated_data.pop('seasonal_clothing', None)
        anonymous = validated_data.pop('anonymous', False)
        pick_up_address = validated_data.pop('pick_up_address', None)
        phone_no = validated_data.pop('phone_no', None)

        # Get user from context
        user = self.context['request'].user

        # Derive full_name, email, and username
        full_name = f"{user.first_name} {user.last_name}".strip() if user.first_name or user.last_name else "Unknown"
        email = user.email
        username = user.email.split('@')[0] if email else "unknown"

        validated_data.update({
            'cloth_type': cloth_type,
            'seasonal_clothing': seasonal_clothing,
            'anonymous': anonymous,
            'pick_up_address': pick_up_address,
            'phone_no': phone_no,
            'full_name': full_name,
            'email': email,
            'username': username,
        })

        return super().create(validated_data)

    def update(self, instance, validated_data):
        cloth_type = validated_data.pop('cloth_type', None)
        seasonal_clothing = validated_data.pop('seasonal_clothing', None)
        anonymous = validated_data.pop('anonymous', False)
        pick_up_address = validated_data.pop('pick_up_address', None)
        phone_no = validated_data.pop('phone_no', None)

        # Get user from context
        user = self.context['request'].user

        # Derive full_name, email, and username
        full_name = f"{user.first_name} {user.last_name}".strip() if user.first_name or user.last_name else "Unknown"
        email = user.email
        username = user.email.split('@')[0] if email else "unknown"

        validated_data.update({
            'cloth_type': cloth_type,
            'seasonal_clothing': seasonal_clothing,
            'anonymous': anonymous,
            'pick_up_address': pick_up_address,
            'phone_no': phone_no,
            'full_name': full_name,
            'email': email,
            'username': username,
        })

        return super().update(instance, validated_data)
    
    
    
class DonationRequestSerializer(serializers.ModelSerializer):
    donation = DonationSerializer(read_only=True)
    donee = serializers.IntegerField(source='donee.id', read_only=True)  # Use User ID

    class Meta:
        model = DonationRequest
        fields = [
            'id', 'donation', 'donee', 'status', 'request_reason',
            'additional_info', 'phone_no', 'email', 'full_name', 'created_at'
        ]
        read_only_fields = ['donee', 'status', 'donation', 'created_at']

    def create(self, validated_data):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError({"donee": "Authentication is required."})
        donation = validated_data.get('donation')
        if donation.donor == request.user:
            raise serializers.ValidationError({"error": "You cannot request your own donation."})
        validated_data.pop('donee', None)
        return super().create({**validated_data, 'donee': request.user})

class RatingSerializer(serializers.ModelSerializer):
    reviewer = serializers.ReadOnlyField(source='reviewer.email')

    class Meta:
        model = Rating
        fields = "__all__"
        read_only_fields = ["reviewer"]

    def create(self, validated_data):
        request = self.context["request"]
        validated_data["reviewer"] = request.user
        donor_id = self.initial_data.get("donor")
        donee_id = self.initial_data.get("donee")
        if donor_id:
            try:
                validated_data["donor"] = User.objects.get(id=donor_id)
            except User.DoesNotExist:
                raise serializers.ValidationError({"donor": "Donor not found!"})
        if donee_id:
            try:
                validated_data["donee"] = User.objects.get(id=donee_id)
            except User.DoesNotExist:
                raise serializers.ValidationError({"donee": "Donee not found!"})
        return super().create(validated_data)

    def validate_score(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError("Score must be between 1 and 5.")
        return value

class ExpiredDonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = ['id', 'donor', 'status', 'created_at']