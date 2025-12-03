from rest_framework import viewsets, permissions
from rest_framework.response import Response 
from .serializers import *
from .models import *
from django.contrib.auth import get_user_model, authenticate
from knox.models import AuthToken

User = get_user_model()

class ClientLoginViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = ClientLoginSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        _, token = AuthToken.objects.create(user)

        return Response({
            "user": ClientRegisterSerializer(user).data,
            "token": token
        })

    
class ClientRegisterViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()
    serializer_class = ClientRegisterSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(ClientRegisterSerializer(user).data, status=201)
        return Response(serializer.errors, status=400)
    

class EmployeeLoginViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = EmployeeLoginSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        _, token = AuthToken.objects.create(user)

        return Response({
            "user": EmployeeRegisterSerializer(user).data,
            "token": token
        })


class EmployeeRegisterViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()
    serializer_class = EmployeeRegisterSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(EmployeeRegisterSerializer(user).data, status=201)
        return Response(serializer.errors, status=400)