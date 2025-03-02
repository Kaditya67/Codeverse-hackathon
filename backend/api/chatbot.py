# views.py
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from google import generativeai

@csrf_exempt
def get_summary(request):
    """Handle summary requests without code generation"""
    if request.method == 'POST':
        print("Received POST request", request.body)
        try:
            # Parse and validate request data
            data = json.loads(request.body)
            language = data.get('language', '').strip()
            subtopic = data.get('topic', '').strip()
            
            if not language or not subtopic:
                return JsonResponse(
                    {'error': 'Missing language or subtopic parameter'},
                    status=400
                )

            # Generate content without code
            response_data = generate_content(
                language=language,
                topic=subtopic,
                type_res="long"
            )

            if 'error' in response_data:
                return JsonResponse(response_data, status=500)

            return JsonResponse({
                'summary': response_data.get('explanation', '')
            }, json_dumps_params={'indent': 4})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

def generate_content(language, topic, type_res):
    """Generate educational content without code examples"""
    if not settings.GEMINI_API_KEY:
        return {'error': 'API configuration error'}

    try:
        generativeai.configure(api_key=settings.GEMINI_API_KEY)
        model = generativeai.GenerativeModel('gemini-2.0-flash')
        
        # Generate explanation only
        explanation = generate_from_prompt(
            model=model,
            prompt=f"Explain {topic} in {language} for a beginner",
            type_res=type_res
        )
        
        return {
            'explanation': explanation
        }

    except Exception as e:
        return {'error': f'Content generation failed: {str(e)}'}

def generate_from_prompt(model, prompt, type_res="medium"):
    """Generate text content with length control"""
    length_map = {
        "short": 50,
        "medium": 100,
        "long": 150
    }
    word_limit = length_map.get(type_res, 50)
    
    try:
        response = model.generate_content(
            f"{prompt}. Keep it under {word_limit} words. "
            "No markdown formatting. Be concise and technical."
        )
        return response.text.replace('*', '').strip()
    except Exception:
        return "Content unavailable"