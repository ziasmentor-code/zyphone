# users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    profile_image = models.ImageField(upload_to='profiles/', null=True, blank=True)
    
    # username is already in AbstractUser
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # username is still required
    
    def __str__(self):
        return self.email