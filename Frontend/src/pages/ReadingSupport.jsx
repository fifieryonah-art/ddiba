import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import LogoMark from "../components/Logo/LogoMark";
import { apiFetch } from "../services/api";

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

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggleSupport = (id) => {
    setEnabled((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const handleContinue = async () => {
    try {
      setSaving(true);
      setError("");

      await apiFetch("/api/profile/", {
        method: "PATCH",
        body: JSON.stringify({
          larger_text:
            enabled.includes("largerText"),

          more_spacing:
            enabled.includes("spacing"),

          shorter_paragraphs:
            enabled.includes("shortParagraphs"),

          highlight_words:
            enabled.includes("highlight"),

          read_aloud:
            enabled.includes("readAloud"),
        }),
      });

      navigate("/onboarding/profile");

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Something went wrong while saving your preferences."
      );

    } finally {
      setSaving(false);
    }
  };

  return (
    <ResponsiveLayout className="reading-support-page">

      <header className="onboarding-topbar">

        <button
          className="onboarding-back-btn"
          onClick={() =>
            navigate("/onboarding/explanations")
          }
          aria-label="Go back"
          disabled={saving}
        >
          <Icon name="arrowLeft" />
        </button>

        <div className="onboarding-brand">
          <LogoMark size={31} />
          <span>Onboarding Goals</span>
        </div>

        <div className="onboarding-avatar">
          S
        </div>

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

        <p
          style={{
            fontSize:
              enabled.includes("largerText")
                ? "19px"
                : undefined,

            lineHeight:
              enabled.includes("spacing")
                ? "2"
                : undefined,

            letterSpacing:
              enabled.includes("spacing")
                ? "0.03em"
                : undefined,
          }}
        >
          Neurodiversity-first learning reduces
          cognitive friction. Every thought flows
          clearly and patiently.
        </p>

      </section>

      <section className="reading-support-list">

        {supportOptions.map((option) => {
          const isEnabled =
            enabled.includes(option.id);

          return (
            <button
              key={option.id}
              type="button"
              className="reading-support-card"
              onClick={() =>
                toggleSupport(option.id)
              }
              disabled={saving}
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

      {error && (
        <div
          style={{
            marginTop: "14px",
            padding: "11px 12px",
            borderRadius: "12px",
            background: "#fff0f2",
            color: "#a2394a",
            fontSize: "12px",
          }}
        >
          {error}
        </div>
      )}

      <button
        className="reading-continue-btn"
        onClick={handleContinue}
        disabled={saving}
      >
        {saving ? (
          "Saving..."
        ) : (
          <>
            Continue <Icon name="arrowRight" />
          </>
        )}
      </button>

    </ResponsiveLayout>
  );
}