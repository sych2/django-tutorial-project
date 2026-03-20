import requests
from django.conf import settings
from django.http import HttpResponseForbidden
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication

# Infrastructure paths that must NEVER hit OPA
BYPASS_PREFIXES = ("/static/", "/media/")


class OPAAuthorizationMiddleware:
    """
    Policy Enforcement Point (PEP)
    Sends protected requests to OPA for authorization.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.path

        # 1. Bypass infrastructure paths
        if path.startswith(BYPASS_PREFIXES):
            return self.get_response(request)

        # 2. Authenticate JWT token and attach user to request
        self.authenticate_jwt(request)

        # 3. Build structured input
        input_data = self.build_opa_input(request)

        # 4. Ask OPA
        allowed = self.check_opa(input_data)

        # 5. Enforce decision
        if not allowed:
            return HttpResponseForbidden("Forbidden by OPA")

        return self.get_response(request)

    def authenticate_jwt(self, request):
        """
        Attempt JWT authentication and attach user to request.
        Falls back to AnonymousUser silently if no/invalid token.
        """
        jwt_auth = JWTAuthentication()
        try:
            result = jwt_auth.authenticate(request)
            if result is not None:
                user, token = result
                request.user = user
        except AuthenticationFailed:
            pass  # leave request.user as AnonymousUser

    def build_opa_input(self, request):
        """
        Builds structured, stable input contract for OPA.
        """
        user = request.user
        return {
            "user": {
                "id": user.id if user.is_authenticated else None,
                "username": user.username if user.is_authenticated else None,
                "role": getattr(user, "role", None),
                "is_authenticated": user.is_authenticated,
                "is_superuser": user.is_superuser if user.is_authenticated else False,
            },
            "action": request.method,
            "request": {
                "method": request.method,
                "path": request.path,
                "query_params": request.GET.dict(),
            },
            "resource": {
                "type": "view",
                "path": request.path,
                "method": request.method,
                "owner_id": None,
            },
        }

    def check_opa(self, input_data):
        """
        Calls OPA and returns boolean decision.
        Fail-closed by default.
        """
        try:
            response = requests.post(
                settings.OPA_URL,
                json={"input": input_data},
                timeout=2,
            )
            if response.status_code != 200:
                print("OPA ERROR STATUS:", response.status_code)
                print("OPA ERROR BODY:", response.text)
                return False
            try:
                result = response.json()
            except ValueError:
                print("OPA INVALID JSON RESPONSE")
                return False
            allowed = result.get("result", False)
            print("OPA DECISION:", allowed)
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
