import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import LogoMark from "../components/Logo/LogoMark";

const learningOptions = [
  {
    id: "short",
    icon: "pencil",
    title: "Short explanations",
    description: "Bite-sized summaries without jargon",
  },
  {
    id: "steps",
    icon: "list",
    title: "Step-by-step",
    description: "Sequential, bite-sized stages",
  },
  {
    id: "examples",
    icon: "lightbulb",
    title: "Examples",
    description: "Real-world analogies and stories",
  },
  {
    id: "listening",
    icon: "volume",
    title: "Listening",
    description: "Audio explanations and voice narration",
  },
];

export default function LearningStyle() {
  const navigate = useNavigate();

  const [selected, setSelected] = useState([
    "short",
    "steps",
    "examples",
  ]);

  const toggleOption = (id) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  return (
    <ResponsiveLayout className="learning-style-page">

      <header className="onboarding-topbar">
        <button
          className="onboarding-back-btn"
          onClick={() => navigate("/onboarding")}
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

      <section className="learning-progress-section">

        <div className="learning-progress-top">
          <span>STEP 1 OF 4</span>

          <span className="personalisation-label">
            <Icon name="leaf" /> Personalization
          </span>
        </div>

        <div className="learning-progress-track">
          <div className="learning-progress-fill"></div>
        </div>

      </section>

      <section className="learning-style-heading">
        <h1>How do you learn best?</h1>

        <p>
          Choose everything that helps you understand.
        </p>
      </section>

      <div className="multi-select-info">

        <span>
          <Icon name="lightbulb" /> Multi-select enabled • Tailors your tutor voice
        </span>

        <strong>
          {selected.length}
          <small>selected</small>
        </strong>

      </div>

      <section className="learning-options">

        {learningOptions.map((option) => {
          const isSelected = selected.includes(option.id);

          return (
            <button
              key={option.id}
              type="button"
              className={`learning-option-card ${
                isSelected ? "selected" : ""
              }`}
              onClick={() => toggleOption(option.id)}
            >

              <div className="learning-option-top">

                <div className="learning-option-icon">
                  <Icon name={option.icon} />
                </div>

                <div
                  className={`learning-check ${
                    isSelected ? "active" : ""
                  }`}
                >
                  {isSelected ? "✓" : ""}
                </div>

              </div>

              <div className="learning-option-copy">
                <h3>{option.title}</h3>

                <p>{option.description}</p>
              </div>

            </button>
          );
        })}

      </section>

      <button
        className="learning-next-btn"
        onClick={() => navigate("/onboarding/explanations")}
      >
        Next <Icon name="arrowRight" />
      </button>

    </ResponsiveLayout>
  );
}
