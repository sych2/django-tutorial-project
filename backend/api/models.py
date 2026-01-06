from django.db import models
from django.contrib.auth.models import User, AbstractBaseUser, BaseUserManager


class MyAccountManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError("Users must have an email address.")
        if not username:
            raise ValueError("user must have a username.")
        user = self.model(
            email=self.normalize_email(email),
            username=username,

        )
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self, email, username, password):
        user = self.create_user(
            email=self.normalize_email(email),
            username=username,
            password=password,
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

def get_profile_image_filepath(self, filename):
    return f'profile_images/{self.pk}/{"profile_image.png"}'

def get_default_profile_image():
    return "codingwithmitch/logo_1080.png"


class account(AbstractBaseUser):
    email=models.EmailField(verbose_name="email", max_length=60, unique=True)
    username=models.CharField(max_length=30, unique=True)
    date_joined=models.DateTimeField(verbose_name="data joined", auto_now_add=True)
    last_login=models.DateTimeField(verbose_name="last joined", auto_now=True)
    is_admin=models.BooleanField(default=False)
    is_active=models.BooleanField(default=False)
    is_staff=models.BooleanField(default=False)
    is_superuser=models.BooleanField(default=False)
    profile_image=models.ImageField(max_length=255, upload_to=get_profile_image_filepath)
    hide_email=models.BooleanField(default=True)
   
    objects = MyAccountManager()
   #Required to create an account 
    USERNAME_FIELD="email"
    REQUIRED_FIELDS=["username"]

    #default return value if dont access any individual field
    def __str__(self):
        return self.username
    def get_profile_image_filename(self):
        return str(self.profile_image)[str(self.profile_image).index(f'profile_images/{self.pk}'):]
    #deafult permissions
    def has_perm(self, perm, obj=None):
        return self.is_admin
    def has_module_perms(self, app_label):
        return True
    




class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    def __str_(self):
        return self.title
# Create your models here.
