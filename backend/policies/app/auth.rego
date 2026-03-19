package app.auth

default allow = false

# ============================================================
# Whitelisted Admin Usernames
# Only these users can access /admin/
# ============================================================

admin_whitelist := {
    "maina",
    "superadmin",
    "simon",
    # add more usernames here as needed
}

# ============================================================
# Public Exact Paths
# ============================================================

public_exact_paths := {
    "/health/",
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
    "/login/"
}

allow if {
    some prefix in public_prefixes
    startswith(input.resource.path, prefix)
}

# ============================================================
# Admin Panel Access
# Only whitelisted + authenticated users may access /admin/
# Unauthenticated users or non-whitelisted get 403
# ============================================================

allow if {
    startswith(input.resource.path, "/admin/")
    input.user.is_authenticated
    input.user.username in admin_whitelist
}

# ============================================================
# Superuser Override (non-admin routes only)
# Superusers can access everything EXCEPT /admin/
# unless they are also in the whitelist
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
}

allow if {
    input.user.is_authenticated
    some prefix in authenticated_prefixes
    startswith(input.resource.path, prefix)
}

# ============================================================
# Deny Reason (for debugging)
# ============================================================

deny_reason := "Access denied: insufficient permissions." if {
    not allow
}

deny_reason := "Access denied: /admin/ requires whitelisted account." if {
    startswith(input.resource.path, "/admin/")
    not input.user.is_authenticated
}

deny_reason := "Access denied: /admin/ requires whitelisted account." if {
    startswith(input.resource.path, "/admin/")
    input.user.is_authenticated
    not input.user.username in admin_whitelist
}
