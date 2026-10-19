from django.contrib import admin
from django.urls import include, path

from api.views import (
    adapt_lesson,
    practice_questions,
    evaluate_answer,
    learner_profile,
    submit_onboarding,
    dashboard_data,
    progress_data,
    extract_file,
    voice_chat,
    test_api,
)


urlpatterns = [
    path(
        "admin/",
        admin.site.urls,
    ),

    path(
        "api/adapt-lesson/",
        adapt_lesson,
        name="adapt_lesson",
    ),

    path(
        "api/practice-questions/",
        practice_questions,
        name="practice_questions",
    ),

    path(
        "api/evaluate-answer/",
        evaluate_answer,
        name="evaluate_answer",
    ),

    path(
        "api/profile/",
        learner_profile,
        name="learner_profile",
    ),

    path(
        "api/onboarding/",
        submit_onboarding,
        name="submit_onboarding",
    ),

    path(
        "api/dashboard/",
        dashboard_data,
        name="dashboard_data",
    ),

    path(
        "api/progress/",
        progress_data,
        name="progress_data",
    ),

    path(
        "api/extract-file/",
        extract_file,
        name="extract_file",
    ),

    path(
        "api/voice-chat/",
        voice_chat,
        name="voice_chat",
    ),

    path(
        "api/test/",
        test_api,
        name="test_api",
    ),

    path(
        "api/",
        include("learn.urls"),
    ),
]