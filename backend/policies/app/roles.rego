package app.roles

##
## ROLE RESOLUTION MODULE
##
## Purpose:
##   - Normalize role evaluation
##   - Provide reusable predicates for auth.rego
##   - Centralize RBAC logic
##
## Assumptions:
##   - input.user.role is a STRING (single-role system)
##   - Role must be one of: admin, employee, customer
##

############################################
# Fail-Closed Defaults
############################################

default is_admin := false
default is_employee := false
default is_customer := false
default has_valid_role := false


############################################
# Basic Validation
############################################

has_valid_role if {
    input.user
    input.user.role
    valid_roles[input.user.role]
}

valid_roles := {
    "admin": true,
    "employee": true,
    "customer": true
}


############################################
# Direct Role Predicates
############################################

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


############################################
# Generic Role Check
############################################

# Usage:
# roles.has_role("admin")

has_role(role) if {
    has_valid_role
    role == input.user.role
}


############################################
# Permission Matrix (RBAC Core)
############################################

# Centralized permission mapping
# permissions[role][resource_type][action] = true

permissions := {
    "admin": {
        "*": {
            "*": true
        }
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


############################################
# RBAC Evaluation
############################################

# Returns true if role is permitted to perform action on resource
role_allows(action, resource_type) if {
    has_valid_role

    role := input.user.role

    # Admin wildcard
    permissions[role]["*"]["*"]
}

role_allows(action, resource_type) if {
    has_valid_role

    role := input.user.role

    permissions[role][resource_type][action]
}
