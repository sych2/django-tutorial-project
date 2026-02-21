package app.auth_test

# Import the policy under test
import data.app.auth


test_allow_admin_access if {
    auth.allow with input as {
        "user": {
            "id": "1",
            "roles": ["admin"]
        },
        "action": "read",
        "resource": {
            "type": "donation"
        }
    }
}
############################################################
# TEST 1: Admin can access any resource
############################################################

test_admin_can_read_any_account {
    input := {
        "user": {
            "id": "admin1",
            "role": "admin"
        },
        "resource": {
            "type": "account",
            "owner_id": "user123"
        },
        "action": "read"
    }

    auth.allow with input as input
}

############################################################
# TEST 2: Owner can read their own resource
############################################################

test_owner_can_read_own_account {
    input := {
        "user": {
            "id": "user123",
            "role": "member"
        },
        "resource": {
            "type": "account",
            "owner_id": "user123"
        },
        "action": "read"
    }

    auth.allow with input as input
}

############################################################
# TEST 3: Non-owner cannot read another user’s account
############################################################

test_non_owner_cannot_read_other_account {
    input := {
        "user": {
            "id": "user999",
            "role": "member"
        },
        "resource": {
            "type": "account",
            "owner_id": "user123"
        },
        "action": "read"
    }

    not auth.allow with input as input
}

############################################################
# TEST 4: Member cannot delete account
############################################################

test_member_cannot_delete_account {
    input := {
        "user": {
            "id": "user123",
            "role": "member"
        },
        "resource": {
            "type": "account",
            "owner_id": "user123"
        },
        "action": "delete"
    }

    not auth.allow with input as input
}

############################################################
# TEST 5: Missing role should deny access (fail closed)
############################################################

test_missing_role_denied {
    input := {
        "user": {
            "id": "user123"
        },
        "resource": {
            "type": "account",
            "owner_id": "user123"
        },
        "action": "read"
    }

    not auth.allow with input as input
}

############################################################
# TEST 6: Unknown action denied
############################################################

test_unknown_action_denied {
    input := {
        "user": {
            "id": "admin1",
            "role": "admin"
        },
        "resource": {
            "type": "account",
            "owner_id": "user123"
        },
        "action": "hack"
    }

    not auth.allow with input as input
}
