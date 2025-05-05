import uuid
from django.contrib.auth import get_user_model

User = get_user_model()


def get_or_create_google_user(google_user_info):
    email = google_user_info.get("email")
    if not email:
        raise ValueError("No email provided by Google")

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Create new user
        user = User.objects.create_user(
            email=email,
        )
        user.set_unusable_password()
        # You might want to mark this user as having been created through Google OAuth
        user.save()

    return user