"""
resource_resolver.py

Production-grade resource resolver for OPA authorization.

Responsibilities:
- Extract structured resource metadata from Django HttpRequest
- Classify request into logical resource domains (type)
- Provide ownership hints (owner_id)
- Never raise exceptions
- Degrade gracefully
- Support both Django and DRF
- Be extensible for future domain expansion

Contract with OPA Policy:

    input.resource = {
        "type": "view" | "order" | "product" | ...,
        "path": str,
        "method": str,
        "view_name": str | None,
        "app_name": str | None,
        "url_name": str | None,
        "route": str | None,
        "kwargs": dict,
        "owner_id": Any | None,
    }

This structure MUST remain consistent with auth.rego expectations.
"""

from typing import Any, Dict, Optional

from django.http import HttpRequest


class ResourceResolver:
    """
    Extracts structured resource metadata from an HttpRequest
    for use by the OPA authorization engine.
    """

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    @staticmethod
    def resolve(request: HttpRequest) -> Dict[str, Any]:
        """
        Safely resolve resource metadata from request.

        Always returns a dictionary.
        Never raises exceptions.
        """

        try:
            # Static/system requests should bypass authorization
            if ResourceResolver._is_static_request(request):
                return {}

            resolver_match = getattr(request, "resolver_match", None)

            view_name = None
            app_name = None
            url_name = None
            route = None
            kwargs: Dict[str, Any] = {}
            owner_id = None

            if resolver_match:
                view_name = getattr(resolver_match, "view_name", None)
                app_name = getattr(resolver_match, "app_name", None)
                url_name = getattr(resolver_match, "url_name", None)
                route = getattr(resolver_match, "route", None)
                kwargs = getattr(resolver_match, "kwargs", {}) or {}

                owner_id = ResourceResolver._extract_owner_id(kwargs)

            resource_type = ResourceResolver._infer_resource_type(
                path=request.path,
                view_name=view_name,
                app_name=app_name,
            )

            return {
                "type": resource_type,
                "path": request.path,
                "method": request.method,
                "view_name": view_name,
                "app_name": app_name,
                "url_name": url_name,
                "route": route,
                "kwargs": kwargs,
                "owner_id": owner_id,
            }

        except Exception:
            # Absolute safety: middleware must never crash
            return {
                "type": "view",
                "path": request.path,
                "method": request.method,
                "view_name": None,
                "app_name": None,
                "url_name": None,
                "route": None,
                "kwargs": {},
                "owner_id": None,
            }

    # ------------------------------------------------------------------
    # Resource Type Classification
    # ------------------------------------------------------------------

    @staticmethod
    def _infer_resource_type(
        path: str,
        view_name: Optional[str],
        app_name: Optional[str],
    ) -> str:
        """
        Classifies the request into a logical resource domain.

        This drives policy routing in OPA.

        Strategy:
        1. API path prefix detection
        2. App-level classification
        3. Fallback to "view"
        """

        if not path:
            return "view"

        # --- API-based routing ---
        if path.startswith("/api/orders"):
            return "order"

        if path.startswith("/api/products"):
            return "product"

        if path.startswith("/api/users"):
            return "user"

        # --- App-based routing (cleaner for large systems) ---
        if app_name == "orders":
            return "order"

        if app_name == "products":
            return "product"

        if app_name == "users":
            return "user"

        # --- Default: treat as UI view ---
        return "view"

    # ------------------------------------------------------------------
    # Static/System Detection
    # ------------------------------------------------------------------

    @staticmethod
    def _is_static_request(request: HttpRequest) -> bool:
        """
        Determines whether request targets static/media/system assets.

        These should bypass authorization middleware entirely.
        """

        path = request.path or ""

        return (
            path.startswith("/static/")
            or path.startswith("/media/")
            or path == "/favicon.ico"
            or path == "/robots.txt"
        )

    # ------------------------------------------------------------------
    # Ownership Extraction
    # ------------------------------------------------------------------

    @staticmethod
    def _extract_owner_id(kwargs: Dict[str, Any]) -> Optional[Any]:
        """
        Attempts to extract a primary ownership identifier
        from URL kwargs.

        Supports common naming conventions:
            id
            pk
            object_id
            <model>_id
        """

        if not kwargs:
            return None

        priority_keys = ["id", "pk", "object_id"]

        for key in priority_keys:
            if key in kwargs:
                return kwargs[key]

        for key, value in kwargs.items():
            if key.endswith("_id"):
                return value

        return None
