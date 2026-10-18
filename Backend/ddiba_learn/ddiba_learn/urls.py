"""
URL configuration for ddiba_learn project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# from django.contrib import admin
# from django.urls import path

from django.contrib import admin
from django.urls import include, path
from api.views import test_api
from api.views import submit_onboarding

from api.views import (
    adapt_lesson,
    practice_questions,
    evaluate_answer,
    learner_profile,
)

urlpatterns = [
    path("admin/", admin.site.urls),

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

    path("api/onboarding/", submit_onboarding, name="submit_onboarding"),
    path("api/", include("learn.urls")),
]