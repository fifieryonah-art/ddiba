import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import LogoLockup from "../components/Logo/LogoLockup";

export default function Welcome() {
  const navigate = useNavigate();

  const brandPanel = (
    <section className="welcome-brand-panel">

      {/* Top */}
      <header className="welcome-header">
        <span className="gentle-pill">
          <Icon name="leaf" /> Gentle Pace
        </span>
      </header>

      {/* Hero */}
      <section className="welcome-hero-section">

        <span className="floating-chip chip-stories">
          <Icon name="book" /> Stories & Text
        </span>

        <span className="floating-chip chip-ai">
          <Icon name="sparkle" /> AI Tailored
        </span>

        <span className="sparkle-bubble">
          <Icon name="sparkle" />
        </span>

          <div className="welcome-hero-circle">
            <LogoLockup markSize={72} className="ddiba-logo-lockup--hero" />
        </div>

        <span className="floating-chip chip-mindmaps">
          <Icon name="network" /> Mindmaps
        </span>

        <span className="floating-chip chip-visuals">
          <Icon name="lightbulb" /> Quick Visuals
        </span>

      </section>

      <span className="stress-pill">
        <Icon name="sparkle" /> Stress-Free Study
      </span>

    </section>
  );

  const contentPanel = (
    <section className="welcome-content-panel">

      <div className="welcome-content-main">
        {/* Main text */}
        <section className="welcome-text">
          <h1>Learn your way.</h1>

          <p>
            An AI learning companion that adapts
            to how you learn—without judgment or
            rush.
          </p>
        </section>

        {/* Buttons */}
        <div className="welcome-actions">

          <button
            className="welcome-btn primary"
            onClick={() => navigate("/auth")}
          >
            Get Started
            <Icon name="arrowRight" />
          </button>

          <button
            className="welcome-btn secondary"
            onClick={() => navigate("/auth")}
          >
            Log In
          </button>

        </div>
      </div>

      {/* Bottom reassurance */}
      <div className="welcome-reassurance">
        <span className="reassurance-icon"><Icon name="sparkle" /></span>

        <p>
          Learning should adapt to the learner.
        </p>
      </div>

    </section>
  );

  return (
    <ResponsiveLayout
      className="welcome-page"
      mode="split"
      left={brandPanel}
      right={contentPanel}
    />
  );
}
