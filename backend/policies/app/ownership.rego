package app.ownership

import data.app.helpers

#
# =====================================================
# PURPOSE
# =====================================================
#
# This module encapsulates all ownership and
# resource-level constraint logic.
#
# It does NOT grant access.
# It only evaluates ownership-related conditions.
#
# It is called by auth.rego.
#


#
# =====================================================
# CORE OWNERSHIP CHECK
# =====================================================
#
# True if the authenticated user is the direct owner
# of the resource.
#

is_owner if {
    helpers.valid_user
    helpers.resource_exists
    input.resource.owner_id == input.user.id
}


#
# =====================================================
# TENANT-LEVEL OWNERSHIP
# =====================================================
#
# In SaaS systems, ownership may be tenant-scoped.
# A user may access any resource within their tenant.
#
# This does NOT replace direct ownership —
# it supplements it.
#

same_tenant_owner if {
    helpers.valid_user
    helpers.resource_exists
    input.user.tenant_id != ""
    input.resource.tenant_id != ""
    input.user.tenant_id == input.resource.tenant_id
}


#
# =====================================================
# GROUP-BASED OWNERSHIP (OPTIONAL EXTENSION)
# =====================================================
#
# Some resources may be owned by a group rather than
# an individual user.
#
# Example:
# input.resource.group_id
# input.user.groups = ["finance", "sales"]
#

group_owner if {
    helpers.valid_user
    helpers.resource_exists
    input.resource.group_id != ""
    input.resource.group_id == input.user.groups[_]
}


#
# =====================================================
# SOFT-DELETE / ARCHIVED SAFETY CHECK
# =====================================================
#
# Prevent operations on archived or soft-deleted
# resources unless explicitly overridden.
#

resource_active if {
    not input.resource.archived
}


#
# =====================================================
# OWNERSHIP SATISFACTION RULE
# =====================================================
#
# This rule centralizes all ownership satisfaction logic.
# It evaluates to true if ANY ownership model applies.
#
# Direct owner
# OR Same tenant (if allowed upstream)
# OR Group owner
#

ownership_satisfied if {
    is_owner
}

ownership_satisfied if {
    same_tenant_owner
}

ownership_satisfied if {
    group_owner
}


#
# =====================================================
# STRICT OWNERSHIP MODE
# =====================================================
#
# Some actions (e.g., DELETE) may require strict
# direct ownership rather than tenant-level access.
#
# auth.rego can call strict_owner_only when needed.
#

strict_owner_only if {
    is_owner
}


#
# =====================================================
# DEFENSIVE GUARDS
# =====================================================
#
# These prevent malformed input from accidentally
# passing ownership checks.
#

valid_ownership_context if {
    helpers.valid_user
    helpers.resource_exists
    input.resource.owner_id != ""
}
