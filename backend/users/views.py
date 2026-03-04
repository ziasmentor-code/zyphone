from django.http import JsonResponse

def test_user(request):
    return JsonResponse({"message": "Users API Working"})