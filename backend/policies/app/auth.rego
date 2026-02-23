package app.auth

import data.app.roles

############################################
# DEFAULT
############################################

default allow := false

############################################
# PUBLIC ROUTES
############################################

public_views := {
    "home",
    "home-about",
    "logout",
}

# Allow public views regardless of auth
allow if {
    input.resource.type == "view"
    input.resource.view_name in public_views
}

############################################
# PROTECTED VIEWS
############################################

# Any non-public view requires authentication
allow if {
    input.resource.type == "view"
    input.resource.view_name not in public_views
    input.user.is_authenticated
}

############################################
# BUSINESS RESOURCES (RBAC + Ownership)
############################################

valid_input if {
    input.user
    input.user.role
    input.action
    input.resource
    input.resource.type != "view"
}

is_owner if {
    input.resource.owner_id
    input.user.id == input.resource.owner_id
}

# RBAC without ownership
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

############################################
# OWNERSHIP RULES
############################################

ownership_required if {
    input.resource.type == "order"
    input.action in {"read", "update"}
}

############################################
# OBSERVABILITY
############################################

deny_reasons contains "invalid_input" if {
    not valid_input
}

deny_reasons contains "rbac_denied" if {
    valid_input
    not roles.role_allows(input.action, input.resource.type)
}

deny_reasons contains "ownership_violation" if {
    valid_input
    ownership_required
    not is_owner
}
