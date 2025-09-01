from django.urls import path
from .views import (
    FileUploadView, DonationCreateView, DonationListView, DonationDetailView,
    DonationUpdateView, DonationDeleteView, DonationRequestCreateView,
    DonationRequestListView, DonationRequestUpdateView,
    DonationRequestDeleteView, ApproveDonationRequestView, RejectDonationRequestView,
    MarkDonationRequestFulfilledView, DonationStatusView,
    SubmitRatingView, GetUserRatingsView, SubmitDonorRatingView, SubmitDoneeRatingView,
    GetDonorRatingsView, GetDoneeRatingsView,DonorDonationRequestListView,UserDonationRequestListView
)

urlpatterns = [
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path('', DonationListView.as_view(), name='donation-list'),
    path('create/', DonationCreateView.as_view(), name='donation-create'),
    path('<uuid:id>/', DonationDetailView.as_view(), name='donation-detail'),
    path('<uuid:id>/update/', DonationUpdateView.as_view(), name='donation-update'),
    path('<uuid:id>/delete/', DonationDeleteView.as_view(), name='donation-delete'),
    path('<uuid:donationId>/request/', DonationRequestCreateView.as_view(), name='donation-request-create'),
    path('requests/', DonationRequestListView.as_view(), name='donation-request-list'),
    path('requests/user/', UserDonationRequestListView.as_view(), name='user-donation-requests'),
    path("requests/donor/", DonorDonationRequestListView.as_view(), name="donor-donation-requests"),
    path('requests/<uuid:id>/update/', DonationRequestUpdateView.as_view(), name='donation-request-update'),
    path('requests/<uuid:id>/delete/', DonationRequestDeleteView.as_view(), name='donation-request-delete'),
    path('requests/<uuid:pk>/approve/', ApproveDonationRequestView.as_view(), name='approve-donation-request'),
    path('requests/<uuid:pk>/reject/', RejectDonationRequestView.as_view(), name='reject-donation-request'),
    path('requests/<uuid:pk>/fulfilled/', MarkDonationRequestFulfilledView.as_view(), name='mark-donation-request-fulfilled'),
    path('requests/<uuid:id>/status/', DonationStatusView.as_view(), name='status-donation-view'),
    path('ratings/submit/<uuid:target_id>/', SubmitRatingView.as_view(), name='submit-rating'),
    path('ratings/user/<uuid:user_id>/', GetUserRatingsView.as_view(), name='get-user-ratings'),
    path('ratings/donor/<uuid:donorId>/', SubmitDonorRatingView.as_view(), name='submit-donor-rating'),
    path('ratings/donee/<int:doneeId>/', SubmitDoneeRatingView.as_view(), name='submit-donee-rating'),
    path('ratings/donor/<uuid:donorId>/list/', GetDonorRatingsView.as_view(), name='get-donor-ratings'),
    path('ratings/donee/<int:doneeId>/list/', GetDoneeRatingsView.as_view(), name='get-donee-ratings'),
]