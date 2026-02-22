from .resource_resolver import ResourceResolver


class PolicyInputBuilder:
    """
    Transforms a Django HTTP request into a structured OPA policy input.
    Used by authorization middleware before policy evaluation.
    """

    @staticmethod
    def build(request):
        resource_data = ResourceResolver.resolve(request)
        user = request.user

        return {
            "user": {
                "id": str(getattr(user, "id", "")),
                "username": getattr(user, "username", None),
                "role": getattr(user, "role", None),
                "is_authenticated": user.is_authenticated,
                "is_superuser": getattr(user, "is_superuser", False),
            },
            "request": {
                "method": request.method,
                "path": request.path,
                "query_params": dict(request.GET),
            },
            "resource": resource_data,
        }
