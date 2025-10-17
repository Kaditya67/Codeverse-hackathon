from django.urls import path
from .views import sample_api
from .chatbot import get_summary
from .roadmapView import roadmap, update_roadmap
from .refinedRoadmap import refineRoadmap
from .topic import get_data
from .conversation import generate_conversation

urlpatterns = [
    path("hello/", sample_api),
    # path("chatbot/", chatbot_sample),
    path('initroadmap/', roadmap),
    path('refinedrmp/', refineRoadmap),
    path('update-roadmap/', update_roadmap, name='update-roadmap'),
    path('get-summary/', get_summary, name='get-summary'),
    path('get-data/', get_data, name='get-data'),
    path('generate-conversation/', generate_conversation, name='generate-conversation'),
]
