from django.http import JsonResponse
from django.conf import settings
from google import generativeai
import json


def generatefromPrompt(prompt, model,type_res):
    words = 50
    if(type_res == "long"):
        words = 100
    else:
        words = 150

    main_prompt = f"No generation of conclusion or introduction by yourself just pure text!! Do not generate any questions for user!! Generate the {type_res} response of around {words} words" 

    try:
        response = model.generate_content(prompt + "\n" + main_prompt)
        return response.text
    except Exception as e:
        return ""

def generatecontent(language, topic, type_res):

    api_key = settings.GEMINI_API_KEY

    if not api_key:
        return {"error": "Gemini API key not found in settings."}, 500

    generativeai.configure(api_key=api_key)
    model = generativeai.GenerativeModel('gemini-2.0-flash')
    response_dict = {} 

    prompt = "Generate explantion of " + topic + "for" + language + "."
    newresponse = generatefromPrompt(prompt, model, type_res)

    newresponse.replace("*", "")
    response_dict[topic] = newresponse  

    try:
        jsonfile = json.dumps(response_dict)

    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")

    return jsonfile

def sample_api(request):
    language = "python"
    topic = "Arrays"
    type_res = "long"

    Jsonf = generatecontent(language, topic, type_res)

    print(Jsonf)
    return JsonResponse(Jsonf, safe=False)