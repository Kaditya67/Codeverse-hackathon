from django.urls import path
from .views import sample_api
from .chatbot import sample_api as chatbot_sample 
from .roadmapView import roadmap
from .refinedRoadmap import refineRoadmap 

urlpatterns = [
    path("hello/", sample_api),
    path("chatbot/", chatbot_sample),
    path('initroadmap/', roadmap),
    path('refinedrmp/', refineRoadmap),
]
