package app.auth

default allow := false

############################################################
# PUBLIC ROUTES (PATH BASED)
############################################################

public_paths := {
    "/",
    "/home/",
    "/home/about/",
    "/login/",
    "/logout/",
    "/register/",
}

allow if {
    input.resource.type == "view"
    input.resource.path in public_paths
}

############################################################
# ADMIN (FULL ACCESS)
############################################################

allow if {
    input.user.role == "admin"
}

############################################################
# EMPLOYEE PERMISSIONS
############################################################

allow if {
    input.user.role == "employee"
    input.resource.type == "product"
    input.action in {"read", "update"}
}

############################################################
# CUSTOMER OWNERSHIP RULES
############################################################

allow if {
    input.user.role == "customer"
    input.resource.type == "order"
    input.action == "read"
    input.user.id == input.resource.owner_id
}

allow if {
    input.user.role == "customer"
    input.resource.type == "order"
    input.action == "update"
    input.user.id == input.resource.owner_id
}
