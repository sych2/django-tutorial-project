from django.http import JsonResponse

from .input_builder import PolicyInputBuilder
from .opa_client import OPAClient


class OPAAuthorizationMiddleware:
    """
    Global authorization middleware.
    Enforces OPA policy evaluation on every authenticated request.
    """

    def __init__(self, get_response):
        self.get_response = get_response
        self.opa_client = OPAClient()

    def __call__(self, request):

        # Skip admin/login/static endpoints if needed
        if request.path.startswith("/admin/"):
            return self.get_response(request)

        if not request.user.is_authenticated:
            return JsonResponse(
                {"detail": "Authentication required"},
                status=401,
            )

        policy_input = PolicyInputBuilder.build(request)

        allowed = self.opa_client.evaluate(policy_input)

        if not allowed:
            return JsonResponse(
                {"detail": "Access denied"},
                status=403,
            )

        return self.get_response(request)
