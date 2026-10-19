import React from "react";
import { useNavigate } from "react-router-dom";

import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import LogoMark from "../components/Logo/LogoMark";

export default function Pricing() {
  const navigate = useNavigate();

  const choosePlan = (plan) => {
    alert(
      `${plan} selected. Payment integration coming soon.`
    );
  };

  return (
    <ResponsiveLayout className="pricing-page">

      <header className="pricing-header">
        <button
          type="button"
          className="pricing-back"
          onClick={() => navigate("/pricing")}
          aria-label="Back to dashboard"
        >
          <Icon name="arrowLeft" />
        </button>

        <div className="pricing-brand">
          <LogoMark size={38} />

          <div>
            <small>Ddiba</small>
            <strong>Learning Plans</strong>
          </div>
        </div>
      </header>

      <section className="pricing-hero">
        <span className="pricing-eyebrow">
          Learn your way
        </span>

        <h1>
          Choose the support that
          works for you.
        </h1>

        <p>
          Start free for one week and upgrade
          when you are ready for more Ddiba
          learning support.
        </p>
      </section>

      <section className="pricing-grid">

        {/* TRIAL */}
        <article className="pricing-card">
          <div className="pricing-card-icon trial">
            <Icon name="sparkle" />
          </div>

          <span className="pricing-label">
            START HERE
          </span>

          <h2>7-Day Trial</h2>

          <div className="pricing-price">
            <strong>FREE</strong>
            <span>for 7 days</span>
          </div>

          <p className="pricing-description">
            Experience Ddiba before choosing
            a paid learning plan.
          </p>

          <ul>
            <li>AI-adapted lessons</li>
            <li>Practice questions</li>
            <li>Smart flashcards</li>
            <li>Basic progress tracking</li>
            <li>Voice learning support</li>
          </ul>

          <button
            type="button"
            className="pricing-button outline"
            onClick={() =>
              choosePlan("7-Day Trial")
            }
          >
            Start Free Trial
          </button>
        </article>

        {/* PRO */}
        <article className="pricing-card featured">
          <span className="pricing-popular">
            MOST POPULAR
          </span>

          <div className="pricing-card-icon pro">
            <Icon name="brain" />
          </div>

          <span className="pricing-label">
            FOR REGULAR LEARNERS
          </span>

          <h2>Ddiba Pro</h2>

          <div className="pricing-price">
            <strong>UGX 20,000</strong>
            <span>/ month</span>
          </div>

          <p className="pricing-description">
            More personalized learning support
            for consistent study.
          </p>

          <ul>
            <li>Everything in the Trial</li>
            <li>Higher AI lesson limits</li>
            <li>More practice sessions</li>
            <li>More smart flashcards</li>
            <li>Voice conversations</li>
            <li>Detailed progress insights</li>
          </ul>

          <button
            type="button"
            className="pricing-button primary"
            onClick={() =>
              choosePlan("Ddiba Pro")
            }
          >
            Choose Pro
          </button>
        </article>

        {/* PREMIUM */}
        <article className="pricing-card premium-card">
          <div className="pricing-card-icon premium">
            <Icon name="sparkle" />
          </div>

          <span className="pricing-label">
            FULL EXPERIENCE
          </span>

          <h2>Ddiba Premium</h2>

          <div className="pricing-price">
            <strong>UGX 40,000</strong>
            <span>/ month</span>
          </div>

          <p className="pricing-description">
            Ddiba's most complete personalized
            learning experience.
          </p>

          <ul>
            <li>Everything in Pro</li>
            <li>Highest AI usage limits</li>
            <li>Advanced visual learning</li>
            <li>Personalized curriculum support</li>
            <li>Advanced learner insights</li>
            <li>Priority access to new features</li>
          </ul>

          <button
            type="button"
            className="pricing-button premium-button"
            onClick={() =>
              choosePlan("Ddiba Premium")
            }
          >
            Go Premium
          </button>
        </article>

      </section>

      <p className="pricing-note">
        No pressure. Start free and choose
        what works best for your learning journey.
      </p>

    </ResponsiveLayout>
  );
}