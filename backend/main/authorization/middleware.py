import requests
from django.conf import settings
from django.http import HttpResponseForbidden

OPA_URL = "http://localhost:8181/v1/data/app/auth/allow"


class OPAAuthorizationMiddleware:
    """
    Middleware that sends every request to OPA for authorization.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        input_data = self.build_opa_input(request)

        allowed = self.check_opa(input_data)

        if not allowed:
            return HttpResponseForbidden("Forbidden by OPA")

        return self.get_response(request)

    def build_opa_input(self, request):
        """
        Builds structured input for OPA.
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
        """

        try:
            response = requests.post(
                OPA_URL,
                json={"input": input_data},
                timeout=2,
            )

            if response.status_code != 200:
                print("OPA ERROR STATUS:", response.status_code)
                print("OPA ERROR BODY:", response.text)
                return False

            result = response.json()

            # 🔥 CRITICAL FIX:
            # Since we call /v1/data/app/auth/allow
            # OPA returns: { "result": true }
            allowed = result.get("result", False)

            print("OPA DECISION:", allowed)

            return allowed

        except requests.exceptions.RequestException as e:
            print("OPA CONNECTION ERROR:", str(e))
            return False
