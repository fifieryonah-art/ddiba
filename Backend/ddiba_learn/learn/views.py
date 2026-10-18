from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .ai_services import adapt_content
from .serializers import LoginSerializer, RegisterSerializer

@api_view(["POST"])
def adapt_lesson(request):
    text = request.data.get("text")
    mode = request.data.get("mode", "simplify")

    if not text:
        return Response({"error": "No text provided"}, status=400)

    adapted = adapt_content(text, mode)
    return Response({"adapted_text": adapted})


@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "username": user.username}, status=201)
    return Response(serializer.errors, status=400)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data["user"]
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "username": user.username})
    return Response(serializer.errors, status=400)