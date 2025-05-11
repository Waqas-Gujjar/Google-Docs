from ninja import Router
from typing import List

from .models import Doc
from .schemas import DocSchema

from helpers.api.auth.permissions import user_required
from . import services as doc_service

router=Router()

@router.get("/",response = List[DocSchema], auth = user_required)
def document_list_view(request):
    qs = doc_service.documents_list(request.user)
    return qs


@router.get("/{document_id}/",response = DocSchema, auth = user_required)
def document_list_view(request,document_id):
    print(document_id)
    qs = doc_service.documents_list(request.user)
    return qs[0]
