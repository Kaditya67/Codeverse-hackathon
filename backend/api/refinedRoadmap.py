from .models import Roadmap, Topic
import json

def refineRoadmap(request):

    data = Roadmap.objects.all()
    print(data)
    pass
