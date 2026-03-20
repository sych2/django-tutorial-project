package app.auth_test

import data.app.auth

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

test_favicon_is_public if {
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
            "path": "/favicon.ico",
            "query_params": {}
        },
        "resource": {
            "type": "view",
            "path": "/favicon.ico",
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
            "username": "customer1",
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

# ----------------------------------------
# Admin Panel Access Tests
# ----------------------------------------

# ✅ role=admin can access /admin/
test_admin_role_allowed_admin_panel if {
    auth.allow with input as {
        "user": {
            "id": 1,
            "username": "any_admin",
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

# ✅ Superuser can access /admin/
test_superuser_allowed_admin_panel if {
    auth.allow with input as {
        "user": {
            "id": 2,
            "username": "superuser",
            "role": "customer",
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

# ❌ Customer cannot access /admin/
test_customer_blocked_admin_panel if {
    not auth.allow with input as {
        "user": {
            "id": 3,
            "username": "customer1",
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

# ❌ Employee cannot access /admin/
test_employee_blocked_admin_panel if {
    not auth.allow with input as {
        "user": {
            "id": 4,
            "username": "employee1",
            "role": "employee",
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

# ❌ Unauthenticated user cannot access /admin/
test_unauthenticated_blocked_admin_panel if {
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

# ✅ Admin can access /admin/ sub-paths
test_admin_allowed_admin_subpath if {
    auth.allow with input as {
        "user": {
            "id": 1,
            "username": "any_admin",
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

# ✅ Superuser can access non-admin protected routes
test_superuser_allowed_dashboard if {
    auth.allow with input as {
        "user": {
            "id": 2,
            "username": "superuser",
            "role": "customer",
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
