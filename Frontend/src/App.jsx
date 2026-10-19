import React from "react";
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

function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("ddiba_token");

  if (!token) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
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
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/upload" element={<ProtectedRoute><UploadMaterial /></ProtectedRoute>} />
      <Route path="/lesson" element={<ProtectedRoute><LessonView /></ProtectedRoute>} />
      <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
      <Route path="/flashcards" element={<ProtectedRoute><FlashcardDeck /></ProtectedRoute>} />
      <Route path="/session-summary" element={<ProtectedRoute><SessionSummary /></ProtectedRoute>} />
      <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
