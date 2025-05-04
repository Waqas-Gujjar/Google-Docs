from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import profile
from django.conf import settings

User = settings.AUTH_USER_MODEL

@receiver(post_save, sender=User)
def create_user_profile_post_save(sender, instance , created, *args, **kwargs):
    if created:
        profile.objects.get_or_create(user=instance)
