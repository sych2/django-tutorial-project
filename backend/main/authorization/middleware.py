from django.http import JsonResponse

from .input_builder import PolicyInputBuilder
from .opa_client import OPAClient
from .resource_resolver import ResourceResolver


class OPAAuthorizationMiddleware:
    """
    Global authorization middleware.
    Delegates all access decisions to OPA.
    """

    def __init__(self, get_response):
        self.get_response = get_response
        self.opa_client = OPAClient()

    def __call__(self, request):

        # Skip Django admin completely
        if request.path.startswith("/admin/"):
            return self.get_response(request)

        # Resolve resource first
        resource = ResourceResolver.resolve(request)

        # Bypass static/system routes
        if not resource:
            return self.get_response(request)

        # Build policy input (must support anonymous users)
        policy_input = PolicyInputBuilder.build(request)

        allowed = self.opa_client.evaluate(policy_input)

        if not allowed:
            return JsonResponse(
                {"detail": "Access denied"},
                status=403,
            )

        return self.get_response(request)
