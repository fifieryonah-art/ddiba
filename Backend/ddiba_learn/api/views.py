from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import LearnerProfile
from .serializers import (
    AdaptLessonSerializer,
    EvaluateAnswerSerializer,
    LearnerProfileSerializer,
    OnboardingSerializer,
    PracticeQuestionsSerializer,
)


@api_view(["POST"])
def adapt_lesson(request):
    serializer = AdaptLessonSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    text = serializer.validated_data["text"]
    preferences = serializer.validated_data.get("preferences", {})
    simplified_text = (
        "This is a temporary adapted version of the lesson. "
        "Later, the LLM will simplify the vocabulary, shorten sentences, "
        "break content into smaller chunks, and explain difficult terms."
    )
    key_points = [
        "The lesson text was received successfully.",
        "The learner preferences were received successfully.",
        f"Original text length: {len(text)} characters.",
        f"Preferences received: {preferences}",
    ]
    return Response(
        {"simplified_text": simplified_text, "key_points": key_points},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def practice_questions(request):
    serializer = PracticeQuestionsSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    adapted_text = serializer.validated_data["adapted_text"]
    questions = [
        {
            "question": "What is the main idea of this lesson?",
            "type": "free_text",
            "reference_answer": "The learner should explain the main idea in their own words.",
        },
        {
            "question": "Which statement best matches the lesson?",
            "type": "multiple_choice",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "reference_answer": "Option B",
        },
    ]
    return Response(
        {"source_length": len(adapted_text), "questions": questions},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def evaluate_answer(request):
    serializer = EvaluateAnswerSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    question = serializer.validated_data["question"]
    student_answer = serializer.validated_data["student_answer"]
    reference_answer = serializer.validated_data["reference_answer"]
    student_normalized = student_answer.strip().lower()
    reference_normalized = reference_answer.strip().lower()
    correct = student_normalized == reference_normalized
    if correct:
        feedback = "Good work. Your answer matches the expected answer."
    else:
        feedback = (
            "Your answer is not an exact match yet. "
            "Later, the LLM will judge answers semantically and give more helpful feedback."
        )
    return Response(
        {"question": question, "correct": correct, "feedback": feedback},
        status=status.HTTP_200_OK,
    )


@api_view(["GET", "PATCH"])
def learner_profile(request):
    if not request.user.is_authenticated:
        return Response(
            {"detail": "Authentication is required for learner profile access."},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    profile, _ = LearnerProfile.objects.get_or_create(user=request.user)
    if request.method == "GET":
        data = LearnerProfileSerializer(profile).data
        data["username"] = request.user.username
        return Response(data)
    serializer = LearnerProfileSerializer(profile, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


@api_view(["POST"])
def submit_onboarding(request):
    if not request.user.is_authenticated:
        return Response(
            {"detail": "Authentication is required."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    serializer = OnboardingSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    profile, _ = LearnerProfile.objects.get_or_create(user=request.user)

    style = data["learning_style"]
    profile.short_explanations = "short" in style
    profile.step_by_step = "steps" in style
    profile.examples = "examples" in style
    profile.listening_enabled = "listening" in style

    depth = data["explanation_depth"]
    if depth:
        # frontend allows multi-select on this screen; store the first pick
        profile.explanation_depth = depth[0]

    reading = data["reading_support"]
    profile.larger_text = "largerText" in reading
    profile.more_spacing = "spacing" in reading
    profile.shorter_paragraphs = "shortParagraphs" in reading
    profile.highlight_words = "highlight" in reading
    profile.read_aloud = "readAloud" in reading

    profile.onboarding_complete = True
    profile.save()

    return Response(LearnerProfileSerializer(profile).data, status=status.HTTP_200_OK)


@api_view(["GET"])
def test_api(request):
    return Response({"message": "Ddiba backend is connected successfully"})