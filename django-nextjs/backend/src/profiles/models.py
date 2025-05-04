from django.conf import settings
from django.db import models


User = settings.AUTH_USER_MODEL


class profile (models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    # image = models.ImageField(upload_to="profiles", blank=True)
    # date_of_birth = models.DateField()

    # def __str__(self):
    #     return self.user.username

# Create your models here.
