package app.auth_test

import data.app.auth


# ----------------------------------------
# Admin Whitelist Tests
# ----------------------------------------

# ✅ Whitelisted user can access /admin/
test_whitelisted_user_allowed_admin if {
    auth.allow with input as {
        "user": {
            "id": 1,
            "username": "maina",
            "role": "admin",
            "is_authenticated": true,
            "is_superuser": false
        },
        "action": "GET",
        "request": {
            "method": "GET",
            "path": "/admin/",
            "query_params": {}
        },
        "resource": {
            "type": "view",
            "path": "/admin/",
            "method": "GET",
            "owner_id": null
        }
    }
}

# ❌ Authenticated but non-whitelisted user blocked from /admin/
test_non_whitelisted_user_blocked_admin if {
    not auth.allow with input as {
        "user": {
            "id": 3,
            "username": "regularuser",
            "role": "customer",
            "is_authenticated": true,
            "is_superuser": false
        },
        "action": "GET",
        "request": {
            "method": "GET",
            "path": "/admin/",
            "query_params": {}
        },
        "resource": {
            "type": "view",
            "path": "/admin/",
            "method": "GET",
            "owner_id": null
        }
    }
}

# ❌ Unauthenticated user blocked from /admin/
test_unauthenticated_user_blocked_admin if {
    not auth.allow with input as {
        "user": {
            "id": 0,
            "username": "",
            "role": "",
            "is_authenticated": false,
            "is_superuser": false
        },
        "action": "GET",
        "request": {
            "method": "GET",
            "path": "/admin/",
            "query_params": {}
        },
        "resource": {
            "type": "view",
            "path": "/admin/",
            "method": "GET",
            "owner_id": null
        }
    }
}

# ❌ Superuser NOT in whitelist blocked from /admin/
test_superuser_not_whitelisted_blocked_admin if {
    not auth.allow with input as {
        "user": {
            "id": 4,
            "username": "othersuper",
            "role": "admin",
            "is_authenticated": true,
            "is_superuser": true
        },
        "action": "GET",
        "request": {
            "method": "GET",
            "path": "/admin/",
            "query_params": {}
        },
        "resource": {
            "type": "view",
            "path": "/admin/",
            "method": "GET",
            "owner_id": null
        }
    }
}

# ✅ Superuser NOT in whitelist can still access other routes
test_superuser_not_whitelisted_allowed_dashboard if {
    auth.allow with input as {
        "user": {
            "id": 4,
            "username": "othersuper",
            "role": "admin",
            "is_authenticated": true,
            "is_superuser": true
        },
        "action": "GET",
        "request": {
            "method": "GET",
            "path": "/dashboard/",
            "query_params": {}
        },
        "resource": {
            "type": "view",
            "path": "/dashboard/",
            "method": "GET",
            "owner_id": null
        }
    }
}

# ✅ Whitelisted user can access /admin/ sub-paths
test_whitelisted_user_allowed_admin_subpath if {
    auth.allow with input as {
        "user": {
            "id": 1,
            "username": "maina",
            "role": "admin",
            "is_authenticated": true,
            "is_superuser": false
        },
        "action": "GET",
        "request": {
            "method": "GET",
            "path": "/admin/store/product/",
            "query_params": {}
        },
        "resource": {
            "type": "view",
            "path": "/admin/store/product/",
            "method": "GET",
            "owner_id": null
        }
    }
}
# ----------------------------------------
# Public Routes
# ----------------------------------------

test_login_is_public if {
    auth.allow with input as {
        "user": {
            "id": 0,
            "username": "",
            "role": "",
            "is_authenticated": false,
            "is_superuser": false
        },
        "action": "GET",
        "request": {
            "method": "GET",
            "path": "/login/",
            "query_params": {}
        },
        "resource": {
            "type": "view",
            "path": "/login/",
            "method": "GET",
            "owner_id": null
        }
    }
}

test_about_is_public if {
    auth.allow with input as {
        "user": {
            "id": 0,
            "username": "",
            "role": "",
            "is_authenticated": false,
            "is_superuser": false
        },
        "action": "GET",
        "request": {
            "method": "GET",
            "path": "/home/about/",
            "query_params": {}
        },
        "resource": {
            "type": "view",
            "path": "/home/about/",
            "method": "GET",
            "owner_id": null
        }
    }
}

# ----------------------------------------
# Authenticated Access
# ----------------------------------------

test_authenticated_user_allowed if {
    auth.allow with input as {
        "user": {
            "id": 2,
            "username": "admin",
            "role": "customer",
            "is_authenticated": true,
            "is_superuser": false
        },
        "action": "GET",
        "request": {
            "method": "GET",
            "path": "/dashboard/",
            "query_params": {}
        },
        "resource": {
            "type": "view",
            "path": "/dashboard/",
            "method": "GET",
            "owner_id": null
        }
    }
}

# ----------------------------------------
# Unauthenticated Block
# ----------------------------------------

test_unauthenticated_user_blocked if {
    not auth.allow with input as {
        "user": {
            "id": 0,
            "username": "",
            "role": "",
            "is_authenticated": false,
            "is_superuser": false
        },
        "action": "GET",
        "request": {
            "method": "GET",
            "path": "/dashboard/",
            "query_params": {}
        },
        "resource": {
            "type": "view",
            "path": "/dashboard/",
            "method": "GET",
            "owner_id": null
        }
    }
}
