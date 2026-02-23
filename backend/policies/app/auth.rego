package app.auth

import data.app.roles

default allow := false

#################################################
# PUBLIC ROUTES (No authentication required)
#################################################

public_views := {
    "home",
    "home-about",
    "logout",
}

allow if {
    input.resource.type == "view"
    input.resource.view_name in public_views
}

#################################################
# AUTHENTICATED ROUTES (Generic protection)
#################################################

allow if {
    input.resource.type == "view"
    not input.resource.view_name in public_views
    input.user.is_authenticated
}

#################################################
# BUSINESS RESOURCE AUTHORIZATION (RBAC)
#################################################

valid_input if {
    input.user
    input.user.id
    input.user.role
    input.action
    input.resource
    input.resource.type != "view"
}

# Ownership check
is_owner if {
    input.resource.owner_id
    input.user.id == input.resource.owner_id
}

# Pure RBAC
allow if {
    valid_input
    roles.role_allows(input.action, input.resource.type)
    not ownership_required
}

# RBAC + ownership
allow if {
    valid_input
    roles.role_allows(input.action, input.resource.type)
    ownership_required
    is_owner
}

#################################################
# OWNERSHIP RULES
#################################################

ownership_required if {
    input.resource.type == "order"
    input.action == "read"
}

ownership_required if {
    input.resource.type == "order"
    input.action == "update"
}

#################################################
# OBSERVABILITY
#################################################

deny_reasons contains "invalid_input" if {
    not valid_input
}

deny_reasons contains "rbac_denied" if {
    valid_input
    not roles.role_allows(input.action, input.resource.type)
}

deny_reasons contains "ownership_required" if {
    valid_input
    ownership_required
    not is_owner
}
