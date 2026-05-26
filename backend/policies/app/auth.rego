package app.auth

default allow = false

# ============================================================
# Admin Helper Rule
# ============================================================

is_admin if {
    input.user.is_authenticated
    input.user.role == "admin"
}

is_admin if {
    input.user.is_authenticated
    input.user.is_superuser == true
}

# ============================================================
# Public Exact Paths
# ============================================================

public_exact_paths := {
    "/health/",
    "/favicon.ico",
}

allow if {
    input.resource.path in public_exact_paths
}

# ============================================================
# Public Prefix Areas
# ============================================================

public_prefixes := {
    "/home/",
    "/static/",
    "/media/uploads/products/",
    "/login/",
    "/api/auth/register/",
    "/api/auth/login/",
    "/api/auth/token/",
    "/home/api/products/",
    "/home/api/categories/",
    "/accounts/",
    "/api/auth/google/",
    "/api/auth/complete-profile/",
    "/api/auth/admin-session/",
}

allow if {
    some prefix in public_prefixes
    startswith(input.resource.path, prefix)
}

# ============================================================
# Admin Panel Access
# Only role="admin" or is_superuser can access /admin/
# ============================================================

allow if {
    startswith(input.resource.path, "/admin/")
    is_admin
}

# ============================================================
# Superuser Override (non-admin routes only)
# ============================================================

allow if {
    input.user.is_superuser
    not startswith(input.resource.path, "/admin/")
}

# ============================================================
# Authenticated Protected Areas
# ============================================================

authenticated_prefixes := {
    "/dashboard/",
    "/profile/",
    "/orders/",
    "/products/",
    "/api/auth/profile/",
    "/api/auth/logout/",
    "/home/api/orders/",
    "/home/api/products/create/",
    "/home/api/products/",
    "/home/api/categories/",
}

allow if {
    input.user.is_authenticated
    some prefix in authenticated_prefixes
    startswith(input.resource.path, prefix)
}

# ============================================================
# Deny Reasons (for debugging)
# ============================================================

deny_reason := "Access denied: insufficient permissions." if {
    not allow
}

deny_reason := "Access denied: /admin/ requires admin role or superuser." if {
    startswith(input.resource.path, "/admin/")
    not input.user.is_authenticated
}

deny_reason := "Access denied: /admin/ requires admin role or superuser." if {
    startswith(input.resource.path, "/admin/")
    input.user.is_authenticated
    not is_admin
}
