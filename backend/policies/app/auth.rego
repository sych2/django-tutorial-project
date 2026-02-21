package app.auth

#
# ================================
# DEFAULT DECISION (FAIL CLOSED)
# ================================
#
# Production systems must fail securely.
# If no rule explicitly allows access,
# access is denied by default.
#

default allow := false


#
# ================================
# MAIN DECISION OBJECT
# ================================
#
# Instead of returning a boolean only,
# we return a structured decision.
# This improves observability and debugging.
#

decision := {
    "allow": allow,
    "reason": reason,
    "user": input.user.id,
    "action": input.action,
    "resource": input.resource.type
}


#
# ================================
# ALLOW RULE
# ================================
#
# Access is allowed if:
# 1. User is authenticated
# 2. User role permits the action
# 3. Resource constraints (e.g., ownership) are satisfied
#

allow if {
    is_authenticated
    role_allows_action
    resource_constraints_satisfied
}


#
# ================================
# AUTHENTICATION CHECK
# ================================
#
# This assumes JWT validation is handled
# before OPA receives the input.
# OPA verifies claims structure.
#

is_authenticated if {
    input.user.id != ""
    input.user.role != ""
}


#
# ================================
# ROLE-BASED ACCESS CONTROL
# ================================
#
# Delegates to roles module.
# Checks if user's role is allowed
# to perform the requested action
# on the resource type.
#

role_allows_action if {
    allowed_actions := data.roles[input.user.role][input.resource.type]
    input.action == allowed_actions[_]
}


#
# ================================
# RESOURCE CONSTRAINTS
# ================================
#
# Handles contextual checks like:
# - Ownership
# - Multi-tenant boundaries
# - Status restrictions
#
# This calls the ownership module.
#

resource_constraints_satisfied if {
    not requires_ownership
}

resource_constraints_satisfied if {
    requires_ownership
    data.app.ownership.is_owner
}


#
# ================================
# DETERMINE IF OWNERSHIP IS REQUIRED
# ================================
#
# Some actions (e.g., DELETE, UPDATE)
# may require ownership validation.
#

requires_ownership if {
    input.action == "update"
}

requires_ownership if {
    input.action == "delete"
}


#
# ================================
# DENIAL REASONS
# ================================
#
# Provides explicit reasoning for audit logs.
# Only one reason will evaluate in practice
# because allow short-circuits.
#

reason := "Access granted" if allow

reason := "User not authenticated" if {
    not is_authenticated
}

reason := "Role does not permit this action" if {
    is_authenticated
    not role_allows_action
}

reason := "Ownership requirement not satisfied" if {
    is_authenticated
    role_allows_action
    requires_ownership
    not data.app.ownership.is_owner
}
