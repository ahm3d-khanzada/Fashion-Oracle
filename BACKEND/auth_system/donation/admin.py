
from django.contrib import admin
from .models import Donation, DonationRequest
from django.utils.timezone import now
from datetime import timedelta
from django.utils.timezone import now
from django.contrib import messages

class DonationRequestAdmin(admin.ModelAdmin):
    list_display = ('donee', 'donation', 'status', 'created_at')
    search_fields = ('donee__email', 'donation__cloth_type')
    list_filter = ('status', 'request_reason')

class DonationAdmin(admin.ModelAdmin):
    list_display = ('id', 'donor', 'status', 'created_at', 'get_donees')
    search_fields = ('id', 'donor__email', 'status')
    list_filter = ('status',)
    
    
    actions = ['expire_old_donations']           # add the custom action in actions list

    def get_donees(self, obj):
        """Show all donees who have requested this donation."""
        return ", ".join([req.donee.email for req in obj.requests.all()])  # Use 'requests' from related_name

    get_donees.short_description = "Donees"

    @admin.action(description="Expire Donations Older than 7 Days (No Approved Requests)")
    def expire_old_donations(self, request, queryset):
        expiration_date = now() - timedelta(minutes=10)

        donations_to_expire = queryset.filter(
            created_at__lte=expiration_date,
            status="live"
        ).exclude(requests__status="approved")

        expired_count = donations_to_expire.update(status="expired")  # Expire the donations

        self.message_user(request, f" {expired_count} donation(s) expired.", messages.SUCCESS)

# Register models with admin

admin.site.register(Donation, DonationAdmin)  
admin.site.register(DonationRequest, DonationRequestAdmin)


