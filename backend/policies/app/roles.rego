package app.roles

import data.app.helpers


#
# =========================================================
# PURPOSE
# =========================================================
#
# This module evaluates RBAC permissions.
#
# It does NOT grant access.
# It determines whether a role permits
# an action on a resource.
#
# auth.rego consumes this module.
#


#
# =========================================================
# VALID ROLE CHECK
# =========================================================
#
# Ensures the role exists in configuration.
#

valid_role if {
    input.user.role != ""
    data.roles[input.user.role]
}


#
# =========================================================
# ROLE INHERITANCE
# =========================================================
#
# Recursively resolves inherited roles.
# Supports hierarchical RBAC.
#

all_roles[r] {
    r := input.user.role
}

all_roles[r] {
    parent := data.roles[input.user.role].inherits[_]
    r := parent
}

#
# NOTE:
# For deeper inheritance chains,
# this can be expanded recursively.
#


#
# =========================================================
# PERMISSION MATCH
# =========================================================
#
# Checks if any resolved role contains
# a matching permission entry.
#

role_allows_action if {
    valid_role
    some r
    r := all_roles[_]
    permission := data.roles[r].permissions[_]
    permission_allows(permission)
}


#
# =========================================================
# PERMISSION EVALUATION
# =========================================================
#
# Determines if a permission object
# authorizes the requested action
# and resource.
#

permission_allows(permission) if {
    resource_matches(permission.resource)
    action_matches(permission.actions)
}


#
# =========================================================
# RESOURCE MATCHING
# =========================================================
#
# Supports:
# - Exact match
# - Wildcard "*"
#

resource_matches(resource) if {
    resource == "*"
}

resource_matches(resource) if {
    resource == input.resource.type
}


#
# =========================================================
# ACTION MATCHING
# =========================================================
#
# Supports:
# - Exact action match
# - Wildcard "*"
#

action_matches(actions) if {
    "*" == actions[_]
}

action_matches(actions) if {
    input.action == actions[_]
}


#
# =========================================================
# ADMIN SHORTCUT
# =========================================================
#
# Optional optimization:
# Admins bypass permission evaluation.
#

is_admin if {
    input.user.role == "admin"
}
