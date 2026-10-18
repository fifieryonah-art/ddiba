from rest_framework import serializers
from .models import LearnerProfile

LEARNING_STYLE_CHOICES = {"short", "steps", "examples", "listening"}
EXPLANATION_DEPTH_CHOICES = {"simple", "breakdown", "deep"}
READING_SUPPORT_CHOICES = {"largerText", "spacing", "shortParagraphs", "highlight", "readAloud"}


def _validate_subset(value, allowed, field_name):
    invalid = set(value) - allowed
    if invalid:
        raise serializers.ValidationError(f"Invalid {field_name} value(s): {sorted(invalid)}")
    return value


class OnboardingSerializer(serializers.Serializer):
    learning_style = serializers.ListField(
        child=serializers.CharField(), required=False, default=list
    )
    explanation_depth = serializers.ListField(
        child=serializers.CharField(), required=False, default=list
    )
    reading_support = serializers.ListField(
        child=serializers.CharField(), required=False, default=list
    )

    def validate_learning_style(self, value):
        return _validate_subset(value, LEARNING_STYLE_CHOICES, "learning_style")

    def validate_explanation_depth(self, value):
        return _validate_subset(value, EXPLANATION_DEPTH_CHOICES, "explanation_depth")

    def validate_reading_support(self, value):
        return _validate_subset(value, READING_SUPPORT_CHOICES, "reading_support")


class PreferencesSerializer(serializers.Serializer):
    short_explanations = serializers.BooleanField(default=True)
    step_by_step = serializers.BooleanField(default=True)
    examples = serializers.BooleanField(default=True)
    pace = serializers.CharField(default="gentle")


class AdaptLessonSerializer(serializers.Serializer):
    text = serializers.CharField()
    preferences = PreferencesSerializer(required=False)


class PracticeQuestionsSerializer(serializers.Serializer):
    adapted_text = serializers.CharField()


class EvaluateAnswerSerializer(serializers.Serializer):
    question = serializers.CharField()
    student_answer = serializers.CharField()
    reference_answer = serializers.CharField()


class LearnerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearnerProfile
        fields = [
            "id",
            "short_explanations",
            "step_by_step",
            "examples",
            "listening_enabled",
            "explanation_depth",
            "larger_text",
            "more_spacing",
            "shorter_paragraphs",
            "highlight_words",
            "read_aloud",
            "pace",
            "onboarding_complete",
            "learning_goal",
            "questions_answered",
            "strong_topics",
            "weak_topics",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "onboarding_complete",
            "questions_answered",
            "strong_topics",
            "weak_topics",
            "created_at",
            "updated_at",
        ]