from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from .ai_services import adapt_content
from .serializers import GoogleLoginSerializer, LoginSerializer, RegisterSerializer
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

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


@api_view(["POST"])
@permission_classes([AllowAny])
def google_login_view(request):
    serializer = GoogleLoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    try:
        google_user = id_token.verify_oauth2_token(
            serializer.validated_data["credential"],
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )
    except ValueError:
        return Response({"detail": "The Google sign-in token is invalid or expired."}, status=400)

    email = google_user.get("email")
    if not email or not google_user.get("email_verified"):
        return Response({"detail": "Google did not provide a verified email address."}, status=400)

    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            "username": email,
            "first_name": google_user.get("given_name", ""),
        },
    )
    if not user.is_active:
        return Response({"detail": "This user account is inactive."}, status=400)

    if created:
        user.set_unusable_password()
        user.save(update_fields=["password"])

    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        "token": token.key,
        "username": user.username,
        "first_name": user.first_name,
    })