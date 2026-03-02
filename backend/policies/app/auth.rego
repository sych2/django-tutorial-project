package app.auth

default allow = false

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
# Entire /home/ section is public
# ============================================================

public_prefixes := {
    "/home/",
    "/static/",
    "/media/uploads/products/",
}

allow if {
    some prefix in public_prefixes
    startswith(input.resource.path, prefix)
}

# ============================================================
# Superuser Override
# ============================================================

allow if {
    input.user.is_superuser
}

# ============================================================
# Authenticated Protected Areas
# Only logged-in users can access these prefixes
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
# Deny Reason (Optional for Debugging)
# ============================================================

deny_reason := "Access denied: insufficient permissions." if {
    not allow
}
