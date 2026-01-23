from django.shortcuts import render, redirect
from .models import Product 
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .forms import SignUpForm
# Create your views here.
def home(request):
    products = Product.objects.all()
    return render(request, 'home.html', {'products': products})
def about(request):
    
    return render(request, 'about.html',{} ) 

def login_user(request):
    if request.method == "POST":#validate the post request
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password = password)
        if user is not None:
            login(request, user)
            messages.success(request, ("You have been logged in successfully"))
            return redirect('home')
        else:
            messages.success(request, ("Your credentials don't match"))
            return redirect('login')
    
    else:
        return render(request, 'login.html', {})
    
    

def logout_user(request):
    logout(request)
    messages.success(request, ("you have been logged out"))
    return redirect('login')

def register_user(request):
    form = SignUpForm
    if request.method == "POST":
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data['username']
            password = form.cleaned_data['password1']

            #login user
            user = authenticate(username=username, password=password)
            login(request, user)
            messages.success(request, ("you have registered successfully"))
            return redirect('home')
        
    else:
        messages.success(request, ("registration failed please try again"))
        return redirect('register')

    return render(request, 'register.html', {'form':form})