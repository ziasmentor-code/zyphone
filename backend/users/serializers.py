# users/serializers.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    # Tell SimpleJWT to use email instead of username
    username_field = 'email'

    def validate(self, attrs):
        # attrs already contains 'email' and 'password'
        email = attrs.get("email")
        password = attrs.get("password")

        user = User.objects.filter(email=email).first()
        if not user:
            raise serializers.ValidationError({"email": "No user found with this email"})
        if not user.check_password(password):
            raise serializers.ValidationError({"password": "Incorrect password"})

        # Pass the correct username_field (email) to the parent
        return super().validate({
            self.username_field: email,
            "password": password
        })