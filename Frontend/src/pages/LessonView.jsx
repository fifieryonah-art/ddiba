import React, { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import LogoMark from "../components/Logo/LogoMark";

export default function LessonView() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    originalText = "",
    simplifiedText = "",
    keyPoints = [],
    subject = "General",
    preferences = {},
  } = location.state || {};

  const [isSpeaking, setIsSpeaking] = useState(false);

  /*
   * Stop speech when the learner leaves this screen.
   */
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleReadAloud = () => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!simplifiedText) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      simplifiedText
    );

    /*
     * A gentle learner pace can be slightly slower.
     */
    utterance.rate =
      preferences.pace === "gentle" ? 0.9 : 1;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    setIsSpeaking(true);
  };

  const handlePractice = () => {
    if (!simplifiedText) {
      return;
    }

    navigate("/practice", {
      state: {
        adaptedText: simplifiedText,
        subject,
      },
    });
  };

  const preferenceLabels = [];

  if (preferences.short_explanations) {
    preferenceLabels.push("Short explanations");
  }

  if (preferences.step_by_step) {
    preferenceLabels.push("Step-by-step");
  }

  if (preferences.examples) {
    preferenceLabels.push("Examples");
  }

  return (
    <ResponsiveLayout className="lesson-page">

      <header className="lesson-header">

        <button
          className="lesson-back-btn"
          onClick={() => navigate("/upload")}
          aria-label="Go back"
        >
          <Icon name="arrowLeft" />
        </button>

        <div className="lesson-brand">
          <LogoMark size={31} />
          <span>Lesson View</span>
        </div>

        <div className="lesson-header-actions">

          <button
            type="button"
            aria-label={
              isSpeaking
                ? "Stop reading aloud"
                : "Read lesson aloud"
            }
            onClick={handleReadAloud}
          >
            <Icon name="volume" />
          </button>

          <button
            type="button"
            aria-label="Bookmark lesson"
          >
            🔖
          </button>

        </div>

      </header>

      <section className="lesson-meta-row">

        <span className="lesson-subject-pill">
          <Icon name="leaf" /> {subject}
        </span>

      </section>

      <section className="lesson-title-section">

        <h1>
          <Icon name="leaf" /> Your Adapted Lesson
        </h1>

        <div className="lesson-calibration-pill">

          <Icon name="list" />

          {preferenceLabels.length > 0
            ? `Calibrated to: ${preferenceLabels.join(
                " • "
              )}`
            : "Calibrated to your learning profile"}

        </div>

      </section>

      {!simplifiedText ? (

        <section className="lesson-key-card">

          <div className="lesson-card-label">
            <Icon name="sparkle" /> No lesson loaded
          </div>

          <p>
            Go back and add learning material so Ddiba
            can create an adapted lesson for you.
          </p>

          <button
            type="button"
            onClick={() => navigate("/upload")}
          >
            Create a lesson
          </button>

        </section>

      ) : (

        <>

          <section className="concept-card">

            <div className="concept-card-heading">

              <div>
                <span>ADAPTED FOR YOU</span>
                <h2>{subject} Learning</h2>
              </div>

              <span className="active-lens-pill">
                <Icon name="sparkle" /> Active Lens
              </span>

            </div>

            <p
              style={{
                whiteSpace: "pre-line",

                fontSize:
                  preferences.larger_text
                    ? "18px"
                    : undefined,

                lineHeight:
                  preferences.more_spacing
                    ? "1.9"
                    : undefined,

                letterSpacing:
                  preferences.more_spacing
                    ? "0.02em"
                    : undefined,
              }}
            >
              {simplifiedText}
            </p>

          </section>

          {keyPoints.length > 0 && (

            <section className="lesson-key-card">

              <div className="lesson-card-label">
                <Icon name="sparkle" /> Key Ideas
              </div>

              <div>

                {keyPoints.map((point, index) => (

                  <div
                    key={`${point}-${index}`}
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "12px",
                      alignItems: "flex-start",
                    }}
                  >

                    <strong>
                      {index + 1}.
                    </strong>

                    <p
                      style={{
                        margin: 0,

                        fontSize:
                          preferences.larger_text
                            ? "18px"
                            : undefined,

                        lineHeight:
                          preferences.more_spacing
                            ? "1.9"
                            : undefined,
                      }}
                    >
                      {point}
                    </p>

                  </div>

                ))}

              </div>

            </section>

          )}

          {preferences.step_by_step &&
            keyPoints.length > 0 && (

              <section className="lesson-breakdown-card">

                <div className="lesson-breakdown-title">

                  <span className="breakdown-icon">
                    <Icon name="list" />
                  </span>

                  <h3>Step-by-step breakdown</h3>

                </div>

                {keyPoints.map((point, index) => (

                  <div
                    className="breakdown-step"
                    key={`step-${index}`}
                  >

                    <div className="breakdown-number">
                      {index + 1}
                    </div>

                    <div>
                      <p>{point}</p>
                    </div>

                  </div>

                ))}

              </section>

            )}

          {originalText && (

            <section className="lesson-analogy-card">

              <div className="lesson-analogy-heading">

                <span>
                  <Icon name="book" /> Original Material
                </span>

                <span className="mental-model-pill">
                  Before adaptation
                </span>

              </div>

              <p
                style={{
                  whiteSpace: "pre-line",
                }}
              >
                {originalText}
              </p>

            </section>

          )}

          <section className="lesson-check-card">

            <div>

              <span>
                Ready to check your understanding?
              </span>

              <strong>
                Ddiba will create practice questions
                from this lesson.
              </strong>

            </div>

            <button
              type="button"
              onClick={handlePractice}
            >
              Practice <Icon name="arrowRight" />
            </button>

          </section>

        </>

      )}

    </ResponsiveLayout>
  );
}