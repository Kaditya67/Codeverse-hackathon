from django.http import JsonResponse
from django.conf import settings
from google import generativeai

def generatecontent(language, roadmap_requirements):

    api_key = settings.GEMINI_API_KEY

    if not api_key:
        return {"error": "Gemini API key not found in settings."}, 500

    generativeai.configure(api_key=api_key)
    model = generativeai.GenerativeModel('gemini-2.0-flash')
    response_dict = {}
    final_responses = []  # Use a list for efficient string joining

    for content in roadmap_requirements:
        print(content)
        prompt = f"Generate {content} for {language} in points."
        try:
            response = model.generate_content(prompt)
            newresponse = str(response.text).replace("*", "")  # Correct string replacement
            print(newresponse)
            print()
            response_dict[content] = newresponse
            final_responses.append(newresponse)  # Append to the list
        except Exception as e:
            return {"error": f"Gemini API error: {str(e)}"}, 500 #return error if genai fails.

    finalresponse = "".join(final_responses)  # Join the list into a single string
    return response_dict, 200

def sample_api(request):
    # language = "python"
    # roadmap_requirements = ["Topics to be covered", "Resources", "Self learning projects", "Main Roadmap"]
    # response, status_code = generatecontent(language, roadmap_requirements)

    # if status_code != 200:
    #     return JsonResponse(response, status=status_code)

    # return JsonResponse(response)
    return JsonResponse({"message": "Hello from Django!"})
