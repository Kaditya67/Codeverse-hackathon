from django.urls import path
from .views import sample_api
from .chatbot import sample_api as chatbot_sample 

urlpatterns = [
    path("hello/", sample_api),
    path("chatbot/", chatbot_sample),
]
