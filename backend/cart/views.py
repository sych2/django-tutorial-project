from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from store.models import Product

from .cart import Cart


# Create your views here.
def cart_summary(request):
    return render(request, "cart_summary.html", {})


def cart_add(request):
    cart = Cart(request)

    # 1. Capture the action from the POST data
    action = request.POST.get("action")

    # 2. Only attempt to use product_id if the action matches
    if action == "post":
        product_id_raw = request.POST.get("product_id")

        if product_id_raw:
            product_id = int(product_id_raw)
            product = get_object_or_404(Product, id=product_id)

            cart.add(product=product)

            # Return response INSIDE this block
            return JsonResponse({"Product Name": product.name})

    # 3. Fallback: If 'action' wasn't 'post' or ID was missing
    return JsonResponse(
        {"error": "Process failed: invalid action or missing ID"}, status=400
    )


def cart_delete(request):
    pass


def cart_update(request):
    pass
