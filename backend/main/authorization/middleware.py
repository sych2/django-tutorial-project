import requests
from django.conf import settings
from django.http import HttpResponseForbidden

OPA_URL = "http://localhost:8181/v1/data/app/auth/allow"

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

        # ✅ 1. Bypass infrastructure paths
        if path.startswith(BYPASS_PREFIXES):
            return self.get_response(request)

        # ✅ 2. Build structured input
        input_data = self.build_opa_input(request)

        # ✅ 3. Ask OPA
        allowed = self.check_opa(input_data)

        # ✅ 4. Enforce decision
        if not allowed:
            return HttpResponseForbidden("Forbidden by area")

        return self.get_response(request)

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
                OPA_URL,
                json={"input": input_data},
                timeout=2,
            )

            # 1️⃣ HTTP-level failure
            if response.status_code != 200:
                print("OPA ERROR STATUS:", response.status_code)
                print("OPA ERROR BODY:", response.text)
                return False  # Fail-closed

            # 2️⃣ Parse JSON safely
            try:
                result = response.json()
            except ValueError:
                print("OPA INVALID JSON RESPONSE")
                return False  # Fail-closed

            # 3️⃣ Extract decision
            # Since we call /v1/data/app/auth/allow
            # Response shape: { "result": true }
            allowed = result.get("result", False)

            print("OPA DECISION:", allowed)

            return bool(allowed)

        except requests.exceptions.Timeout:
            print("OPA TIMEOUT")
            return False  # Fail-closed

        except requests.exceptions.ConnectionError:
            print("OPA CONNECTION ERROR")
            return False  # Fail-closed

        except requests.exceptions.RequestException as e:
            print("OPA REQUEST ERROR:", str(e))
            return False  # Fail-closed
