import textwrap
from django.http import JsonResponse
from django.conf import settings
from google import generativeai
import json

def generatefromPrompt(prompt, model, type_res):
    words = 50
    if type_res == "long":
        words = 100
    elif type_res == "detailed":
        words = 150

    main_prompt = f"No generation of conclusion or introduction by yourself, just pure text! Do not generate any questions for the user! Just Generate the urls for the resources nothing else than that."

    try:
        response = model.generate_content(prompt + "\n" + main_prompt)
        return response.text
    except Exception:
        return ""

def format_code(code_snippet):
    """
    Properly formats the generated code snippet for correct indentation.
    """
    if not code_snippet:
        return "Error: Code generation failed."

    formatted_code = textwrap.dedent(code_snippet.strip())  # Removes unnecessary indentation
    return formatted_code

def generatecontent(language, topic, type_res, code):
    api_key = settings.GEMINI_API_KEY

    if not api_key:
        return {"error": "Gemini API key not found in settings."}, 500

    generativeai.configure(api_key=api_key)
    model = generativeai.GenerativeModel('gemini-2.0-flash')
    response_dict = {}

    # Generate Explanation
    prompt = f"Generate explanation of {topic} for {language}."
    explanation = generatefromPrompt(prompt, model, type_res)

    explanation = explanation.replace("*", "")  # Clean unwanted markdown
    response_dict["topic"] = topic
    response_dict["explanation"] = explanation

    # Generate Code Snippet (if required)
    if code:
        code_prompt = f"Generate a well-formatted and properly indented sample code for {topic} in {language}, using proper indentation, comments, and best practices. Do not write any explanation, just the code."
        try:
            code_response = model.generate_content(code_prompt)
            raw_code = code_response.text
            formatted_code = format_code(raw_code)  # Format the code before returning
        except Exception:
            formatted_code = "Error generating code"

        print(formatted_code)
        response_dict["code_snippet"] = formatted_code

    return response_dict  # Return as a dictionary instead of JSON string


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def generate_resources(request):
    print("Received request to /chatbot/")  # Debugging log

    if request.method == "POST":
        try:
            print("Request body:", request.body)  # Debugging log
            data = json.loads(request.body)
            topic = data.get("topic")

            print("Topic received:", topic)  # Debugging log

            # Set parameters for generatecontent function
            language = "python"  # Assuming Python as default, adjust if needed
            type_res = "long"  # Adjust response type as needed
            code = False  # Include code snippet

            # Generate content dynamically
            response_data = generatecontent(language, topic, type_res, code)

            print("Generated response:", response_data)  # Debugging log
            return JsonResponse(response_data, json_dumps_params={'indent': 4})  # Pretty-print JSON

        except Exception as e:
            print("Error in /chatbot/:", str(e))  # Debugging log
            return JsonResponse({"error": str(e)}, status=500)
    else:
        print("Invalid request method:", request.method)  # Debugging log
        return JsonResponse({"error": "Invalid request method"}, status=400)
