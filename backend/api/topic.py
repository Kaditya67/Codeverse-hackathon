from django.http import JsonResponse
from .models import Roadmap, Topic, SubTopic
from django.views.decorators.csrf import csrf_exempt

# Get data for the roadmap based on the existing records in the database
@csrf_exempt
def get_data(request):
    if request.method == 'GET':
        try:
            # Fetch the first roadmap from the database
            roadmap = Roadmap.objects.first()  # This retrieves the first roadmap object

            if not roadmap:
                return JsonResponse({"error": "No roadmap found in the database."}, status=404)

            # Get the language from the retrieved roadmap
            language = roadmap.language

            # Get the topics associated with this roadmap
            topics = Topic.objects.filter(roadmap=roadmap)
            topic_data = {}

            # Iterate over each topic
            for topic in topics:
                # Collect subtopics for each topic
                subtopics = SubTopic.objects.filter(topic=topic)
                subtopic_data = {
                    "not done": [],
                    "interested": [],
                    "not interested": []
                }

                # Group subtopics by their status
                for subtopic in subtopics:
                    if subtopic.status == 'not_done':
                        subtopic_data["not done"].append(subtopic.name)
                    elif subtopic.status == 'interested':
                        subtopic_data["interested"].append(subtopic.name)
                    elif subtopic.status == 'not_interested':
                        subtopic_data["not interested"].append(subtopic.name)

                # Add topic and its subtopics to the response data
                topic_data[topic.name] = subtopic_data

            # Prepare the response data with the roadmap's language and topics
            response_data = {
                "language": language,
                "roadmap_requirements": roadmap.roadmap_requirements,
                "topics": topic_data
            }

            # Return the response data as a formatted JSON response
            return JsonResponse(response_data, safe=False)

        except Exception as e:
            return JsonResponse({"error": f"Failed to fetch data: {str(e)}"}, status=500)
