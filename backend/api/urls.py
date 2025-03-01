from django.urls import path
from .views import sample_api
from .chatbot import get_summary
from .roadmapView import roadmap, update_roadmap
from .refinedRoadmap import refineRoadmap

urlpatterns = [
    path("hello/", sample_api),
    # path("chatbot/", chatbot_sample),
    path('initroadmap/', roadmap),
    path('refinedrmp/', refineRoadmap),
    path('update-roadmap/', update_roadmap, name='update-roadmap'),
    path('get-summary/', get_summary, name='get-summary'),
]
