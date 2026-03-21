import requests
from django.conf import settings
from django.http import HttpResponseForbidden
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication

from .input_builder import PolicyInputBuilder

BYPASS_PREFIXES = ("/static/", "/media/")


class OPAAuthorizationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.path
        if path.startswith(BYPASS_PREFIXES):
            return self.get_response(request)
        self._authenticate_jwt(request)
        input_data = PolicyInputBuilder.build(request)
        allowed = self._check_opa(input_data)
        if not allowed:
            return HttpResponseForbidden("Forbidden by OPA")
        return self.get_response(request)

    def _authenticate_jwt(self, request):
        jwt_auth = JWTAuthentication()
        try:
            result = jwt_auth.authenticate(request)
            if result is not None:
                user, token = result
                request.user = user
        except AuthenticationFailed:
            pass

    def _check_opa(self, input_data) -> bool:
        try:
            response = requests.post(
                settings.OPA_URL,
                json={"input": input_data},
                timeout=getattr(settings, "OPA_TIMEOUT", 2),
            )
            if response.status_code != 200:
                print("OPA ERROR STATUS:", response.status_code)
                return False
            try:
                result = response.json()
            except ValueError:
                print("OPA INVALID JSON RESPONSE")
                return False
            allowed = result.get("result", False)
            print("OPA DECISION:", allowed, "| PATH:", input_data["request"]["path"])
            return bool(allowed)
        except requests.exceptions.Timeout:
            print("OPA TIMEOUT")
            return False
        except requests.exceptions.ConnectionError:
            print("OPA CONNECTION ERROR")
            return False
        except requests.exceptions.RequestException as e:
            print("OPA REQUEST ERROR:", str(e))
            return False
