import textwrap
from django.http import JsonResponse
from django.conf import settings
from google import generativeai
import json
from django.views.decorators.csrf import csrf_exempt
from .models import Roadmap, Topic, SubTopic

def generatefromPrompt(prompt, model):
    """
    Generates content using the Gemini AI model.
    """
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception:
        return "Error generating response."

def format_code(code_snippet):
    """
    Properly formats the generated code snippet for correct indentation.
    """
    if not code_snippet:
        return "Error: Code generation failed."
    return textwrap.dedent(code_snippet.strip())

def generatecontent(language, topic, type_res, code):
    """
    Generates an explanation, a sample code (if required), and a random Q&A for the given topic.
    """
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        return {"error": "Gemini API key not found in settings."}, 500

    generativeai.configure(api_key=api_key)
    model = generativeai.GenerativeModel('gemini-2.0-flash')
    response_dict = {"topic": topic}

    # Generate Explanation
    explanation_prompt = f"Generate a {type_res} explanation of {topic} in {language}."
    response_dict["explanation"] = generatefromPrompt(explanation_prompt, model).replace("*", "")

    # Generate Code Snippet (if required)
    if code:
        code_prompt = f"Generate a well-formatted and properly indented code snippet for {topic} in {language}. Use proper indentation, comments, and best practices. Do not include any explanations, just the code."
        raw_code = generatefromPrompt(code_prompt, model)
        response_dict["code_snippet"] = format_code(raw_code)

    # Generate Random Question & Answer
    qa_prompt = f"Generate a random question related to {topic} in {language} and provide a correct answer. Format it as 'question: <question_text> answer: <answer_text>'."
    qa_response = generatefromPrompt(qa_prompt, model)
    
    # Extract question and answer (basic parsing)
    if "question:" in qa_response and "answer:" in qa_response:
        qa_parts = qa_response.split("answer:")
        response_dict["question"] = qa_parts[0].replace("question:", "").strip()
        response_dict["answer"] = qa_parts[1].strip()
    else:
        response_dict["question"] = "Error generating question."
        response_dict["answer"] = "Error generating answer."

    return response_dict

@csrf_exempt
def generate_conversation(request):
    """
    Django API endpoint to generate content dynamically.
    """
    print("Received request to /chatbot/")  # Debugging log

    if request.method == "POST":
        try:
            print("Request body:", request.body)  # Debugging log
            previous_topic = request.GET.get("previous_topic") 
            if not previous_topic:
                previous_topic = None

            data = json.loads(request.body)
            language = data.get("language")
            topic = data.get("topic")

            print("Topic received:", topic)  # Debugging log

            # update subtopics
            if previous_topic:
                try:
                    SubTopic.objects.filter(topic=Topic.objects.get(name=previous_topic)).update(status="done")
                    Topic.objects.filter(name=previous_topic).update(completed_topics=Topic.objects.get(name=previous_topic).completed_topics + 1)
                except Topic.DoesNotExist:
                    pass
                    
            # Set parameters for generatecontent function
            type_res = "long"  # Adjust response type as needed
            code = False  # Change to True if code snippet is needed

            response_data = generatecontent(language, topic, type_res, code)

            print("Generated response:", response_data)  # Debugging log
            return JsonResponse(response_data, json_dumps_params={'indent': 4})

        except Exception as e:
            print("Error in /chatbot/:", str(e))  # Debugging log
            return JsonResponse({"error": str(e)}, status=500)
    else:
        print("Invalid request method:", request.method)  # Debugging log
        return JsonResponse({"error": "Invalid request method"}, status=400)
