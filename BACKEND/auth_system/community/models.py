import uuid
from django.db import models
from home.models import User
from PIL import Image as PilImage
from PIL.Image import Resampling
from io import BytesIO
from django.core.files import File
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model


User = get_user_model()

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    post_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    media = models.FileField(upload_to='posts/')  # Changed to more specific path
    caption = models.TextField(blank=True, null=True)  # Added missing caption field
    is_liked = models.BooleanField(default=False)  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Post {self.post_id} by {self.user.email}"
    
    @property
    def media_url(self):
        try:
            return self.media.url
        except ValueError:
            return None
    
    def save(self, *args, **kwargs):
        """
        Override save method to process media before saving
        """
        if self.media and not self.pk:  # Only process new uploads
            self.process_media()
        super().save(*args, **kwargs)
    
    def process_media(self):
        """
        Process media file based on its type
        """
        try:
            file_extension = self.media.name.split('.')[-1].lower()
            
            if file_extension in ['png', 'jpg', 'jpeg']:
                self._process_image()
            elif file_extension in ['mp4', 'mov', 'avi']:
                pass  # No processing for videos
            else:
                raise ValueError(f"Unsupported file type: {file_extension}")
        except Exception as e:
            print(f"Error processing media: {e}")
            raise  # Re-raise the exception to prevent saving invalid files
    
    def _process_image(self):
        """
        Process and resize uploaded images
        """
        try:
            img = PilImage.open(self.media)
            
            # Convert to RGB if necessary (for PNG with transparency)
            if img.mode in ('RGBA', 'P'):
                img = img.convert("RGB")
            
            # Resize while maintaining aspect ratio
            target_size = (1080, 1080)  # Instagram-like square size
            img.thumbnail(target_size, Resampling.LANCZOS)
            
            # Save to buffer
            buffer = BytesIO()
            img_format = 'JPEG' if self.media.name.lower().endswith(('jpg', 'jpeg')) else 'PNG'
            img.save(buffer, format=img_format, quality=85)
            buffer.seek(0)
            
            # Generate new filename
            filename = f"{self.post_id}.{img_format.lower()}"
            self.media.save(filename, File(buffer), save=False)
            
        except Exception as e:
            print(f"Error processing image: {e}")
            raise
    
    def update_like_state(self):
        """
        Update the is_liked field based on whether the post is liked by the current user.
        This method should be called whenever a like/unlike action occurs.
        """
        self.is_liked = self.likes.filter(user=self.user).exists()
        self.save()

    def like_count(self):
        """
        Returns the number of likes for this post
        """
        return self.likes.count()

# ---------------------------------------------Post Like-----------------------------------------
class Like(models.Model):
    id = models.BigAutoField(primary_key=True)  
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="likes")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')



# --------------------------------------------- Comment -----------------------------------------




class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    comment_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    text = models.CharField(max_length=150, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    UNETHICAL_WORDS = set([
        "abuse", "hate", "racist", "offensive", "discrimination", "insult", "bully",
        "harassment", "curse", "profanity", "obscene", "vulgar", "derogatory",
        "degrading", "threat", "intimidate", "mock", "shame", "toxic", "slander", "defame",
        "malicious", "harmful", "explicit", "disgusting"
    ])

    def clean(self):
        if any(word in self.text.lower() for word in self.UNETHICAL_WORDS):
            raise ValidationError("This comment contains inappropriate language.")

    def __str__(self):
        return f"{self.user.first_name}'s comment on post {self.post.post_id}"  

    class Meta:
        ordering = ["-created_at"]


# -------------------------------------------- CommentLike --------------------------------------

class CommentLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comment_likes")
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name="likes")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'comment')  # Ensures that a user can like a comment only once

    def __str__(self):
        return f"{self.user.first_name} liked comment {self.comment.comment_id}"


#------------------------------------------Notification---------------------------------------------

from django.db import models

from django.utils.translation import gettext_lazy as _

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ("like", "Like"),("comment", "Comment"), ("follow", "Follow"),
    ]

    id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_notifications")  
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")  
    notification_type = models.CharField(max_length=10, choices=NOTIFICATION_TYPES)  
    post = models.ForeignKey('Post', on_delete=models.CASCADE, blank=True, null=True, related_name="notifications")
    comment = models.ForeignKey('Comment', on_delete=models.CASCADE, blank=True, null=True, related_name="notifications")
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    message = models.TextField(blank=True, null=True)  # Add this field

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.sender.first_name} -> {self.receiver.first_name} ({self.notification_type})"
