import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import LogoMark from "../components/Logo/LogoMark";

const supportOptions = [
  {
    id: "largerText",
    icon: "list",
    title: "Larger text",
    description:
      "Increase baseline body font size to make reading feel easier and clearer.",
  },
  {
    id: "spacing",
    icon: "spacing",
    title: "More spacing",
    description:
      "Add more line and word spacing to reduce visual crowding.",
  },
  {
    id: "shortParagraphs",
    icon: "list",
    title: "Shorter paragraphs",
    description:
      "Break dense blocks of text into smaller, easier-to-process sections.",
  },
  {
    id: "highlight",
    icon: "pencil",
    title: "Highlight words",
    description:
      "Gently emphasize key terms and important concepts.",
  },
  {
    id: "readAloud",
    icon: "volume",
    title: "Read aloud",
    description:
      "Use natural speech to listen to explanations and study material.",
  },
];

export default function ReadingSupport() {
  const navigate = useNavigate();

  const [enabled, setEnabled] = useState([
    "largerText",
    "spacing",
    "shortParagraphs",
  ]);

  const toggleSupport = (id) => {
    setEnabled((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  return (
    <ResponsiveLayout className="reading-support-page">

      <header className="onboarding-topbar">

        <button
          className="onboarding-back-btn"
          onClick={() => navigate("/onboarding/explanations")}
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

      <section className="reading-progress">

        <div className="reading-progress-top">
          <span>STEP 3 OF 4</span>
          <span>75% Complete</span>
        </div>

        <div className="reading-progress-track">
          <div className="reading-progress-fill"></div>
        </div>

      </section>

      <section className="reading-heading">

        <h1>
          What makes reading
          <br />
          easier for you?
        </h1>

        <p>
          Sensory and accessibility controls designed
          for focus and low fatigue.
        </p>

      </section>

      <section className="reading-preview-card">

        <div className="reading-preview-top">

          <span className="preview-label">
            <Icon name="sparkle" /> Live Preview
          </span>

          <span className="calm-mode-pill">
            Calm Mode
          </span>

        </div>

        <p>
          Neurodiversity-first learning reduces
          cognitive friction. Every thought flows
          clearly and patiently.
        </p>

      </section>

      <section className="reading-support-list">

        {supportOptions.map((option) => {
          const isEnabled = enabled.includes(option.id);

          return (
            <button
              key={option.id}
              type="button"
              className="reading-support-card"
              onClick={() => toggleSupport(option.id)}
            >

              <div className="reading-support-icon">
                <Icon name={option.icon} />
              </div>

              <div className="reading-support-copy">

                <h3>{option.title}</h3>

                <p>{option.description}</p>

              </div>

              <div
                className={`reading-toggle ${
                  isEnabled ? "active" : ""
                }`}
              >
                <span>
                  {isEnabled ? "✓" : ""}
                </span>
              </div>

            </button>
          );
        })}

      </section>

      <button
        className="reading-continue-btn"
        onClick={() => navigate("/onboarding/profile")}
      >
        Continue <Icon name="arrowRight" />
      </button>

    </ResponsiveLayout>
  );
}
