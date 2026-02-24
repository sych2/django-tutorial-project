package app.auth_test

import data.app.auth

############################################################
# PUBLIC ROUTES (PATH BASED)
############################################################

test_home_is_public if {
    auth.allow with input as {
        "resource": {
            "type": "view",
            "path": "/home/"
        },
        "user": {}
    }
}

test_about_is_public if {
    auth.allow with input as {
        "resource": {
            "type": "view",
            "path": "/about/"
        },
        "user": {}
    }
}

test_login_is_public if {
    auth.allow with input as {
        "resource": {
            "type": "view",
            "path": "/login/"
        },
        "user": {}
    }
}


############################################################
# ANONYMOUS USERS BLOCKED FOR BUSINESS RESOURCES
############################################################

test_anonymous_denied if {
    not auth.allow with input as {
        "action": "read",
        "resource": {
            "type": "order"
        },
        "user": {}
    }
}


############################################################
# ADMIN
############################################################

test_admin_can_delete if {
    auth.allow with input as {
        "action": "delete",
        "resource": {
            "type": "product",
            "owner_id": "1"
        },
        "user": {
            "id": "1",
            "role": "admin"
        }
    }
}


############################################################
# EMPLOYEE
############################################################

test_employee_can_update_product if {
    auth.allow with input as {
        "action": "update",
        "resource": {
            "type": "product"
        },
        "user": {
            "id": "22",
            "role": "employee"
        }
    }
}


############################################################
# CUSTOMER OWNERSHIP
############################################################

test_customer_can_read_own_order if {
    auth.allow with input as {
        "action": "read",
        "resource": {
            "type": "order",
            "owner_id": "10"
        },
        "user": {
            "id": "10",
            "role": "customer"
        }
    }
}

test_customer_cannot_update_other_order if {
    not auth.allow with input as {
        "action": "update",
        "resource": {
            "type": "order",
            "owner_id": "999"
        },
        "user": {
            "id": "10",
            "role": "customer"
        }
    }
}
