from ninja import Router
from typing import List
from ninja.errors import HttpError

from .models import Doc
from .schemas import DocSchema , DocUpdateSchema , DocCreateSchema


from helpers.api.auth.permissions import user_required
from . import services as doc_service
from . import exceptions as doc_exception

router=Router()

@router.get("/",response = List[DocSchema], auth = user_required)
def document_list_view(request):
    qs = doc_service.documents_list(request.user)
    return qs


def http_document_detail(request, document_id):
    try:
         obj = doc_service.get_document(user=request.user, document_id=document_id)
    except doc_exception.documentNotFound as e:
        raise HttpError(404, f'{e}')
    except doc_exception.UserNoPermissionNotAllow as e:
        raise HttpError(403,f'{e}')
    except :
        raise HttpError(500,'Unknow server error')
    if obj is None:
        raise HttpError(404,f'{document_id} is not found ')
    return obj


@router.get("/{document_id}/",response = DocSchema, auth = user_required)
def document_list_view(request,document_id):
    obj = http_document_detail(request,document_id)
    return obj
   

@router.post("/",response = {201:DocSchema}, auth = user_required)
def document_cerate_view(request,payload:DocCreateSchema):
    obj = doc_service.create_document(user=request.user,title=payload.title)
    if obj is None:
        raise HttpError (404,'invalid data')
    return obj
   


@router.put("/{document_id}/",response = DocSchema, auth = user_required)
def document_Update_view(request,document_id, payload:DocUpdateSchema ):
    obj = http_document_detail(request,document_id)
    update_data = payload.model_dump()
    for key,val in update_data.items():
        setattr(obj,key,val)
    obj.save()
    return obj
