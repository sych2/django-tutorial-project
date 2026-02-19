class Cart:
    def __init__(self, request):
        self.session = request.session
        cart = self.session.get("session_key")

        if "session_key" not in request.session:
            cart = self.session["session_key"] = {}

        self.cart = cart

    # Fixed typo: changed 'selr' to 'self'
    def add(self, product):
        # Fixed error: Get the ID FROM the product object
        product_id = str(product.id)

        if product_id in self.cart:
            pass
        else:
            # Storing the price as a string is good practice for JSON serialization
            self.cart[product_id] = {"price": str(product.price)}

        # Tell Django the session has changed so it saves to the DB
        self.session.modified = True
