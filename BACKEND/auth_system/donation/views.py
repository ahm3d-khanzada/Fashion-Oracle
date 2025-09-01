from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta
from rest_framework.exceptions import ValidationError, PermissionDenied
from .models import Donation, DonationRequest, Rating
from .serializers import DonationSerializer, DonationRequestSerializer, RatingSerializer, FileUploadSerializer, ExpiredDonationSerializer
from home.models import User
from django.conf import settings
import os
from django.core.files.storage import default_storage
from django.db.models import Q

class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        files = request.FILES.getlist('file')
        if not files:
            return Response({"error": "No files provided"}, status=status.HTTP_400_BAD_REQUEST)

        file_urls = []
        for file in files:
            serializer = FileUploadSerializer(data={'file': file})
            if serializer.is_valid():
                file_path = os.path.join('donations', file.name)
                saved_path = default_storage.save(file_path, file)
                abs_path = os.path.join(settings.MEDIA_ROOT, saved_path)

                print("File saved at (relative):", saved_path)
                print("File saved at (absolute):", abs_path)
                print("File exists:", os.path.exists(abs_path))  # Check if really saved

                file_url = default_storage.url(abs_path)
                if not file_url.startswith('http'):
                    file_url = request.build_absolute_uri(file_url)
                file_urls.append(file_url)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"fileUrls": file_urls}, status=status.HTTP_201_CREATED)


class DonationCreateView(generics.CreateAPIView):
    serializer_class = DonationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        donor = self.request.user
        one_month_ago = timezone.now() - timedelta(days=30)
        monthly_donations = Donation.objects.filter(donor=donor, created_at__gte=one_month_ago).count()
        if monthly_donations >= 3:
            raise ValidationError({"error": "You can only donate 3 items per month."})
        serializer.save(donor=donor)

class DonationListView(generics.ListAPIView):
    serializer_class = DonationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Donation.objects.all()
        city = self.request.query_params.get('city')
        my_donations = self.request.query_params.get('my_donations')

        if my_donations == 'true':
            queryset = queryset.filter(donor=self.request.user)
        else:
            queryset = queryset.filter(status='live')

        if city:
            queryset = queryset.filter(city__iexact=city)

        return queryset

class DonationDetailView(generics.RetrieveAPIView):
    serializer_class = DonationSerializer
    lookup_field = "id"
    def get_queryset(self):
        return Donation.objects.filter(donor=self.request.user)

class DonationUpdateView(generics.UpdateAPIView):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def perform_update(self, serializer):
        donation = self.get_object()
        if donation.donor != self.request.user:
            raise PermissionDenied("You are not allowed to update this donation.")
        serializer.save()

class DonationDeleteView(generics.DestroyAPIView):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def perform_destroy(self, instance):
        if instance.donor != self.request.user:
            raise PermissionDenied("You are not allowed to delete this donation.")
        instance.delete()

class DonationRequestCreateView(generics.CreateAPIView):
    queryset = DonationRequest.objects.all()
    serializer_class = DonationRequestSerializer
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer):
        user = self.request.user
        donation_id = self.kwargs.get('donationId')
        if not donation_id:
            raise ValidationError({"error": "Donation ID is missing in the request."})
        donation = get_object_or_404(Donation, id=donation_id)
        if donation.donor == user:
            raise ValidationError({"error": "You cannot request your own donation."})
        existing_requests = DonationRequest.objects.filter(donation=donation).count()
        if existing_requests >= 4:
            raise ValidationError({"error": "This donation has already received the maximum of 4 requests."})
        one_month_ago = timezone.now() - timedelta(days=30)
        request_count = DonationRequest.objects.filter(donee=user, created_at__gte=one_month_ago).count()
        if request_count >= 3:
            raise ValidationError({"error": "You can only request 3 donations per month."})

        serializer.save(
            donee=user,
            donation=donation,
            email=self.request.data.get("email"),
            full_name=self.request.data.get("full_name")
        )

class DonationRequestListView(generics.ListAPIView):
    queryset = DonationRequest.objects.all()
    serializer_class = DonationRequestSerializer
    permission_classes = [IsAuthenticated]

class DonorDonationRequestListView(generics.ListAPIView):
    serializer_class = DonationRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DonationRequest.objects.filter(donation__donor=self.request.user)

class UserDonationRequestListView(generics.ListAPIView):
    serializer_class = DonationRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DonationRequest.objects.filter(donee=self.request.user)

class DonationRequestUpdateView(generics.UpdateAPIView):
    serializer_class = DonationRequestSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return DonationRequest.objects.filter(donee=self.request.user)

    def perform_update(self, serializer):
        donation_request = self.get_object()
        if donation_request.donee != self.request.user:
            raise PermissionDenied("You can only update your own requests.")
        serializer.save()

class DonationRequestDeleteView(generics.DestroyAPIView):
    queryset = DonationRequest.objects.all()
    serializer_class = DonationRequestSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def perform_destroy(self, instance):
        if instance.donee != self.request.user:
            raise PermissionDenied("You can only delete your own donation request.")
        instance.delete()

class ApproveDonationRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            donation_request = DonationRequest.objects.get(id=pk, status="pending")
            if donation_request.donation.donor != request.user:
                return Response(
                    {"error": "Only the donor can approve this request"},
                    status=status.HTTP_403_FORBIDDEN
                )
            donation_request.approve()
            return Response(
                {"message": "Donation request approved and others rejected"},
                status=status.HTTP_200_OK
            )
        except DonationRequest.DoesNotExist:
            return Response(
                {"error": "Request not found or already processed"},
                status=status.HTTP_404_NOT_FOUND
            )

class RejectDonationRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            donation_request = DonationRequest.objects.get(id=pk, status="pending")
            if donation_request.donation.donor != request.user:
                return Response(
                    {"error": "Only the donor can reject this request"},
                    status=status.HTTP_403_FORBIDDEN
                )
            donation_request.reject()
            return Response(
                {"message": "Donation request rejected"},
                status=status.HTTP_200_OK
            )
        except DonationRequest.DoesNotExist:
            return Response(
                {"error": "Request not found or already processed"},
                status=status.HTTP_404_NOT_FOUND
            )
class DonationStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        donation_request = DonationRequest.objects.filter(donation__id=id, donee=request.user).first()
        if not donation_request:
            return Response({"message": "You did not request this donation."}, status=404)
        return Response({"status": donation_request.status}, status=200)

class MarkDonationRequestFulfilledView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            donation_request = DonationRequest.objects.get(id=pk, donee=request.user, status='approved')
            donation_request.status = 'full_filled'
            donation_request.save()
            donation_request.donation.mark_fulfilled()
            return Response({'message': 'Donation request marked as fulfilled'}, status=status.HTTP_200_OK)
        except DonationRequest.DoesNotExist:
            return Response({'error': 'Donation request not found or not eligible for fulfillment'}, status=status.HTTP_404_NOT_FOUND)

class ExpireOldDonationsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        seven_days_ago = timezone.now() - timedelta(days=7)
        donations_to_expire = Donation.objects.filter(created_at__gte=seven_days_ago, status="live")
        expired_count = donations_to_expire.update(status="expired")
        serialized_data = ExpiredDonationSerializer(donations_to_expire, many=True).data
        return Response(
            {
                "message": f"Expired {expired_count} donation(s) from the last 7 days.",
                "expired_donations": serialized_data
            },
            status=status.HTTP_200_OK
        )

class SubmitRatingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, target_id):
        data = request.data.copy()
        data["reviewer"] = request.user.id
        try:
            target_user = User.objects.get(id=target_id)
        except User.DoesNotExist:
            return Response({"error": "Target user not found"}, status=status.HTTP_404_NOT_FOUND)

        donation_request = DonationRequest.objects.filter(
            (Q(donee=target_user, donation__donor=request.user, status="approved") |
             Q(donee=request.user, donation__donor=target_user, status="approved"))
        ).first()

        if not donation_request:
            return Response({"error": "No valid donation record found"}, status=status.HTTP_400_BAD_REQUEST)

        data["donor"] = donation_request.donation.donor.id
        data["donee"] = donation_request.donee.id

        serializer = RatingSerializer(data=data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetUserRatingsView(APIView):
    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        ratings = Rating.objects.filter(Q(donor=user) | Q(donee=user))
        serializer = RatingSerializer(ratings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class SubmitDonorRatingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, donorId):
        try:
            donor = User.objects.get(id=donorId)
        except User.DoesNotExist:
            return Response({"error": "Donor not found"}, status=status.HTTP_404_NOT_FOUND)

        approved_donations = Donation.objects.filter(
            donor=donor,
            requests__donee=request.user,
            requests__status="approved"
        ).exists()

        if not approved_donations:
            return Response({"error": "You can only rate a donor after an approved donation."}, status=status.HTTP_403_FORBIDDEN)

        score = request.data.get("score")
        if not score or not (1 <= int(score) <= 5):
            return Response({"error": "Score must be between 1 and 5."}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()
        data["donor"] = donor.id
        data["reviewer"] = request.user.id

        serializer = RatingSerializer(data=data, context={"request": request})
        if serializer.is_valid():
            serializer.save(reviewer=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SubmitDoneeRatingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, doneeId):
        try:
            donee = User.objects.get(id=doneeId)
        except User.DoesNotExist:
            return Response({"error": "Donee not found"}, status=status.HTTP_404_NOT_FOUND)

        approved_request_exists = DonationRequest.objects.filter(
            donee=donee,
            status="approved",
            donation__donor=request.user
        ).exists()

        if not approved_request_exists:
            return Response(
                {"error": "You can only rate a donee after an approved donation request."},
                status=status.HTTP_403_FORBIDDEN
            )

        score = request.data.get("score")
        if not score or not (1 <= int(score) <= 5):
            return Response({"error": "Score must be between 1 and 5."}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()
        data["donee"] = donee.id
        data["reviewer"] = request.user.id

        serializer = RatingSerializer(data=data, context={"request": request})
        if serializer.is_valid():
            serializer.save(reviewer=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetDonorRatingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, donorId):
        try:
            donor = User.objects.get(id=donorId)
        except User.DoesNotExist:
            return Response({"error": "Donor not found"}, status=status.HTTP_404_NOT_FOUND)
        ratings = Rating.objects.filter(donor=donor)
        serializer = RatingSerializer(ratings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GetDoneeRatingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, doneeId):
        try:
            donee = User.objects.get(id=doneeId)
        except User.DoesNotExist:
            return Response({"error": "Donee not found"}, status=status.HTTP_404_NOT_FOUND)
        ratings = Rating.objects.filter(donee=donee)
        serializer = RatingSerializer(ratings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)