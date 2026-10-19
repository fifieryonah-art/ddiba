import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import LogoMark from "../components/Logo/LogoMark";
import { apiFetch } from "../services/api";

export default function Flashcards() {
  const navigate = useNavigate();

  const [flashcards, setFlashcards] =
    useState([]);

  const [subject, setSubject] =
    useState("General");

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [showBack, setShowBack] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [knownCount, setKnownCount] =
    useState(0);

  const [reviewCount, setReviewCount] =
    useState(0);

  useEffect(() => {
    const loadFlashcards = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch(
          "/api/flashcards/generate/",
          {
            method: "POST",
            body: JSON.stringify({}),
          }
        );

        setFlashcards(
          data.flashcards || []
        );

        setSubject(
          data.subject || "General"
        );

      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "Ddiba could not generate flashcards."
        );

      } finally {
        setLoading(false);
      }
    };

    loadFlashcards();
  }, []);

  const currentCard =
    flashcards[currentIndex];

  const progressPercent =
    flashcards.length > 0
      ? ((currentIndex + 1) /
          flashcards.length) *
        100
      : 0;

  const moveNext = () => {
    setShowBack(false);

    if (
      currentIndex <
      flashcards.length - 1
    ) {
      setCurrentIndex(
        (current) =>
          current + 1
      );

      return;
    }

    navigate("/progress");
  };

  const handleKnown = () => {
    setKnownCount(
      (count) =>
        count + 1
    );

    moveNext();
  };

  const handleReview = () => {
    setReviewCount(
      (count) =>
        count + 1
    );

    moveNext();
  };

  return (
    <ResponsiveLayout
      className="flashcards-page"
    >
      <header className="practice-header">

        <div className="practice-brand">

          <LogoMark size={39} />

          <div>
            <small>Ddiba</small>
            <strong>
              Flashcards
            </strong>
          </div>

        </div>

        <div className="practice-header-actions">

          <span className="practice-streak-pill">
            <Icon name="file" />
          </span>

        </div>

      </header>

      <section className="practice-title-area">

        <button
          className="practice-back-btn"
          onClick={() =>
            navigate("/dashboard")
          }
          aria-label="Go back"
        >
          <Icon name="arrowLeft" />
        </button>

        <div>
          <h1>
            {subject} Flashcards
          </h1>

          <p>
            {flashcards.length > 0
              ? `Card ${
                  currentIndex + 1
                } of ${
                  flashcards.length
                }`
              : "Preparing flashcards..."}
          </p>
        </div>

        <div className="practice-topic-icon">
          <Icon name="sparkle" />
        </div>

      </section>

      {flashcards.length > 0 && (
        <section className="practice-progress">

          <div className="practice-progress-top">

            <span>
              Card{" "}
              {currentIndex + 1}
            </span>

            <span>
              {Math.round(
                progressPercent
              )}
              %
            </span>

          </div>

          <div className="practice-progress-track">

            <div
              className="practice-progress-fill"
              style={{
                width:
                  `${progressPercent}%`,
              }}
            />

          </div>

        </section>
      )}

      {loading && (
        <section className="flashcard-main-card">

          <h2>
            Ddiba is creating your flashcards
          </h2>

          <p>
            Pulling the key ideas from your latest saved lesson...
          </p>

        </section>
      )}

      {error && (
        <section className="flashcard-main-card">

          <h2>
            No flashcards ready yet
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            className="flashcard-primary-btn"
            onClick={() =>
              navigate("/upload")
            }
          >
            Create a Lesson
            <Icon name="arrowRight" />
          </button>

        </section>
      )}

      {!loading &&
        !error &&
        currentCard && (
          <>
            <section
              className="flashcard-main-card"
              onClick={() =>
                setShowBack(
                  (value) =>
                    !value
                )
              }
            >

              <span className="practice-question-label">
                <Icon name="sparkle" />

                {showBack
                  ? "Answer"
                  : "Question"}
              </span>

              {!showBack ? (
                <div className="flashcard-front">

                  <h2>
                    {
                      currentCard.front
                    }
                  </h2>

                  <p>
                    Tap the card to reveal the answer.
                  </p>

                </div>
              ) : (
                <div className="flashcard-back">

                  <h2>
                    {
                      currentCard.back
                    }
                  </h2>

                  <p>
                    Tap again to see the question.
                  </p>

                </div>
              )}

            </section>

            <button
              type="button"
              className="flashcard-primary-btn"
              onClick={() =>
                setShowBack(
                  (value) =>
                    !value
                )
              }
            >
              {showBack
                ? "Show Question"
                : "Flip Card"}
            </button>

            {showBack && (
              <section className="flashcard-actions">

                <button
                  type="button"
                  className="flashcard-review-btn"
                  onClick={
                    handleReview
                  }
                >
                  Review Again
                </button>

                <button
                  type="button"
                  className="flashcard-known-btn"
                  onClick={
                    handleKnown
                  }
                >
                  Got It ✓
                </button>

              </section>
            )}

            <section className="flashcard-mini-stats">

              <span>
                Got it: {knownCount}
              </span>

              <span>
                Review: {reviewCount}
              </span>

            </section>
          </>
        )}

      <nav className="dashboard-bottom-nav">

        <button
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <span>
            <Icon name="book" />
          </span>

          <small>
            Learn
          </small>
        </button>

        <button
          onClick={() =>
            navigate("/practice")
          }
        >
          <span>
            <Icon name="play" />
          </span>

          <small>
            Practice
          </small>
        </button>

        <button
          className="active"
          onClick={() =>
            navigate("/flashcards")
          }
        >
          <span>
            <Icon name="file" />
          </span>

          <small>
            Cards
          </small>
        </button>

        <button
          onClick={() =>
            navigate("/progress")
          }
        >
          <span>
            <Icon name="chart" />
          </span>

          <small>
            Progress
          </small>
        </button>

      </nav>

    </ResponsiveLayout>
  );
}