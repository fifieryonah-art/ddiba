import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import PageHeader from "../components/layout/PageHeader";

export default function OnboardingIntro() {
  const navigate = useNavigate();

  return (
    <ResponsiveLayout className="onboarding-intro-page" mode="wide">

      <PageHeader title="Onboarding Goals" backTo="/auth" />

      <section className="onboarding-hero-card">

        <div className="onboarding-hero-circle">
          <div className="onboarding-hero-icon"><Icon name="brain" /></div>
        </div>

        <span className="onboarding-start-pill">
          <Icon name="brain" /> A thoughtful start
        </span>

        <h1>Let's get to know how you learn.</h1>

        <p>
          Everyone learns differently. Tell Ddiba what works best for you.
        </p>

      </section>

      <section className="onboarding-benefits">

        <article className="onboarding-benefit-card">
          <div className="benefit-icon purple">
            <Icon name="brain" />
          </div>

          <div className="benefit-copy">
            <h3>Tailored to your brain</h3>

            <p>
              Pacing and formats tuned precisely for your cognitive flow.
            </p>
          </div>
        </article>

        <article className="onboarding-benefit-card">
          <div className="benefit-icon green">
            <Icon name="sparkle" />
          </div>

          <div className="benefit-copy">
            <h3>Zero pressure</h3>

            <p>
              No rigid tests or scoring traps—just gentle, supportive insights.
            </p>
          </div>
        </article>

        <article className="onboarding-benefit-card">
          <div className="benefit-icon orange">
            <Icon name="clock" />
          </div>

          <div className="benefit-copy">
            <div className="benefit-heading-row">
              <h3>Takes only 60 seconds</h3>

              <span className="steps-pill">
                4 steps
              </span>
            </div>

            <p>
              A quick check-in so your companion can adapt immediately.
            </p>
          </div>
        </article>

      </section>

      <button
        className="onboarding-main-btn"
        onClick={() => navigate("/onboarding/learning-style")}
      >
        Let's do it <Icon name="arrowRight" />
      </button>

      <button
        className="onboarding-skip-btn"
        onClick={() => navigate("/dashboard")}
      >
        Skip for now
      </button>

    </ResponsiveLayout>
  );
}
