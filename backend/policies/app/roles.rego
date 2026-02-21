package app.roles

##
## ROLE RESOLUTION MODULE
##
## Purpose:
##   - Determine user role membership
##   - Support hierarchical role inheritance
##   - Provide reusable role predicates to other modules (e.g. auth.rego)
##
## Assumptions:
##   - input.user.roles is an array of strings
##   - roles.json may optionally define inheritance mappings
##

############################################
# Defaults
############################################

default is_admin := false
default is_employee := false
default is_donor := false
default is_beneficiary := false


############################################
# Direct Role Checks
############################################

# True if user explicitly has "admin"
is_admin if {
    "admin" in input.user.roles
}

# True if user explicitly has "employee"
is_employee if {
    "employee" in input.user.roles
}

# True if user explicitly has "donor"
is_donor if {
    "donor" in input.user.roles
}

# True if user explicitly has "beneficiary"
is_beneficiary if {
    "beneficiary" in input.user.roles
}


############################################
# Role Inheritance (Optional via data file)
############################################

# roles.json example structure:
# {
#   "inheritance": {
#     "admin": ["employee", "donor"],
#     "employee": ["beneficiary"]
#   }
# }

# True if a user inherits a role via hierarchy
inherits_role(role) if {
    some parent
    parent in input.user.roles
    role in data.roles.inheritance[parent]
}

# Effective role check (direct OR inherited)
has_role(role) if {
    role in input.user.roles
}

has_role(role) if {
    inherits_role(role)
}


############################################
# Role Enumeration (Partial Set - Rego v1)
############################################

# All effective roles of the user
effective_roles contains role if {
    has_role(role)
}


############################################
# Defensive Validation
############################################

# Ensure roles field exists and is an array
valid_roles_input if {
    input.user.roles
    is_array(input.user.roles)
}
