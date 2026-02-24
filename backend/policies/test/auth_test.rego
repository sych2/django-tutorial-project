package app.auth

import data.app.roles

############################################################
# DEFAULT (FAIL CLOSED)
############################################################

default allow := false


############################################################
# PUBLIC ROUTES
############################################################
#
# These routes are accessible without authentication.
# Example: home, about, login
#
############################################################

public_views := {
    "home",
    "about",
    "login",
    "home-about",
    "logout",
}

allow if {
    input.resource.type == "view"
    input.resource.view_name in public_views
}


############################################################
# AUTHENTICATED VIEWS
############################################################
#
# Any view not explicitly public requires authentication.
# Authentication is enforced by middleware.
#
############################################################

allow if {
    input.resource.type == "view"
    input.resource.view_name not in public_views
    input.user.id
}


############################################################
# BUSINESS RESOURCE AUTHORIZATION
############################################################
#
# Applies to domain resources (order, product, etc.)
# Uses RBAC + optional ownership enforcement.
#
############################################################

valid_business_request if {
    input.user.id
    input.user.role
    input.action
    input.resource
    input.resource.type != "view"
}


############################################################
# OWNERSHIP CHECK
############################################################

is_owner if {
    input.resource.owner_id
    input.user.id == input.resource.owner_id
}


############################################################
# OWNERSHIP REQUIRED RULES
############################################################

ownership_required if {
    input.resource.type == "order"
    input.action in {"read", "update"}
}


############################################################
# RBAC WITHOUT OWNERSHIP
############################################################

allow if {
    valid_business_request
    roles.role_allows(input.action, input.resource.type)
    not ownership_required
}


############################################################
# RBAC WITH OWNERSHIP ENFORCEMENT
############################################################

allow if {
    valid_business_request
    roles.role_allows(input.action, input.resource.type)
    ownership_required
    is_owner
}


############################################################
# OBSERVABILITY
############################################################
#
# These expose structured denial reasons
# Useful for debugging and audit logging
#
############################################################

deny_reasons contains "invalid_input" if {
    not valid_business_request
}

deny_reasons contains "rbac_denied" if {
    valid_business_request
    not roles.role_allows(input.action, input.resource.type)
}

deny_reasons contains "ownership_violation" if {
    valid_business_request
    ownership_required
    not is_owner
}
