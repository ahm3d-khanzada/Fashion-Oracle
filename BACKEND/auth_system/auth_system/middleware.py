class SetUTCMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Set the timezone to UTC
        import pytz
        from django.utils import timezone
        
        timezone.activate(pytz.UTC)
        
        response = self.get_response(request)
        timezone.deactivate()
        
        return response
