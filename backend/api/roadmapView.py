from django.http import JsonResponse
from django.conf import settings
from google import generativeai
import json

def seperate(text): 
    print("Text is:", text)
    new_dict = {}

    # Remove unnecessary newlines and excessive spaces
    text = text.replace("\n", "").strip()

    topic_segregation = text.split("//")

    for topic in topic_segregation:
        temp = topic.split(">")

        if len(temp) < 2:
            continue

        main_topic = temp[0].strip()  # Clean the topic name
        subtopics = [st.strip() for st in temp[1].split(",")]  # Clean each subtopic

        print(f"Main topic: {main_topic}, Subtopics: {subtopics}")
        new_dict[main_topic] = subtopics

    return new_dict


def generatefromPrompt(prompt, model, context):

    main_prompt = "No generation of conclusion or introduction by yourself just pure text!! Do not generate any questions for user!! Generate the response in following format: Main Topic > All possible subtopics in format st1, st2,..,sn//.Each main topic should be on the next line" 

    prompt = prompt + ".\n The previous context is: \n" + context
    try:
        response = model.generate_content(prompt + "\n" + main_prompt)
        return response.text
    except Exception as e:
        return ""

def generatecontent(language, roadmap_requirements):

    api_key = settings.GEMINI_API_KEY

    if not api_key:
        return {"error": "Gemini API key not found in settings."}, 500

    generativeai.configure(api_key=api_key)
    model = generativeai.GenerativeModel('gemini-2.0-flash')
    response_dict = {}
    context = ""

    for content in roadmap_requirements:
        print(content)
        prompt = "Generate" + content + "for" + language + "in points"
        newresponse = generatefromPrompt(prompt, model, context)

        newresponse.replace("*", "")

        if(len(newresponse) > 80):
            summary_prompt = f"Summarize the following text: {newresponse}" + "in 100 words"
            summary  = generatefromPrompt(summary_prompt, model, context)
    
            if summary:
                context += ("For "+ content + "summarised contexted response is : " + summary + "\n")
                newresponse = summary
            else:        
                break
        
        ndict = seperate(newresponse)
        response_dict[content] = ndict  

    try:
        jsonfile = json.dumps(response_dict)

    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")


    return jsonfile

def roadmap(request):
    language = "python"
    roadmap_requirements = ["Topics to be covered"]

    Jsonf = generatecontent(language, roadmap_requirements)

    print(Jsonf)
    #return JsonResponse({"message": "Hello from Django!"})
    return JsonResponse(Jsonf, safe=False)
