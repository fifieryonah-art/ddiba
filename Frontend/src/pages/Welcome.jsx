import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import LogoLockup from "../components/Logo/LogoLockup";

export default function Welcome() {
  const navigate = useNavigate();

  const brandPanel = (
    <section className="prototype-welcome-brand">
      <div className="prototype-welcome-tag">
        <Icon name="leaf" />
        <span>Gentle Pace</span>
      </div>

      <div className="prototype-welcome-visual">
        <span className="prototype-welcome-chip prototype-welcome-chip--stories">
          <Icon name="book" /> Stories &amp; Text
        </span>
        <span className="prototype-welcome-chip prototype-welcome-chip--ai">
          <Icon name="sparkle" /> AI Tailored
        </span>

        <div className="prototype-welcome-circle">
          <LogoLockup markSize={98} className="prototype-welcome-lockup" />
          <span className="prototype-welcome-sparkle"><Icon name="sparkle" /></span>
        </div>

        <span className="prototype-welcome-chip prototype-welcome-chip--mindmaps">
          <Icon name="network" /> Mindmaps
        </span>
        <span className="prototype-welcome-chip prototype-welcome-chip--visuals">
          <Icon name="lightbulb" /> Quick Visuals
        </span>
      </div>

      <span className="prototype-welcome-stress">
        <Icon name="sparkle" /> Stress-Free Study
      </span>
    </section>
  );

  const contentPanel = (
    <section className="prototype-welcome-content">
      <div className="prototype-welcome-copy">
        <h1>Learn your way.</h1>
        <p>
          An AI learning companion that adapts to how you learn without
          judgment, pressure, or rushing.
        </p>
      </div>

      <section className="prototype-welcome-why">
        <h2>Why Ddiba?</h2>
        <p>
          Traditional learning material often assumes every student learns the
          same way. Ddiba helps remove those barriers for students who process
          information differently, including students with dyslexia.
        </p>
      </section>

      <div className="prototype-welcome-actions">
        <button type="button" onClick={() => navigate("/auth")}>
          Get Started <Icon name="arrowRight" />
        </button>
        <button type="button" onClick={() => navigate("/auth")}>
          Log In
        </button>
      </div>

      <div className="prototype-welcome-reassurance">
        <Icon name="shield" />
        <span>Designed with and for neurodivergent learners</span>
      </div>
    </section>
  );

  return (
    <ResponsiveLayout
      className="welcome-page prototype-welcome-page"
      mode="split"
      left={brandPanel}
      right={contentPanel}
    />
  );
}
