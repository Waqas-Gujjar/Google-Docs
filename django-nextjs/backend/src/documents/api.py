from ninja import Router
from typing import List

from .models import Doc
from .schemas import DocSchema

from helpers.api.auth.permissions import user_required
from .services import documents_list

router=Router()

@router.get("/",response = List[DocSchema], auth = user_required)
def document_list_view(request):
    qs = documents_list()
    return qs
