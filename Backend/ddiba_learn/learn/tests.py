from unittest.mock import patch

from django.test import override_settings
from rest_framework.test import APITestCase


@override_settings(ALLOWED_HOSTS=["testserver"], CORS_ALLOWED_ORIGINS=["https://ddiba.onrender.com"])
class AuthenticationIntegrationTests(APITestCase):
    def signup(self):
        response = self.client.post("/api/register/", {
            "username": "learner@example.com", "email": "learner@example.com",
            "first_name": "Learner", "password": "Testing-learning-987!",
        }, format="json", HTTP_ORIGIN="https://ddiba.onrender.com")
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response["Access-Control-Allow-Origin"], "https://ddiba.onrender.com")
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {response.data['token']}")
        return response.data["token"]

    def test_signup_login_onboarding_dashboard(self):
        token = self.signup()
        response = self.client.post("/api/onboarding/", {
            "learning_style": ["steps"], "explanation_depth": ["simple"],
            "reading_support": ["spacing"],
        }, format="json")
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(self.client.get("/api/dashboard/").status_code, 200)
        self.assertEqual(self.client.get("/api/progress/").status_code, 200)
        self.client.credentials()
        response = self.client.post("/api/login/", {
            "username": "learner@example.com", "password": "Testing-learning-987!",
        }, format="json")
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["token"], token)

    @patch("api.views.adapt_lesson_with_ai", return_value={
        "simplified_text": "Plants use sunlight.", "key_points": ["Sunlight helps plants."],
    })
    def test_authenticated_lesson_uses_original_api(self, generate):
        self.signup()
        response = self.client.post("/api/adapt-lesson/", {
            "text": "Plants use sunlight to make food.", "subject": "Biology",
        }, format="json")
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["simplified_text"], "Plants use sunlight.")
        self.assertIn("material_id", response.data)
        generate.assert_called_once()

    def test_learning_requires_login(self):
        self.assertEqual(self.client.get("/api/dashboard/").status_code, 401)

    def test_health_and_cors_preflight(self):
        self.assertEqual(self.client.get("/api/health/").json(), {"status": "ok"})
        response = self.client.options("/api/register/",
            HTTP_ORIGIN="https://ddiba.onrender.com",
            HTTP_ACCESS_CONTROL_REQUEST_METHOD="POST",
            HTTP_ACCESS_CONTROL_REQUEST_HEADERS="content-type")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Access-Control-Allow-Origin"], "https://ddiba.onrender.com")

    @override_settings(GOOGLE_CLIENT_ID="test-client")
    @patch("learn.views.id_token.verify_oauth2_token", return_value={
        "email": "google@example.com", "email_verified": True, "given_name": "Learner",
    })
    def test_google_login(self, verify):
        response = self.client.post("/api/google/", {"credential": "test-token"}, format="json")
        self.assertEqual(response.status_code, 200, response.data)
        self.assertIn("token", response.data)
        self.assertEqual(verify.call_args.args[2], "test-client")

    @override_settings(GOOGLE_CLIENT_ID="")
    def test_missing_google_configuration(self):
        response = self.client.post("/api/google/", {"credential": "test-token"}, format="json")
        self.assertEqual(response.status_code, 503)


@override_settings(ALLOWED_HOSTS=["testserver"], CORS_ALLOWED_ORIGINS=["https://ddiba.onrender.com"])
class PersonalizationTests(APITestCase):
    signup = AuthenticationIntegrationTests.signup
    def test_new_learner_has_no_sample_progress(self):
        self.signup()
        profile = self.client.get("/api/profile/").data
        self.assertFalse(profile["onboarding_complete"])
        self.assertEqual(profile["learning_styles"], [])
        dashboard = self.client.get("/api/dashboard/").data
        self.assertEqual(dashboard["streak_days"], 1)
        self.assertEqual(dashboard["xp"], 0)
        self.assertEqual(dashboard["lessons_created"], 0)
        self.assertIsNone(dashboard["recent_learning"])
        self.assertEqual(sum(dashboard["active_week_days"]), 1)
        self.assertEqual(self.client.get("/api/dashboard/").data["streak_days"], 1)

    def test_preferences_survive_login_and_reach_lesson_generation(self):
        self.signup()
        preferences = {"learning_styles": ["visual", "stories"], "explanation_depth": "deep",
                       "pace": "steady", "learning_goal": "Understand biology", "onboarding_complete": True}
        response = self.client.patch("/api/profile/", preferences, format="json")
        self.assertEqual(response.status_code, 200, response.data)
        for key, value in preferences.items():
            self.assertEqual(self.client.get("/api/profile/").data[key], value)
        with patch("api.views.adapt_lesson_with_ai", return_value={"simplified_text": "A lesson", "key_points": []}) as generate:
            response = self.client.post("/api/adapt-lesson/", {"text": "Biology material"}, format="json")
            self.assertEqual(response.status_code, 200, response.data)
            for key in ["learning_styles", "pace", "learning_goal", "explanation_depth"]:
                self.assertEqual(generate.call_args.kwargs["preferences"][key], preferences[key])
        self.assertEqual(self.client.get("/api/dashboard/").data["xp"], 20)
        response = self.client.post("/api/login/", {"username": "learner@example.com", "password": "Testing-learning-987!"}, format="json")
        self.assertTrue(response.data["onboarding_complete"])

    def test_streak_counts_consecutive_days_and_resets_after_gap(self):
        from api.models import LearningActivity
        from django.utils import timezone
        from datetime import timedelta
        self.signup()
        from django.contrib.auth import get_user_model
        user = get_user_model().objects.get(username="learner@example.com")
        today = timezone.localdate()
        LearningActivity.objects.create(user=user, date=today - timedelta(days=1))
        LearningActivity.objects.create(user=user, date=today - timedelta(days=2))
        self.assertEqual(self.client.get("/api/dashboard/").data["streak_days"], 3)
        LearningActivity.objects.filter(user=user, date=today - timedelta(days=1)).delete()
        self.assertEqual(self.client.get("/api/dashboard/").data["streak_days"], 1)

    def test_other_learner_does_not_inherit_profile_or_progress(self):
        self.signup()
        self.client.patch("/api/profile/", {"learning_styles": ["audio"], "onboarding_complete": True}, format="json")
        self.client.credentials()
        response = self.client.post("/api/register/", {
            "username": "another@example.com", "email": "another@example.com", "password": "Another-987-study!",
        }, format="json")
        self.assertFalse(response.data["onboarding_complete"])
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {response.data['token']}")
        self.assertEqual(self.client.get("/api/profile/").data["learning_styles"], [])
        self.assertEqual(self.client.get("/api/dashboard/").data["xp"], 0)

    def test_onboarding_is_once_and_settings_do_not_reset_completion(self):
        self.signup()
        response = self.client.patch("/api/profile/", {
            "learning_styles": ["visual"], "explanation_depth": "simple",
            "onboarding_complete": True,
        }, format="json")
        self.assertTrue(response.data["onboarding_complete"])
        for _ in range(2):
            response = self.client.post("/api/login/", {
                "username": "learner@example.com", "password": "Testing-learning-987!",
            }, format="json")
            self.assertTrue(response.data["onboarding_complete"])
            self.assertEqual(self.client.get("/api/dashboard/").status_code, 200)
        response = self.client.patch("/api/profile/", {
            "learning_styles": ["audio"], "pace": "quick",
        }, format="json")
        self.assertTrue(response.data["onboarding_complete"])
        self.assertEqual(response.data["learning_styles"], ["audio"])
