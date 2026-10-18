import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import LogoMark from "../components/Logo/LogoMark";

export default function ProfileSummary() {
  const navigate = useNavigate();

  const accommodations = [
    "Short explanations",
    "Step-by-step guidance",
    "Real-world examples",
    "Keep it simple",
    "Read aloud enabled",
    "Larger text & relaxed spacing",
  ];

  return (
    <ResponsiveLayout className="profile-summary-page">

      <header className="onboarding-topbar">

        <button
          className="onboarding-back-btn"
          onClick={() => navigate("/onboarding/reading-support")}
          aria-label="Go back"
        >
          <Icon name="arrowLeft" />
        </button>

        <div className="onboarding-brand">
          <LogoMark size={31} />
          <span>Onboarding Goals</span>
        </div>

        <div className="onboarding-avatar">S</div>

      </header>

      <section className="profile-progress">

        <div className="profile-progress-top">
          <span>✓ STEP 4 OF 4 • COMPLETE!</span>
          <span>100% Complete</span>
        </div>

        <div className="profile-progress-track">
          <div className="profile-progress-fill"></div>
        </div>

      </section>

      <section className="profile-summary-heading">

        <h1>Your learning style</h1>

        <p>
          Here is how Ddiba is calibrated for you.
          <br />
          Tailored for <strong>Sarah.</strong>
        </p>

      </section>

      <section className="learner-profile-card">

        <div className="learner-avatar">
          S
        </div>

        <div className="learner-profile-copy">

          <h3>Sarah's Profile</h3>

          <p>Paced & Tactile Explorer</p>

          <span className="profile-ready-pill">
            ● Calibrated & Ready
          </span>

        </div>

      </section>

      <section className="accommodations-card">

        <div className="accommodations-heading">

          <h3><Icon name="list" /> Active Accommodations</h3>

          <span>6 applied</span>

        </div>

        <p className="accommodations-description">
          Customized interaction layers to keep explanations clear,
          low-stress, and engaging.
        </p>

        <div className="accommodation-chips">

          {accommodations.map((item) => (
            <span
              key={item}
              className="accommodation-chip"
            >
              ✓ {item}
            </span>
          ))}

        </div>

      </section>

      <section className="ddiba-promise-card">

        <div className="promise-icon">
          <Icon name="help" />
        </div>

        <div className="promise-copy">

          <h3>Our Promise to You</h3>

          <p>
            Your companion learns with you.
            If something doesn't click, we'll adapt.
          </p>

        </div>

      </section>

      <button
        className="profile-start-btn"
        onClick={() => navigate("/dashboard")}
      >
        Start Learning <Icon name="arrowRight" />
      </button>

    </ResponsiveLayout>
  );
}
