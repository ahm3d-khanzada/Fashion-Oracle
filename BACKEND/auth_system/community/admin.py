from django.contrib import admin
from .models import Post,Like
from .models import Comment,CommentLike
class PostAdmin(admin.ModelAdmin):
    fields = ( 'user', 'media', 'created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at') 
    list_display = ('post_id', 'user', 'media', 'created_at', 'updated_at')  
    search_fields = ('post_id', 'user__email') 


admin.site.register(Post, PostAdmin)

class CommentAdmin(admin.ModelAdmin):
    fields = ('user', 'post', 'text', 'created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')
    list_display = ('comment_id', 'user', 'post', 'text', 'created_at', 'updated_at')
    search_fields = ('comment_id', 'user__email', 'post__post_id')  # Allows searching by comment ID, user's email, and post ID

class PostLikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'created_at')  # Display user, post, and timestamp of like
    search_fields = ('user__email', 'post__post_id')  # Allows searching by user email and post ID

admin.site.register(Like, PostLikeAdmin)

# Register CommentLike to the admin
class CommentLikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'comment', 'created_at')  # Display user, comment, and timestamp of like
    search_fields = ('user__email', 'comment__comment_id')  # Allows searching by user email and comment ID

admin.site.register(CommentLike, CommentLikeAdmin)

admin.site.register(Comment, CommentAdmin)