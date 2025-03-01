from django.http import JsonResponse
from .models import Roadmap, Topic, SubTopic
import json

def refineRoadmap(request):
    
    valid_status = {"interested", "not_interested", "not_done", "done"}
    roadmap = Roadmap.objects.get(language="python")
    topics = Topic.objects.filter(roadmap=roadmap)

    for topic in topics:
        print(f"\nTopic: {topic.name}\n")

        subtopics = SubTopic.objects.filter(topic=topic)

        for subtopic in subtopics:
            stat = input(f"Enter status for subtopic '{subtopic.name}' (interested, not_interested, not_done, done): ").strip().lower()

            if stat not in valid_status:
                print("Invalid status. Please enter a valid status.")
                continue

            if stat == "not_done":
                continue  # Skip "not_done"

            if stat == "done":
                print(f"Deleting subtopic '{subtopic.name}' (marked as done).")
                subtopic.delete()  # Directly delete subtopic
            else:
                subtopic.status = stat
                subtopic.save()

        # Delete topic if all subtopics are gone
        if not SubTopic.objects.filter(topic=topic).exists():
            print(f"Deleting topic '{topic.name}' (all subtopics are done).")
            topic.delete()  

    return JsonResponse({"message": "Subtopics and topics updated successfully!"})