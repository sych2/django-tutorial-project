package app.auth_test

import data.app.auth.allow

################################################################################
# TEST: Admin can delete products
################################################################################

test_admin_can_delete if {
    allow with input as {
        "user": {
            "id": "1",
            "role": "admin"
        },
        "action": "delete",
        "resource": {
            "type": "product",
            "owner_id": "1"
        }
    }
}

################################################################################
# TEST: Customer cannot delete product they do not own
################################################################################

test_customer_cannot_delete_others_product if {
    not allow with input as {
        "user": {
            "id": "10",
            "role": "customer"
        },
        "action": "delete",
        "resource": {
            "type": "product",
            "owner_id": "999"
        }
    }
}

################################################################################
# TEST: Customer can read own order
################################################################################

test_customer_can_read_own_order if {
    allow with input as {
        "user": {
            "id": "10",
            "role": "customer"
        },
        "action": "read",
        "resource": {
            "type": "order",
            "owner_id": "10"
        }
    }
}

################################################################################
# TEST: Anonymous user denied
################################################################################

test_anonymous_denied if {
    not allow with input as {
        "action": "read",
        "resource": {
            "type": "product"
        }
    }
}

################################################################################
# TEST: Employee can update product
################################################################################

test_employee_can_update_product if {
    allow with input as {
        "user": {
            "id": "22",
            "role": "employee"
        },
        "action": "update",
        "resource": {
            "type": "product"
        }
    }
}

################################################################################
# TEST: Customer cannot update another user's order
################################################################################

test_customer_cannot_update_other_order if {
    not allow with input as {
        "user": {
            "id": "10",
            "role": "customer"
        },
        "action": "update",
        "resource": {
            "type": "order",
            "owner_id": "999"
        }
    }
}
