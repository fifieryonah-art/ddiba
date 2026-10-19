# Ddiba Adaptive Learning Frontend

Starter React + Vite frontend based on the Ddiba Stitch prototype.

## Run

```bash
npm install
npm run dev
```

For Google sign-in, create a local `.env` file with `VITE_GOOGLE_CLIENT_ID` set to the OAuth web client ID configured for the frontend origin.

For Render, set `VITE_API_URL` to the deployed Django API URL and add the Render frontend URL as an authorized JavaScript origin in Google Cloud Console.

## Main routes

- `/` Welcome
- `/auth` Sign up / login
- `/onboarding`
- `/onboarding/learning-style`
- `/onboarding/explanations`
- `/onboarding/reading-support`
- `/onboarding/profile`
- `/dashboard`
- `/upload`
- `/lesson`
- `/practice`
- `/progress`
- `/flashcards`
- `/session-summary`
- `/subscription`

This is a frontend prototype. Backend API calls can be connected later to Django REST Framework.
