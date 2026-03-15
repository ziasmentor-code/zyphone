from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    pincode = models.CharField(max_length=10, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    occupation = models.CharField(max_length=100, blank=True, null=True)
    company = models.CharField(max_length=100, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    twitter = models.CharField(max_length=100, blank=True, null=True)
    instagram = models.CharField(max_length=100, blank=True, null=True)
    profile_image = models.ImageField(upload_to='profiles/', null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, blank=True, null=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.email