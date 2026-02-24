package app.auth

import data.app.roles

############################################################
# DEFAULT DECISION
############################################################

default allow := false

############################################################
# INPUT VALIDATION
############################################################

valid_user if {
    input.user
    input.user.id
    input.user.is_authenticated != null
}

valid_resource if {
    input.resource
    input.resource.type
}

valid_view_request if {
    valid_user
    valid_resource
    input.resource.type == "view"
    input.resource.view_name
}

valid_business_request if {
    valid_user
    valid_resource
    input.resource.type != "view"
    input.action
    input.user.role
}

############################################################
# PUBLIC ROUTES (NO AUTH REQUIRED)
############################################################

public_views := {
    "home",
    "about",
    "logout",
}

allow if {
    valid_view_request
    public_views[input.resource.view_name]
}

############################################################
# PROTECTED DJANGO VIEWS
############################################################

allow if {
    valid_view_request
    not public_views[input.resource.view_name]
    input.user.is_authenticated
}

############################################################
# BUSINESS RESOURCES (RBAC)
############################################################

rbac_allowed if {
    valid_business_request
    roles.role_allows(input.action, input.resource.type)
}

############################################################
# OWNERSHIP RULES
############################################################

ownership_required if {
    input.resource.type == "order"
    input.action in {"read", "update"}
}

is_owner if {
    input.resource.owner_id
    input.user.id == input.resource.owner_id
}

############################################################
# BUSINESS RESOURCE ALLOW LOGIC
############################################################

# RBAC only (no ownership required)
allow if {
    rbac_allowed
    not ownership_required
}

# RBAC + ownership enforcement
allow if {
    rbac_allowed
    ownership_required
    is_owner
}

############################################################
# OBSERVABILITY (DENY REASONS)
############################################################

deny_reasons contains "invalid_user" if {
    not valid_user
}

deny_reasons contains "invalid_resource" if {
    not valid_resource
}

deny_reasons contains "unauthenticated_view_access" if {
    valid_view_request
    not public_views[input.resource.view_name]
    not input.user.is_authenticated
}

deny_reasons contains "rbac_denied" if {
    valid_business_request
    not roles.role_allows(input.action, input.resource.type)
}

deny_reasons contains "ownership_violation" if {
    rbac_allowed
    ownership_required
    not is_owner
}
