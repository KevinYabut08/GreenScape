from django.urls import path
from .views import chatbot_view

# URL configuration for the chatbot app.
# The empty string route means this view responds at the base path of the app,
# such as /chatbot/ if included under that route in the project URLs.
urlpatterns = [
    path("", chatbot_view, name="chatbot"),
]