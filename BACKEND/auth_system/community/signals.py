#signal.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Like, Comment, Notification,Post
from profile_management.models import Profile
from home.models import User 

# Automatically create a Profile when a new User is created
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created and not hasattr(instance, 'profile'):
        Profile.objects.create(user=instance)


# Optionally, ensure profile saved when User is saved
@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save()



#__________________________________________________________________________________
# Notify user when their post is liked
@receiver(post_save, sender=Like)
def post_like_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            sender=instance.user,
            receiver=instance.post.user,  
            notification_type="like",
            post=instance.post
        )

# Notify user when someone comments on their post
@receiver(post_save, sender=Comment)
def post_comment_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            sender=instance.user,
            receiver=instance.post.user,  
            notification_type="comment",
            post=instance.post,
            comment=instance
        )


from django.db.models.signals import m2m_changed
@receiver(m2m_changed, sender=Profile.following.through)
def follow_notification(sender, instance, action, reverse, pk_set, **kwargs):
    """
    Notify a user when someone follows them.
    - instance = The profile of the user who followed someone.
    - pk_set = The set of profile IDs that were followed.
    """
    if action == "post_add":  # Only trigger when a new follow is added
        for profile_id in pk_set:
            followed_profile = Profile.objects.get(id=profile_id)  #The user being followed
            follower_profile = instance  #user who followed
            
            # Create a notification for the followed user
            Notification.objects.create(
                sender=follower_profile.user,  # follower (User)
                receiver=followed_profile.user,  # followed user (User)
                notification_type="follow",
                message=f"{follower_profile.user.email.split('@')[0]} started following you!")




@receiver(post_save, sender=Post)
def post_creation_notification(sender, instance, created, **kwargs):
    if created:
        author_profile = instance.user.profile
        followers = author_profile.followers.all()
        
        print(f"Post created by {instance.user.email}. Followers count: {followers.count()}")
        
        if followers.exists():
            notifications = [
                Notification(
                    sender=instance.user,
                    receiver=follower.user,
                    notification_type="new_post",
                    post=instance
                )
                for follower in followers
            ]
            Notification.objects.bulk_create(notifications)
