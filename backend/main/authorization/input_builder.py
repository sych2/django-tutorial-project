from .resource_resolver import ResourceResolver


class PolicyInputBuilder:
    @staticmethod
    def build(request) -> dict:
        resource_data = ResourceResolver.resolve(request)
        user = request.user
        is_authenticated = bool(user.is_authenticated)

        input_data = {
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
                "is_staff": (
                    bool(getattr(user, "is_staff", False))
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

        print("OPA INPUT:", input_data)  # remove in production
        return input_data
