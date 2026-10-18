import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import LogoMark from "../components/Logo/LogoMark";

export default function SessionSummary() {
  const navigate = useNavigate();

  return (
    <ResponsiveLayout className="session-summary-page">

      <header className="session-summary-header">
        <button
          className="session-back-btn"
          onClick={() => navigate("/flashcards")}
          aria-label="Go back"
        >
          <Icon name="arrowLeft" />
        </button>

        <div className="session-header-title">
          <LogoMark size={31} />
          <span>Session Summary</span>
        </div>

        <div className="session-avatar">S</div>
      </header>

      <section className="session-summary-hero">
        <span className="session-complete-badge">
          ✓ Session Completed
        </span>

        <h1>Great session, Sarah! <Icon name="sun" /></h1>

        <p>
          You reviewed 15 flashcards with calm, focused recall.
        </p>

        <div className="session-mastery-ring">
          <div className="session-mastery-inner">
            <strong>80%</strong>
            <span>Mastery</span>
          </div>
        </div>
      </section>

      <section className="session-performance-card">

        <div className="session-card-heading">
          <h3>Session Performance</h3>
          <span>15 Cards</span>
        </div>

        <div className="session-performance-grid">

          <div className="session-performance-stat mastered">
            <strong>12</strong>
            <span>Mastered</span>
          </div>

          <div className="session-performance-stat refresh">
            <strong>3</strong>
            <span>To Refresh</span>
          </div>

        </div>

        <div className="session-divider"></div>

        <div className="session-detail-row">
          <span><Icon name="clock" /> Time spent</span>
          <strong>5 mins</strong>
        </div>

        <div className="session-detail-row">
          <span><Icon name="flame" /> 4-day streak intact!</span>
          <strong>+35 XP</strong>
        </div>

      </section>

      <section className="session-topic-section">

        <div className="session-topic-heading">
          <h3>Spaced Repetition Status</h3>
          <span>Next review plan</span>
        </div>

        <div className="session-topic-card">

          <article className="session-topic-row">
            <div className="session-topic-copy">
              <strong>Chloroplast Structure</strong>
              <span>100% Mastered</span>
            </div>

            <div className="session-topic-progress">
              <div style={{ width: "100%" }}></div>
            </div>
          </article>

          <article className="session-topic-row">
            <div className="session-topic-copy">
              <strong>Light vs Dark Reactions</strong>
              <span>85% Solid</span>
            </div>

            <div className="session-topic-progress">
              <div style={{ width: "85%" }}></div>
            </div>
          </article>

          <article className="session-topic-row">
            <div className="session-topic-copy">
              <strong>Calvin Cycle Reactants</strong>
              <span>55% • Review tomorrow</span>
            </div>

            <div className="session-topic-progress needs-work">
              <div style={{ width: "55%" }}></div>
            </div>
          </article>

        </div>

      </section>

      <section className="session-insight-card">

        <div className="session-insight-icon">
          <Icon name="sparkle" />
        </div>

        <div className="session-insight-copy">
          <span>Ddiba's Adaptive Insight</span>

          <p>
            Tomorrow, start with Calvin Cycle reactants before
            adding new material.
          </p>
        </div>

      </section>

      <div className="session-summary-actions">

        <button
          className="session-primary-btn"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>

        <button
          className="session-secondary-btn"
          onClick={() => navigate("/flashcards")}
        >
          Review Deck
        </button>

      </div>

    </ResponsiveLayout>
  );
}
