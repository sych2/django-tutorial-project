package app.helpers


#
# =========================================
# AUTHENTICATION HELPERS
# =========================================
#
# These rules validate the structural integrity
# of the input user object. They do NOT grant access.
#

# Helper: check if user has a role
has_role(user_roles, required_role) if {
    required_role in user_roles
}

# Returns true if user object exists and contains required fields.
valid_user if {
    input.user
    input.user.id != ""
    input.user.role != ""
}

# Returns true if user is anonymous or missing identity.
is_anonymous if {
    not input.user.id
}

#
# =========================================
# ROLE HELPERS
# =========================================
#
# These are convenience predicates used by auth.rego.
# They improve readability and centralize role checks.
#

is_admin if {
    input.user.role == "admin"
}

is_employee if {
    input.user.role == "employee"
}

is_customer if {
    input.user.role == "customer"
}

#
# =========================================
# ACTION HELPERS
# =========================================
#
# These standardize action comparisons.
# Prevents typos across multiple policy files.
#

is_read_action if {
    input.action == "read"
}

is_write_action if {
    input.action == "create"
}

is_write_action if {
    input.action == "update"
}

is_delete_action if {
    input.action == "delete"
}

#
# =========================================
# RESOURCE HELPERS
# =========================================
#
# These encapsulate resource-type logic.
# Keeps type comparisons consistent.
#

is_order if {
    input.resource.type == "order"
}

is_product if {
    input.resource.type == "product"
}

#
# =========================================
# MULTI-TENANCY HELPERS
# =========================================
#
# These support SaaS-style tenant isolation.
# Safe to call from auth.rego.
#

same_tenant if {
    input.user.tenant_id == input.resource.tenant_id
}

#
# =========================================
# SAFETY HELPERS
# =========================================
#
# Defensive programming guards against
# malformed or incomplete input.
#

resource_exists if {
    input.resource
    input.resource.type != ""
}

has_owner if {
    input.resource.owner_id
}

#
# =========================================
# TIME-BASED HELPERS (OPTIONAL)
# =========================================
#
# Example: business-hour enforcement.
# Requires input.context.time to be provided.
#


################################################################################
# Returns true if current time is within business hours (8am–5pm)
################################################################################

is_business_hours if {
    now_ns := time.now_ns()
    clock := time.clock(now_ns)
    hour := clock[0]

    hour >= 8
    hour < 17
}
