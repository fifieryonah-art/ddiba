import React, { useEffect, useState } from "react";
import { apiFetch } from "./services/api";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import OnboardingIntro from "./pages/OnboardingIntro";
import LearningStyle from "./pages/LearningStyle";
import ExplanationPreference from "./pages/ExplanationPreference";
import ReadingSupport from "./pages/ReadingSupport";
import ProfileSummary from "./pages/ProfileSummary";
import Dashboard from "./pages/Dashboard";
import UploadMaterial from "./pages/UploadMaterial";
import LessonView from "./pages/LessonView";
import Practice from "./pages/Practice";
import Progress from "./pages/Progress";
import FlashcardDeck from "./pages/FlashcardDeck";
import SessionSummary from "./pages/SessionSummary";
import Subscription from "./pages/Subscription";
import Flashcards from "./pages/Flashcards";
import Pricing from "./pages/Pricing";
import Settings from "./pages/Settings";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("ddiba_token");

  const [loaded, setLoaded] = useState(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;

    setError("");
    if (token) apiFetch("/api/profile/").then(data => {
      if (active) setLoaded({path: location.pathname, token, profile: data});
    }).catch(err => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [token, location.pathname, attempt]);
  if (!token) return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  if (error) return <div role="alert"><p>{error}</p><button onClick={() => setAttempt(value => value + 1)}>Try again</button><a href="/auth">Sign in</a></div>;
  if (!loaded || loaded.path !== location.pathname || loaded.token !== token) return <p role="status">Loading your learning profile…</p>;
  const profile = loaded.profile;
  if (!profile.onboarding_complete && !location.pathname.startsWith("/onboarding")) {
    return <Navigate to="/onboarding" replace />;
  }

  if (profile.onboarding_complete && location.pathname.startsWith("/onboarding")) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function PublicAuthRoute() {
  if (localStorage.getItem("ddiba_token")) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Auth />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/auth" element={<PublicAuthRoute />} />
      <Route path="/onboarding" element={<ProtectedRoute><OnboardingIntro /></ProtectedRoute>} />
      <Route path="/onboarding/learning-style" element={<ProtectedRoute><LearningStyle /></ProtectedRoute>} />
      <Route path="/onboarding/explanations" element={<ProtectedRoute><ExplanationPreference /></ProtectedRoute>} />
      <Route path="/onboarding/reading-support" element={<ProtectedRoute><ReadingSupport /></ProtectedRoute>} />
      <Route path="/onboarding/profile" element={<ProtectedRoute><ProfileSummary /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/upload" element={<ProtectedRoute><UploadMaterial /></ProtectedRoute>} />
      <Route path="/lesson" element={<ProtectedRoute><LessonView /></ProtectedRoute>} />
      <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
      <Route path="/flashcards" element={<ProtectedRoute><Flashcards /></ProtectedRoute>} />
      <Route path="/session-summary" element={<ProtectedRoute><SessionSummary /></ProtectedRoute>} />
      <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route
        path="/pricing"
        element={<Pricing />}
      />

    </Routes>
  );
}
