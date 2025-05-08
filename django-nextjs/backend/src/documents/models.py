from django.db import models
from django.conf import settings

import uuid

User = settings.AUTH_USER_MODEL
# Create your models here.

class Doc(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, db_index=True, editable=False)
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    title = models.CharField(max_length=120, null=True, blank=True)
    content = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    upate_at = models.DateTimeField(auto_now=True)