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
