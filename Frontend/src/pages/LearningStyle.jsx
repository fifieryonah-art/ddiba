import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import PageHeader from "../components/layout/PageHeader";

const learningOptions = [
  {
    id: "visual",
    icon: "network",
    title: "Visual & Diagrams",
    description: "Mindmaps, flowcharts, and visual metaphors over blocks of dense text.",
  },
  {
    id: "stepByStep",
    icon: "list",
    title: "Step-by-Step",
    description: "Bite-sized sequential chunks that break big ideas into 1-2-3 paths.",
  },
  {
    id: "stories",
    icon: "book",
    title: "Stories & Analogies",
    description: "Relatable comparisons (like thinking of a cell as a solar bakery).",
  },
  {
    id: "plain",
    icon: "pencil",
    title: "Plain & Direct",
    description: "Clear, crisp sentences without academic jargon or unnecessary filler.",
  },
  {
    id: "audio",
    icon: "volume",
    title: "Audio & Listening",
    description: "Listen to explanations read aloud with calm, unhurried pacing.",
  },
];

export default function LearningStyle() {
  const navigate = useNavigate();

  const [selected, setSelected] = useState([
    "visual",
    "stepByStep",
    "stories",
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

      <PageHeader title="Learning Profile" backTo="/onboarding" />

      <section className="learning-progress-section">

        <div className="learning-progress-top">
          <span>STEP 1 OF 4</span>
          <span>25% COMPLETE</span>
        </div>

        <div className="learning-progress-track">
          <div className="learning-progress-fill"></div>
        </div>

      </section>

      <section className="learning-style-heading">
        <h1>How does information click best for you?</h1>

        <p>
          Select anything that makes sense to you. Choose as many as you like.
        </p>
      </section>

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

              <div className="learning-option-icon">
                <Icon name={option.icon} />
              </div>

              <div className="learning-option-copy">
                <h3>{option.title}</h3>

                <p>{option.description}</p>
              </div>

              <div
                className={`learning-check ${
                  isSelected ? "active" : ""
                }`}
              >
                {isSelected ? "✓" : ""}
              </div>

            </button>
          );
        })}

      </section>

      <button
        className="learning-next-btn"
        disabled={selected.length === 0}
        onClick={() => {
          if (selected.length > 0) {
            navigate("/onboarding/explanations");
          }
        }}
      >
        Next <Icon name="arrowRight" />
      </button>

    </ResponsiveLayout>
  );
}
