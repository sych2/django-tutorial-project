from .resource_resolver import ResourceResolver


class PolicyInputBuilder:

    @staticmethod
    def build(request):

        resource_data = ResourceResolver.resolve(request)

        user = request.user

        return {
            "user": {
                "id": user.id,
                "role": getattr(user, "role", None),
                "is_superuser": user.is_superuser,
            },
            "request": {
                "method": request.method,
                "path": request.path,
            },
            "resource": resource_data,
        }
