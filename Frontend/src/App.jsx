import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/onboarding" element={<OnboardingIntro />} />
      <Route path="/onboarding/learning-style" element={<LearningStyle />} />
      <Route path="/onboarding/explanations" element={<ExplanationPreference />} />
      <Route path="/onboarding/reading-support" element={<ReadingSupport />} />
      <Route path="/onboarding/profile" element={<ProfileSummary />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/upload" element={<UploadMaterial />} />
      <Route path="/lesson" element={<LessonView />} />
      <Route path="/practice" element={<Practice />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/flashcards" element={<FlashcardDeck />} />
      <Route path="/session-summary" element={<SessionSummary />} />
      <Route path="/subscription" element={<Subscription />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
