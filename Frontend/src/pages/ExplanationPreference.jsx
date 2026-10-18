import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import LogoMark from "../components/Logo/LogoMark";

const explanationOptions = [
  {
    id: "simple",
    icon: "leaf",
    title: "Keep it simple",
    badge: "Great for quick grasp",
    badgeClass: "green",
    description:
      "Plain language, no overwhelming academic jargon, everyday words.",
  },
  {
    id: "breakdown",
    icon: "list",
    title: "Break it down",
    badge: "Most popular",
    badgeClass: "orange",
    description:
      "Numbered components, cause-and-effect sequences, digestible chunks.",
  },
  {
    id: "deep",
    icon: "microscope",
    title: "Go deeper",
    badge: "For mastery",
    badgeClass: "blue",
    description:
      "Underlying mechanisms, richer context, edge cases, and more nuance.",
  },
];

export default function ExplanationPreference() {
  const navigate = useNavigate();

  const [selected, setSelected] = useState([
    "simple",
    "breakdown",
  ]);

  const toggleOption = (id) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  return (
    <ResponsiveLayout className="explanation-page">

      <header className="onboarding-topbar">

        <button
          className="onboarding-back-btn"
          onClick={() => navigate("/onboarding/learning-style")}
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

      <section className="explanation-progress">

        <div className="explanation-progress-top">
          <span>STEP 2 OF 4</span>
          <span>50% Complete</span>
        </div>

        <div className="explanation-progress-track">
          <div className="explanation-progress-fill"></div>
        </div>

      </section>

      <span className="explanation-flow-label">
        <Icon name="help" /> Personalized Flow
      </span>

      <section className="explanation-heading">

        <h1>
          How should Ddiba
          <br />
          explain things?
        </h1>

        <p>
          Pick your preferred depth and complexity.
          <br />
          You can change this anytime.
        </p>

      </section>

      <section className="explanation-options">

        {explanationOptions.map((option) => {
          const isSelected = selected.includes(option.id);

          return (
            <button
              type="button"
              key={option.id}
              className={`explanation-card ${
                isSelected ? "selected" : ""
              }`}
              onClick={() => toggleOption(option.id)}
            >

              <div className="explanation-icon">
                <Icon name={option.icon} />
              </div>

              <div className="explanation-card-content">

                <h3>{option.title}</h3>

                <span
                  className={`explanation-badge ${option.badgeClass}`}
                >
                  {option.badge}
                </span>

                <p>{option.description}</p>

              </div>

              <div
                className={`explanation-select ${
                  isSelected ? "active" : ""
                }`}
              >
                {isSelected ? "✓" : ""}
              </div>

            </button>
          );
        })}

      </section>

      <div className="explanation-actions">

        <button
          className="explanation-back-action"
          onClick={() =>
            navigate("/onboarding/learning-style")
          }
        >
          <Icon name="arrowLeft" /> Back
        </button>

        <button
          className="explanation-next-action"
          onClick={() =>
            navigate("/onboarding/reading-support")
          }
        >
          Next <Icon name="arrowRight" />
        </button>

      </div>

    </ResponsiveLayout>
  );
}
