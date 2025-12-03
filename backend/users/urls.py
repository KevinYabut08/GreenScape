from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('register/client', ClientRegisterViewSet, basename='client-register')
router.register('register/employee', EmployeeRegisterViewSet, basename='employee-register')

router.register('login/client', ClientLoginViewSet, basename='client-login')
router.register('login/employee', EmployeeLoginViewSet, basename='employee-login')


urlpatterns = router.urls
