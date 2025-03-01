from django.http import JsonResponse
from django.conf import settings
from google import generativeai
import json
from .models import Roadmap, Topic, SubTopic

def separate(text): 
    new_dict = {}

    # Remove unnecessary newlines and excessive spaces
    text = text.replace("\n", "").strip()

    topic_segregation = text.split(".")

    for topic in topic_segregation:
        temp = topic.split(">")

        if len(temp) < 2:
            continue

        main_topic = temp[0].strip()  # Clean the topic name
        subtopics = [st.strip() for st in temp[1].split(",")]  # Clean each subtopic

        new_dict[main_topic] = {
            "not done": subtopics,
            "interested": [],
            "not interested": []
        }

    return new_dict

def generate_from_prompt(prompt, model, context):
    main_prompt = (
        "No generation of conclusion or introduction by yourself, just pure text!! "
        "Do not generate any questions for the user!! "
        "Generate the response in the following format: Main Topic > All possible subtopics in format st1, st2,..,sn. "
        "Each main topic should be on the next line"
    ) 

    prompt = f"{prompt}.\n The previous context is:\n{context}"
    try:
        response = model.generate_content(prompt + "\n" + main_prompt)
        return response.text.strip() if response.text else ""
    except Exception as e:
        print(f"Error generating response: {e}")
        return ""

def generate_content(language, roadmap_requirements):
    api_key = settings.GEMINI_API_KEY

    if not api_key:
        return {"error": "Gemini API key not found in settings."}, 500

    generativeai.configure(api_key=api_key)
    model = generativeai.GenerativeModel('gemini-2.0-flash')
    response_dict = {}
    context = ""

    for content in roadmap_requirements:
        prompt = f"Generate {content} for {language} in points"
        new_response = generate_from_prompt(prompt, model, context)

        new_response = new_response.replace("*", "")

        if len(new_response) > 80:
            summary_prompt = f"Summarize the following text: {new_response} in 100 words"
            summary = generate_from_prompt(summary_prompt, model, context)
    
            if summary:
                context += f"For {content}, summarized context response is: {summary}\n"
                new_response = summary
        
        if not new_response:
            print(f"Skipping {content} due to empty response from API.")
            continue
        
        ndict = separate(new_response)
        response_dict[content] = ndict  

    return json.dumps(response_dict)  # Ensure JSON format

def roadmap(request):
    language = "python"
    roadmap_requirements = ["Topics to be covered"]

    # Create or update the Roadmap object
    roadmap, _ = Roadmap.objects.update_or_create(
        language=language,
        defaults={"roadmap_requirements": ", ".join(roadmap_requirements)}
    )

    Jsonf = generate_content(language, roadmap_requirements)
    Jsonf = json.loads(Jsonf)  # Convert JSON string to a dictionary

    topics_data = Jsonf.get(roadmap_requirements[0], {})

    for topic_name, details in topics_data.items():
        print(f"Processing Topic: {topic_name}")

        # Create or update the Topic
        topic, _ = Topic.objects.update_or_create(
            name=topic_name,
            roadmap=roadmap
        )

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
        
    return JsonResponse(Jsonf, safe=False)
