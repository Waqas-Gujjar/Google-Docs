from django.contrib.auth import get_user_model
from helpers.api.auth.controllers import DjangoNextCustomController
from helpers.api.auth.permissions import anon_required, user_or_anon
from helpers.api.auth.schemas import ( UsernameMandatoryEmailMandatorySchema, EmailloginSchema)
from helpers.api.users.schemas import UserSchema
from ninja.errors import HttpError
from ninja_extra import NinjaExtraAPI
from ninja_extra.permissions import AllowAny
from ninja_jwt.authentication import JWTAuth
from ninja_jwt.controller import NinjaJWTDefaultController
from ninja_jwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from django.conf import settings
from django.contrib.auth import login
from django.http import HttpResponse
from django.shortcuts import redirect, render

from documents.api import router as document_router
from ai.api import router as ai_router
from accounts.api import router as ai_account

from googler import oauth as googler_oauth, services as googler_services , schemas as googler_schemas

LOGIN_REDIRECT_URL = settings.LOGIN_REDIRECT_URL
# 

User = get_user_model()

api = NinjaExtraAPI(auth=user_or_anon)

api.add_router("/documents", document_router)
api.add_router("/ai", ai_router )
api.add_router("/accounts",ai_account)

# adds /token/ pair/refresh/
api.register_controllers(DjangoNextCustomController)


@api.get("/hello/", auth=user_or_anon)
def hello(request):
    print(request.auth, request.user)
    if request.auth:
        user = request.user
        if user.is_authenticated:
            return {

                "username": user.display_name,
                "email": user.email,
            }

    return {"message": "Hello World"}




@api.post("/login/", response=UserSchema, auth=anon_required)
def login(request, payload: EmailloginSchema):
    user = authenticate(request, email=payload.email, password=payload.password)
    if not user :
         raise HttpError(400, "Could not user. Please try again later")
    if not user.is_active:
        raise HttpError(400, "user is not active")
    try:
        token = RefreshToken.for_user(user)
        return {
            "username": user.display_name,
            "email": user.email,
            "is_authenticated": True,
            "access_token": str(token.access_token),
            "refresh_token": str(token),
        }
    except Exception as e:
        raise HttpError(500, "Could not create user. Please try again later")


@api.post("/signup/", response=UserSchema, auth=anon_required)
def signup(request,  payload: EmailloginSchema):
    try:
        user = User.objects.create_user(
            email=payload.email,
            password=payload.password,
            is_active=True,
        )
        user.save()
        token = RefreshToken.for_user(user)
        return {
            "username": user.display_name,
            "email": user.email,
            "is_authenticated": True,
            "access_token": str(token.access_token),
            "refresh_token": str(token),
        }
    except Exception as e:
        raise HttpError(500, "Could not create user. Please try again later")





@api.get("/google/login/", 
        response=googler_schemas.GoogleLoginSchema, 
        auth=anon_required)
def google_login_view(request):
    google_oauth2_url = googler_oauth.generate_auth_url()
    return {
        "redirect_url": google_oauth2_url
    }

@api.post("/google/callback/", 
        response=UserSchema, 
        auth=anon_required)
def google_login_callback_view(request, payload: googler_schemas.GoogleCallbackSchema):
    # print(request.GET)
    state = payload.state
    code = payload.code
    try:
        token_json = googler_oauth.verify_google_oauth_callback(state, code)
    except Exception as e:
        raise HttpError(500, "Could login user. Please try again later")
    google_user_info = googler_oauth.verify_token_json(token_json)
    user = googler_services.get_or_create_google_user(google_user_info)
    if not user:
        raise HttpError(400, "Could not login user try again")
    if not user.is_active:
       raise HttpError(400, "User is not active")
    token = RefreshToken.for_user(user)
    return {
        "username": user.display_name,
        "email": user.email,
        "is_authenticated": True,
        "access_token": str(token.access_token),
        "refresh_token": str(token),
    }
