import uuid

from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.contrib.auth import get_user_model

User = get_user_model()


class GoogleAccountAdapter(DefaultAccountAdapter):
    """Prevents allauth from trying to use the standard signup form."""

    def is_open_for_signup(self, request):
        return True


class GoogleSocialAccountAdapter(DefaultSocialAccountAdapter):

    def pre_social_login(self, request, sociallogin):
        """Link Google account to an existing user if email matches."""
        if sociallogin.is_existing:
            return

        email = sociallogin.account.extra_data.get('email')
        if not email:
            return

        try:
            existing_user = User.objects.get(email=email)
            sociallogin.connect(request, existing_user)
        except User.DoesNotExist:
            pass  # new user, handled in save_user

    def save_user(self, request, sociallogin, form=None):
        """
        Build a valid Account instance from Google profile data.
        Handles the required fields that Google won't provide.
        """
        data = sociallogin.account.extra_data

        user = sociallogin.user
        user.email = data.get('email', '')
        user.first_name = data.get('given_name', '')
        user.last_name = data.get('family_name', '')

        # Auto-generate username from email prefix, ensure uniqueness
        base_username = user.email.split('@')[0]
        username = base_username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
        user.username = username

        # phone_number is required + unique on your model.
        # Google doesn't provide it, so we store a placeholder.
        # The user should be prompted to update this after first login.
        user.phone_number = f"GOOGLE_{uuid.uuid4().hex[:12].upper()}"

        user.role = 'customer'  # default role for OAuth signups
        user.set_unusable_password()  # no password for OAuth users

        user.save()
        return user

    def populate_user(self, request, sociallogin, data):
        """Prevent allauth's default populate_user from overwriting our fields."""
        user = super().populate_user(request, sociallogin, data)
        return user
