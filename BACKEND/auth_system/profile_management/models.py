

# Create your models here.
from django.db import models
from home.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(max_length=500, blank=True)
    profile_pic = models.ImageField(upload_to='profile_pic/', blank=True, null=True)
    following = models.ManyToManyField('self', symmetrical=False, related_name='followers', blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile of {self.user.email}"

    @property
    def username(self):
        return self.user.email.split('@')[0]

    @property
    def post_count(self):
        return self.user.posts.count() 

    @property
    def follower_count(self):
        return self.followers.count()

    @property
    def following_count(self):
        return self.following.count()

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)



