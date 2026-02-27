package app.auth

default allow = false

# ============================================================
# Public Exact Paths
# ============================================================

public_exact_paths := {
    "/login/",
    "/home/about/",
    "/health/"
}

allow if {
    input.resource.path in public_exact_paths
}

# ============================================================
# Public Prefix Paths (Static + Media)
# ============================================================

public_prefixes := {
    "/static/",
    "/media/"
}

allow if {
    some prefix
    prefix := public_prefixes[_]
    startswith(input.resource.path, prefix)
}

# ============================================================
# Superuser Override
# ============================================================

allow if {
    input.user.is_superuser == true
}

# ============================================================
# Authenticated Access
# ============================================================

allow if {
    input.user.is_authenticated == true
}

# ============================================================
# Deny Reason (Optional)
# ============================================================

deny_reason := "Access denied: authentication required." if {
    not allow
}
