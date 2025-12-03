from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate

User = get_user_model()

# -----------------------------
# CLIENT LOGIN
# -----------------------------
class ClientLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data["email"]
        password = data["password"]

        user = authenticate(
            request=self.context.get("request"),
            email=email,
            password=password
        )

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        if user.role != "client":
            raise serializers.ValidationError("Not a client account")

        data["user"] = user
        return data


# -----------------------------
# CLIENT REGISTRATION
# -----------------------------
class ClientRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "password", "first_name", "last_name"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            **validated_data,
            role="client"
        )
        return user


# -----------------------------
# EMPLOYEE LOGIN
# -----------------------------
class EmployeeLoginSerializer(serializers.Serializer):
    employee_number = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        employee_number = data["employee_number"]
        email = data["email"]
        password = data["password"]

        user = authenticate(
            request=self.context.get("request"),
            email=email,
            password=password
        )

        if not user:
            raise serializers.ValidationError("Invalid email or password")

        if user.role != "employee":
            raise serializers.ValidationError("This is not an employee account")

        if not user.employee_number:
            raise serializers.ValidationError("Employee number missing for this account")

        if str(user.employee_number) != str(employee_number):
            raise serializers.ValidationError("Invalid employee number")

        data["user"] = user
        return data


# -----------------------------
# EMPLOYEE REGISTRATION
# -----------------------------
class EmployeeRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "password", "first_name", "last_name", "employee_number"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            **validated_data,
            role="employee"
        )
        return user
