import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import PageHeader from "../components/layout/PageHeader";
import BottomNav from "../components/layout/BottomNav";

export default function SessionSummary() {
  const navigate = useNavigate();

  return (
    <ResponsiveLayout className="session-summary-page prototype-session-summary-page">
      <PageHeader variant="session" title="Session Milestone" logoSize={32} rightContent={<span className="session-streak-pill"><Icon name="flame" /> 5 Days</span>} />

      <section className="session-summary-hero">
        <div className="session-summary-award"><Icon name="sparkle" /></div>
        <span className="session-complete-badge"><Icon name="sparkle" /> Calm Milestone Achieved</span>
        <h1>Sensational job, Sarah!</h1>
        <p>You completed your study session without pressure or rush.</p>
      </section>

      <section className="session-performance-card">
        <div className="session-card-heading"><h3>Session Milestone</h3><span>Today</span></div>
        <div className="session-summary-milestone-row"><span><Icon name="book" /> Flashcards Mastered</span><strong>5 of 5</strong></div>
        <div className="session-summary-milestone-row"><span><Icon name="clock" /> Mindful Focus Time</span><strong>12 mins</strong></div>
        <div className="session-summary-milestone-row"><span><Icon name="sparkle" /> XP Earned</span><strong className="session-xp-value">+75 XP</strong></div>
      </section>

      <div className="session-summary-actions">
        <button className="session-primary-btn" onClick={() => navigate("/progress")}>View Full Progress Chart <Icon name="arrowRight" /></button>
        <button className="session-secondary-btn" onClick={() => navigate("/dashboard")}>Return to Dashboard</button>
      </div>

      <BottomNav />
    </ResponsiveLayout>
  );
}
