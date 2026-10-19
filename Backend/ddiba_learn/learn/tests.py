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
