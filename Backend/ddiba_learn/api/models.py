from django.db import models
from django.contrib.auth.models import User


class LearnerProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="learner_profile"
    )
    short_explanations = models.BooleanField(default=True)
    step_by_step = models.BooleanField(default=True)
    examples = models.BooleanField(default=True)
    listening_enabled = models.BooleanField(default=False)

    explanation_depth = models.CharField(
        max_length=20,
        choices=[
            ("simple", "Keep it simple"),
            ("breakdown", "Break it down"),
            ("deep", "Go deeper"),
        ],
        blank=True,
    )

    larger_text = models.BooleanField(default=False)
    more_spacing = models.BooleanField(default=False)
    shorter_paragraphs = models.BooleanField(default=False)
    highlight_words = models.BooleanField(default=False)
    read_aloud = models.BooleanField(default=False)

    pace = models.CharField(max_length=50, default="gentle")

    onboarding_complete = models.BooleanField(default=False)

    learning_goal = models.CharField(max_length=255, blank=True)
    questions_answered = models.PositiveIntegerField(default=0)
    strong_topics = models.JSONField(default=list, blank=True)
    weak_topics = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} learner profile"


class StudyMaterial(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="study_materials",
        null=True,
        blank=True
    )
    title = models.CharField(max_length=255, blank=True)
    subject = models.CharField(max_length=100, blank=True)
    original_text = models.TextField()
    adapted_text = models.TextField(blank=True)
    key_points = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title or f"Study material {self.pk}"


class Question(models.Model):
    QUESTION_TYPES = [
        ("multiple_choice", "Multiple Choice"),
        ("free_text", "Free Text"),
    ]
    study_material = models.ForeignKey(
        StudyMaterial,
        on_delete=models.CASCADE,
        related_name="questions",
        null=True,
        blank=True
    )
    question = models.TextField()
    question_type = models.CharField(
        max_length=30,
        choices=QUESTION_TYPES,
        default="free_text"
    )
    options = models.JSONField(default=list, blank=True)
    reference_answer = models.TextField()
    topic = models.CharField(max_length=150, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question[:60]


class Result(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="results",
        null=True,
        blank=True
    )
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="results",
        null=True,
        blank=True
    )
    student_answer = models.TextField()
    correct = models.BooleanField(default=False)
    feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Result {self.pk}"