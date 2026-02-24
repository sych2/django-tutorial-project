package app.roles

############################################################
# ROLE MODEL
#
# Assumptions:
#   - input.user.role is a STRING
#   - Allowed roles: admin | employee | customer
############################################################

default has_valid_role := false
default is_admin := false
default is_employee := false
default is_customer := false

############################################################
# VALID ROLE CHECK
############################################################

valid_roles := {"admin", "employee", "customer"}

has_valid_role if {
    input.user
    input.user.role
    valid_roles[input.user.role]
}

############################################################
# ROLE HELPERS
############################################################

is_admin if {
    has_valid_role
    input.user.role == "admin"
}

is_employee if {
    has_valid_role
    input.user.role == "employee"
}

is_customer if {
    has_valid_role
    input.user.role == "customer"
}

############################################################
# ROLE UTILITIES
############################################################

# Generic role matcher
has_role(role) if {
    has_valid_role
    input.user.role == role
}

############################################################
# PERMISSION MATRIX
#
# Structure:
#
# permissions[role][resource_type][action] = true
#
# Wildcard supported:
#   "*" for resource
#   "*" for action
############################################################

permissions := {
    "admin": {
        "*": {"*": true}
    },

    "employee": {
        "product": {
            "read": true,
            "update": true
        },
        "order": {
            "read": true
        }
    },

    "customer": {
        "product": {
            "read": true
        },
        "order": {
            "read": true,
            "create": true
        }
    }
}

############################################################
# RBAC ENGINE
############################################################

# Main evaluation entrypoint

role_allows(action, resource_type) if {
    has_valid_role
    role := input.user.role

    # 1️⃣ Wildcard rule
    permissions[role]["*"]["*"]
}

role_allows(action, resource_type) if {
    has_valid_role
    role := input.user.role

    # 2️⃣ Resource-specific rule
    permissions[role][resource_type]["*"]
}

role_allows(action, resource_type) if {
    has_valid_role
    role := input.user.role

    # 3️⃣ Exact match
    permissions[role][resource_type][action]
}
