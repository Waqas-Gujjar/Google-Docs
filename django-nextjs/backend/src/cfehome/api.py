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

User = get_user_model()

api = NinjaExtraAPI(auth=user_or_anon)

# adds /token/ pair/refresh/
# api.register_controllers(DjangoNextCustomController)


@api.get("/hello/", auth=user_or_anon)
def hello(request):
    # print(request)
    return {"message": "Hello World"}




@api.post("/login/", response=UserSchema, auth=anon_required)
def login(request, payload: EmailloginSchema):
    user = authenticate(request, email=payload.email, password=payload.password)
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






from django.conf import settings
from django.contrib.auth import login
from django.http import HttpResponse
from django.shortcuts import redirect, render

from googler import oauth, services

LOGIN_REDIRECT_URL = settings.LOGIN_REDIRECT_URL
# 

def google_login_view(request):
    if request.method == "POST":
        # csrf_token security
        google_oauth2_url = oauth.generate_auth_url()
        return redirect(google_oauth2_url)
    return render(request, "googler/login.html", {})


def google_login_callback_view(request):
    # print(request.GET)
    state = request.GET.get('state')
    code = request.GET.get('code')
    try:
        token_json = oauth.verify_google_oauth_callback(state, code)
    except Exception as e:
        return HttpResponse(f"{e}", status=400)
    google_user_info = oauth.verify_token_json(token_json)
    user = services.get_or_create_google_user(google_user_info)
    # save_google_auth_tokens(user, google_user_info, token_json)
    login(request, user)
    return redirect(LOGIN_REDIRECT_URL)
