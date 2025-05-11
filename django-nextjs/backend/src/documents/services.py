from .models import Doc
from django.core.cache import cache

from . import exceptions

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



def get_document(user=None, document_id=None):
    if user is None or document_id is None:
        return None
    try:
        obj = Doc.objects.get( user=user , id=document_id)
    except Doc.DoesNotExist:
        raise exceptions.documentNotFound(f'{document_id} not found')
    except:
        raise exceptions.documentNotFound(f'{document_id} not found')
    has_permissions = obj.user == user
    if not has_permissions:
        raise exceptions.UserNoPermissionNotAllow(f'{user} needs access.')
    return obj
