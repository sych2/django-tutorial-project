from .resource_resolver import ResourceResolver


class PolicyInputBuilder:
    """
    Transforms Django request into structured OPA input.
    """

    @staticmethod
    def build(request):
        resource_data = ResourceResolver.resolve(request)
        user = request.user

        return {
            "user": {
                "id": getattr(user, "id", None),
                "username": getattr(user, "username", None),
                "role": getattr(user, "role", None),
                "is_authenticated": user.is_authenticated,
                "is_superuser": getattr(user, "is_superuser", False),
            },
            "action": request.method,  # 🔥 CRITICAL FIX
            "request": {
                "method": request.method,
                "path": request.path,
                "query_params": dict(request.GET),
            },
            "resource": resource_data,
        }
