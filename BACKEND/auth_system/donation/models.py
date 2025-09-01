import uuid
from django.db import models
from django.utils import timezone
from datetime import timedelta
from home.models import User

class Donation(models.Model):
    STATUS_CHOICES = [
        ('live', 'Live'),
        ('requested', 'Requested'),
        ('approved', 'Approved'),
        ('completed', 'Completed'),
        ('expired', 'Expired'),
    ]
    CONDITION_CHOICES = [
        ('new_with_tag', 'New with Tag'),
        ('like_new', 'Like New'),
        ('good', 'Good'),
        ('fair', 'Fair'),
    ]
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('universal', 'Universal'),
    ]
    SEASON_CHOICES = [
        ('summer', 'Summer'),
        ('winter', 'Winter'),
        ('all_seasons', 'All Seasons'),
    ]
    SIZE_CHOICES = [
        ('small', 'Small'),
        ('medium', 'Medium'),
        ('large', 'Large'),
        ('xl', 'XL'),
        ('xxl', 'XXL'),
    ]
    CATEGORY_CHOICES = [
        ('shirts', 'Shirts'),
        ('pants', 'Pants'),
        ('jackets', 'Jackets'),
        ('shoes', 'Shoes'),
        ('accessories', 'Accessories'),
    ]

    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    donor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='donations')
    full_name = models.CharField(max_length=255, default="Unknown")
    city = models.CharField(max_length=100)
    phone_no = models.CharField(max_length=11)
    email = models.EmailField()
    username = models.CharField(max_length=150)
    cloth_type = models.CharField(max_length=255)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    images = models.JSONField(default=list)
    quantity = models.PositiveIntegerField()
    size = models.CharField(max_length=10, choices=SIZE_CHOICES)
    seasonal_clothing = models.CharField(max_length=20, choices=SEASON_CHOICES, default='all_seasons')
    pick_up_address = models.TextField()
    anonymous = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='live')
    created_at = models.DateTimeField(auto_now_add=True)

    def mark_fulfilled(self):
        self.status = 'completed'
        self.save()

class DonationRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('full_filled', 'Fulfilled'),
        ('rejected', 'Rejected'),
    ]
    REQUEST_REASON_CHOICES = [
        ('personal_need', 'Personal Need'),
        ('family_need', 'Family Need'),
        ('community_program', 'Community Program'),
        ('homeless_shelter', 'Homeless Shelter'),
        ('disaster_relief', 'Disaster Relief'),
        ('others', 'Others'),
    ]

    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    donation = models.ForeignKey(Donation, on_delete=models.CASCADE, related_name='requests')
    donee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='donation_requests')
    full_name = models.CharField(max_length=255, default="Unknown")
    email = models.EmailField()
    request_reason = models.CharField(max_length=50, choices=REQUEST_REASON_CHOICES)
    additional_info = models.TextField(blank=True, null=True)
    phone_no = models.CharField(max_length=11)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('donee', 'donation')

    def __str__(self):
        return f"Request by {self.donee.email} for {self.donation.cloth_type}"

    def approve(self):
        self.status = 'approved'
        self.save()
        DonationRequest.objects.filter(donation=self.donation).exclude(id=self.id).update(status='rejected')
        self.donation.status = 'approved'
        self.donation.save()

    def reject(self):
        self.status = 'rejected'
        self.save()

class Rating(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="given_ratings")
    donor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="donor_ratings", null=True, blank=True)
    donee = models.ForeignKey(User, on_delete=models.CASCADE, related_name="donee_ratings", null=True, blank=True)
    score = models.IntegerField(default=1)
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Rating {self.score} by {self.reviewer}"