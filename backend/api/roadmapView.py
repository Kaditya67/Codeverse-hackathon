from django.http import JsonResponse
from django.conf import settings
from google import generativeai
import json
from .models import Roadmap, Topic, SubTopic

def separate(text, topic_limit): 
    new_dict = {}

    # Remove unnecessary newlines and excessive spaces
    text = text.replace("\n", "").strip()

    topic_segregation = text.split(".")

    for topic in topic_segregation[:topic_limit]:  # Limit topics
        temp = topic.split(">")

        if len(temp) < 2:
            continue

        main_topic = temp[0].strip()  # Clean the topic name
        subtopics = [st.strip() for st in temp[1].split(",")]  # Allow unlimited subtopics

        new_dict[main_topic] = {
            "not done": subtopics,
            "interested": [],
            "not interested": []
        }

    return new_dict

def generate_from_prompt(prompt, model, context, topic_limit):
    main_prompt = (
        "Generate response in the format: Main Topic > Subtopic1, Subtopic2,... "
        f"Limit the number of topics to {topic_limit} but allow any number of subtopics."
    ) 

    full_prompt = f"{prompt}.\nPrevious context:\n{context}\n{main_prompt}"
    
    try:
        response = model.generate_content(full_prompt)
        return response.text.strip() if response.text else ""
    except Exception as e:
        print(f"Error generating response: {e}")
        return ""

def generate_content(language, roadmap_requirements, topic_limit):
    api_key = settings.GEMINI_API_KEY

    if not api_key:
        return JsonResponse({"error": "Gemini API key not found in settings."}, status=500)

    generativeai.configure(api_key=api_key)
    model = generativeai.GenerativeModel('gemini-2.0-flash')
    response_dict = {}
    context = ""

    for content in roadmap_requirements:
        prompt = f"Generate {content} for {language}"
        new_response = generate_from_prompt(prompt, model, context, topic_limit)

        new_response = new_response.replace("*", "")

        if not new_response:
            print(f"Skipping {content} due to empty response from API.")
            continue
        
        ndict = separate(new_response, topic_limit)
        response_dict[content] = ndict  

    return json.dumps(response_dict)  # Ensure JSON format

def roadmap(request):
    language = "python"
    roadmap_requirements = ["Topics to be covered"]
    topic_limit = 10  # Limit topics but allow unlimited subtopics

    roadmap, _ = Roadmap.objects.update_or_create(
        language=language,
        defaults={"roadmap_requirements": ", ".join(roadmap_requirements)}
    )

    Jsonf = generate_content(language, roadmap_requirements, topic_limit)
    Jsonf = json.loads(Jsonf)  # Convert JSON string to a dictionary

    topics_data = Jsonf.get(roadmap_requirements[0], {})

    existing_topics = {topic.name: topic for topic in Topic.objects.filter(roadmap=roadmap)}

    for topic_name, details in topics_data.items():
        print(f"Processing Topic: {topic_name}")

        # Update if exists, otherwise create
        topic, _ = Topic.objects.update_or_create(
            name=topic_name,
            roadmap=roadmap,
            defaults={}  # No additional fields for now
        )

        # Remove the topic from the existing list (so we know what is stale)
        existing_topics.pop(topic_name, None)

        # Function to update or create subtopics
        def update_or_create_subtopics(subtopic_list, status):
            for subtopic_name in subtopic_list:
                SubTopic.objects.update_or_create(
                    name=subtopic_name,
                    topic=topic,
                    defaults={"status": status}  # Update status
                )

        # Store subtopics in their respective categories
        update_or_create_subtopics(details["not done"], "not_done")
        update_or_create_subtopics(details["interested"], "interested")
        update_or_create_subtopics(details["not interested"], "not_interested")
        
        print("-" * 30)  # Separator for clarity

    # Delete stale topics that were not in the new roadmap
    for stale_topic in existing_topics.values():
        stale_topic.delete()
        
    return JsonResponse(Jsonf, safe=False)
