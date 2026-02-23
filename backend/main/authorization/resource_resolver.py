"""
resource_resolver.py

Responsible for extracting resource-level context from an incoming
Django request. This context is supplied to the policy engine (OPA)
as part of the authorization input document.

Design Goals:
- Must NEVER raise exceptions (middleware safety)
- Must degrade gracefully when metadata is unavailable
- Must support both Django and Django REST Framework
- Must be easily extensible for domain-specific resource resolution
"""

from typing import Any, Dict, Optional

from django.http import HttpRequest


class ResourceResolver:
    """
    Extracts structured resource metadata from a Django HttpRequest.

    The resolved data is included in the OPA input under:

        input.resource

    Example output:

        {
            "path": "/api/users/42/",
            "method": "GET",
            "view_name": "user-detail",
            "app_name": "users",
            "url_name": "user-detail",
            "route": "api/users/<int:id>/",
            "kwargs": {"id": 42},
            "resource_id": 42,
        }
    """

    @staticmethod
    def resolve(request: HttpRequest) -> Dict[str, Any]:
        """
        Entry point used by PolicyInputBuilder.

        Always returns a dictionary.
        Never raises.
        """

        try:
            # Skip static/media files from policy evaluation
            if ResourceResolver._is_static_request(request):
                return {}

            resolver_match = getattr(request, "resolver_match", None)

            view_name = None
            app_name = None
            url_name = None
            route = None
            kwargs = {}
            resource_id = None

            if resolver_match:
                view_name = getattr(resolver_match, "view_name", None)
                app_name = getattr(resolver_match, "app_name", None)
                url_name = getattr(resolver_match, "url_name", None)
                route = getattr(resolver_match, "route", None)
                kwargs = getattr(resolver_match, "kwargs", {}) or {}

                # Attempt to infer primary resource identifier
                resource_id = ResourceResolver._extract_resource_id(kwargs)

            return {
                "path": request.path,
                "method": request.method,
                "view_name": view_name,
                "app_name": app_name,
                "url_name": url_name,
                "route": route,
                "kwargs": kwargs,
                "resource_id": resource_id,
            }

        except Exception:
            # Absolute safety: middleware must never crash
            return {
                "path": request.path,
                "method": request.method,
                "view_name": None,
                "app_name": None,
                "url_name": None,
                "route": None,
                "kwargs": {},
                "resource_id": None,
            }

    # ------------------------------------------------------------------
    # Internal Helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _is_static_request(request: HttpRequest) -> bool:
        """
        Determines whether request targets static/media assets.

        These should typically bypass authorization checks.
        """
        path = request.path

        return (
            path.startswith("/static/")
            or path.startswith("/media/")
            or path == "/favicon.ico"
            or path == "/robots.txt"
        )

    @staticmethod
    def _extract_resource_id(kwargs: Dict[str, Any]) -> Optional[Any]:
        """
        Attempts to extract a primary resource identifier
        from URL kwargs.

        Supports common naming conventions:
            id
            pk
            user_id
            object_id
            <model>_id
        """

        if not kwargs:
            return None

        # Common conventions first
        priority_keys = ["id", "pk", "object_id"]

        for key in priority_keys:
            if key in kwargs:
                return kwargs[key]

        # Fallback: any key ending with _id
        for key, value in kwargs.items():
            if key.endswith("_id"):
                return value

        return None
