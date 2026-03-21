from .resource_resolver import ResourceResolver


class PolicyInputBuilder:
    @staticmethod
    def build(request) -> dict:
        resource_data = ResourceResolver.resolve(request)
        user = request.user
        is_authenticated = bool(user.is_authenticated)
        return {
            "user": {
                "id": user.id if is_authenticated else None,
                "username": user.username if is_authenticated else None,
                "role": getattr(user, "role", None),
                "is_authenticated": is_authenticated,
                "is_superuser": (
                    bool(getattr(user, "is_superuser", False))
                    if is_authenticated
                    else False
                ),
            },
            "action": request.method,
            "request": {
                "method": request.method,
                "path": request.path,
                "query_params": dict(request.GET),
            },
            "resource": resource_data,
        }
