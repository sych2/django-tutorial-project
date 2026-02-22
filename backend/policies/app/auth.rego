package app.auth

import data.app.roles

##
## AUTHORIZATION ENGINE
##
## Model:
##   - RBAC via roles.role_allows()
##   - Optional ownership enforcement
##   - Fail closed
##   - Structured deny reasons
##

############################################
# Default: Deny
############################################

default allow := false

############################################
# Input Validation
############################################

valid_input if {
    input.user
    input.user.id
    input.user.role
    input.action
    input.resource
    input.resource.type
}

############################################
# Ownership Check
############################################

# Safe ownership evaluation
is_owner if {
    input.resource.owner_id
    input.user.id == input.resource.owner_id
}

############################################
# Core Authorization Logic
############################################

# 1️⃣ Pure RBAC access (admin / employee product updates etc.)
allow if {
    valid_input
    roles.role_allows(input.action, input.resource.type)
    not ownership_required
}

# 2️⃣ RBAC + ownership enforced
allow if {
    valid_input
    roles.role_allows(input.action, input.resource.type)
    ownership_required
    is_owner
}

############################################
# Ownership Policy Rules
############################################

# Define which actions require ownership
ownership_required if {
    input.resource.type == "order"
    input.action == "read"
}

ownership_required if {
    input.resource.type == "order"
    input.action == "update"
}

############################################
# Deny Reasons (Observability)
############################################

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
