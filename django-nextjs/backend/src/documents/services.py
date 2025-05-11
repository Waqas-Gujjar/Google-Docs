from .models import Doc
from django.core.cache import cache

DOC_CACHE_KEY = "document:list:{user_id}"
DOC_CACHE_TIME_OUT = 300


def documents_list(user=None , force = False):
    if user is None:
        return []
    cache_key = DOC_CACHE_KEY.format(user_id=user.id)
    cache_qs = cache.get(cache_key)
    if cache_qs and not force:
        return cache_qs
    qs = Doc.objects.filter(user=user).values("id","title","content")
    cache.set(cache_key,qs,timeout=DOC_CACHE_TIME_OUT)
    return qs