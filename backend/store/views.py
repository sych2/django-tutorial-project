from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, redirect, render

from .forms import SignUpForm
from .models import Category, Product


# Create your views here.
def home(request):
    products = Product.objects.all()
    return render(request, "home.html", {"products": products})


def about(request):

    return render(request, "about.html", {})


def login_user(request):
    if request.method == "POST":  # validate the post request
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            messages.success(request, ("You have been logged in successfully"))
            return redirect("home")
        else:
            messages.success(request, ("Your credentials don't match"))
            return redirect("login")

    else:
        return render(request, "login.html", {})


def logout_user(request):
    logout(request)
    messages.success(request, ("you have been logged out"))
    return redirect("login")


def register_user(request):
    if request.method == "POST":
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()  # form.save() returns the user object

            # Since you are using UserCreationForm, the password logic is handled inside.
            # You can log them in immediately like this:
            login(request, user)

            messages.success(request, ("You have registered successfully"))
            return redirect("home")
        else:
            # If the form isn't valid (e.g., password too short),
            # we stay on the page and show the errors.
            messages.error(
                request, "Registration failed. Please correct the errors below."
            )
    else:
        # This handles the initial GET request when a user first visits the page
        form = SignUpForm()

    # This MUST be outside the if/else to show the form initially or with errors
    return render(request, "register.html", {"form": form})


def product(request, pk):
    product = Product.objects.get(id=pk)
    return render(request, "product.html", {"product": product})


def cartegory(request, foo):
    # replace hyphens with spaces
    foo = foo.replace("_", " ")
    try:
        category = Category.objects.get(name=foo)
        products = Product.objects.filter(cartegory=cartegory)
        return render(
            request, "category.html", {"products": products, "category": category}
        )

    except:
        messages.success(request, ("That cartegory doesnt exist"))
        return redirect("home")
