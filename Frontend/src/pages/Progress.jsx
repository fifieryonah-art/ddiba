import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import LogoMark from "../components/Logo/LogoMark";
import { apiFetch } from "../services/api";

export default function Progress() {
  const navigate = useNavigate();

  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch(
          "/api/progress/"
        );

        setProgress(data);

      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "Could not load your progress."
        );

      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  const accuracy =
    progress?.accuracy ?? 0;

  const questionsAnswered =
    progress?.questions_answered ?? 0;

  const correctAnswers =
    progress?.correct_answers ?? 0;

  const lessonsCreated =
    progress?.lessons_created ?? 0;

  return (
    <ResponsiveLayout className="progress-page">

      <header className="progress-header">

        <div className="progress-brand">

          <LogoMark size={39} />

          <div>
            <small>Ddiba</small>
            <strong>Progress</strong>
          </div>

        </div>

        <div className="progress-header-actions">

          <span className="progress-streak-pill">
            <Icon name="brain" /> {questionsAnswered}
          </span>

          <div className="progress-avatar">
            L
          </div>

        </div>

      </header>

      <section className="progress-complete-area">

        <span className="session-complete-pill">
          ✓ Learning Progress
        </span>

        <span className="progress-save-text">
          ● Saved automatically
        </span>

        <span className="progress-topic-pill">
          {progress?.latest_subject ||
            "No topic yet"}
        </span>

        <h1>Your progress</h1>

        <p>
          {loading
            ? "Loading your learning progress..."
            : progress?.understanding_label}
        </p>

      </section>

      {error && (
        <section className="reflection-card">
          <p>{error}</p>
        </section>
      )}

      <section className="accuracy-card">

        <div className="accuracy-copy">

          <span className="accuracy-label">
            <Icon name="sparkle" /> ACCURACY SCORE
          </span>

          <h2>
            {accuracy}% Understanding
          </h2>

          <p>
            {progress?.understanding_label ||
              "Ready to begin"}
          </p>

        </div>

        <div className="accuracy-ring">
          <div>
            <strong>
              {accuracy}%
            </strong>
          </div>
        </div>

      </section>

      <section className="progress-stats">

        <article className="progress-stat-card">

          <span>
            <Icon name="check" /> Accuracy
          </span>

          <strong>
            {correctAnswers}/{questionsAnswered}
          </strong>

          <p>
            Correct answers
          </p>

        </article>

        <article className="progress-stat-card">

          <span>
            <Icon name="book" /> Lessons
          </span>

          <strong>
            {lessonsCreated}
          </strong>

          <p>
            Lessons adapted
          </p>

        </article>

      </section>

      <section className="reflection-card">

        <div className="reflection-heading">

          <div className="reflection-icon">
            <Icon name="sparkle" />
          </div>

          <div>
            <strong>Ddiba's Reflection</strong>
            <span>
              Personalized learning insight
            </span>
          </div>

        </div>

        <blockquote>
          “
          {progress?.reflection ||
            "Complete some practice and Ddiba will begin learning with you."}
          ”
        </blockquote>

        {progress?.strong_topics?.length > 0 && (

          <div className="reflection-tip">

            <span>
              <Icon name="check" />
            </span>

            <p>
              Strong topic:{" "}
              {progress.strong_topics[0]}
            </p>

          </div>

        )}

        {progress?.weak_topics?.length > 0 && (

          <div className="reflection-tip">

            <span>
              <Icon name="lightbulb" />
            </span>

            <p>
              Keep practising:{" "}
              {progress.weak_topics[0]}
            </p>

          </div>

        )}

      </section>

      <button
        className="progress-practice-btn"
        onClick={() =>
          navigate("/upload")
        }
      >
        Practice again{" "}
        <Icon name="arrowRight" />
      </button>

      <button
        className="progress-dashboard-btn"
        onClick={() =>
          navigate("/dashboard")
        }
      >
        Back to Dashboard
      </button>

      <nav className="progress-bottom-nav">

        <button
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <span>
            <Icon name="book" />
          </span>
          <small>Learn</small>
        </button>

        <button
          onClick={() =>
            navigate("/upload")
          }
        >
          <span>
            <Icon name="play" />
          </span>
          <small>Practice</small>
        </button>

        <button
          onClick={() =>
            navigate("/upload")
          }
        >
          <span>
            <Icon name="file" />
          </span>
          <small>Notes</small>
        </button>

        <button
          className="active"
          onClick={() =>
            navigate("/progress")
          }
        >
          <span>
            <Icon name="chart" />
          </span>
          <small>Progress</small>
        </button>

      </nav>

    </ResponsiveLayout>
  );
}