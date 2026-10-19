import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import LogoMark from "../components/Logo/LogoMark";
import { apiFetch } from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch(
          "/api/dashboard/"
        );

        setDashboard(data);
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "Could not load your dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const learnerName =
    dashboard?.learner_name || "Learner";

  const initial =
    learnerName.charAt(0).toUpperCase();

  const accuracy =
    dashboard?.accuracy ?? 0;

  const questionsAnswered =
    dashboard?.questions_answered ?? 0;

  const correctAnswers =
    dashboard?.correct_answers ?? 0;

  const lessonsCreated =
    dashboard?.lessons_created ?? 0;

  const recent =
    dashboard?.recent_learning;

  return (
    <ResponsiveLayout className="dashboard-page">

      <header className="dashboard-header">

        <div className="dashboard-brand">

          <LogoMark size={39} />

          <div className="dashboard-brand-copy">
            <small>Ddiba</small>
            <strong>Dashboard</strong>
          </div>

        </div>

        <div className="dashboard-header-actions">

          <span className="header-streak-pill">
            <Icon name="brain" /> {questionsAnswered}
          </span>

          <div className="dashboard-avatar">
            {initial}
          </div>

        </div>

      </header>

      <section className="dashboard-greeting">

        <div>

          <h1>
            Hi, {learnerName} 👋
          </h1>

          <p>
            Ready to learn something joyful today?
          </p>

        </div>

        <div className="dashboard-profile-picture">

          <span>{initial}</span>
          <i></i>

        </div>

      </section>

      {loading && (
        <section className="dashboard-streak-card">
          <p>Loading your learning progress...</p>
        </section>
      )}

      {error && (
        <section className="dashboard-streak-card">
          <p>{error}</p>
        </section>
      )}

      {!loading && !error && (
        <>
          <section className="dashboard-streak-card">

            <div className="dashboard-streak-heading">

              <div className="dashboard-streak-icon">
                <Icon name="chart" />
              </div>

              <div>

                <div className="dashboard-streak-title-row">

                  <h2>
                    {accuracy}% Understanding
                  </h2>

                  <span>
                    {dashboard?.pace || "gentle"} pace
                  </span>

                </div>

                <p>
                  {questionsAnswered} practice questions completed.
                  <br />
                  Keep building your confidence.
                </p>

              </div>

            </div>

            <div
              style={{
                marginTop: "18px",
                display: "grid",
                gridTemplateColumns:
                  "repeat(3, minmax(0, 1fr))",
                gap: "10px",
              }}
            >

              <article className="progress-stat-card">

                <span>
                  <Icon name="book" /> Lessons
                </span>

                <strong>
                  {lessonsCreated}
                </strong>

                <p>
                  Adapted lessons
                </p>

              </article>

              <article className="progress-stat-card">

                <span>
                  <Icon name="check" /> Correct
                </span>

                <strong>
                  {correctAnswers}
                </strong>

                <p>
                  Correct answers
                </p>

              </article>

              <article className="progress-stat-card">

                <span>
                  <Icon name="chart" /> Accuracy
                </span>

                <strong>
                  {accuracy}%
                </strong>

                <p>
                  Understanding
                </p>

              </article>

            </div>

          </section>

          <div className="dashboard-section-heading">

            <h3>Core Modes</h3>

            <span>
              Personalized for {learnerName}
            </span>

          </div>

          <section className="dashboard-mode-card understand-card">

            <div className="dashboard-mode-top">

              <div className="dashboard-mode-icon purple">
                <Icon name="sparkle" />
              </div>

              <span className="dashboard-mode-pill purple-pill">
                AI Explanations
              </span>

            </div>

            <h2>
              Understand <Icon name="sparkle" />
            </h2>

            <p>
              Break down tough concepts into simple,
              friendly ideas & intuitive analogies.
            </p>

            <button
              className="dashboard-mode-btn primary"
              onClick={() =>
                navigate("/upload")
              }
            >
              Explore Topic{" "}
              <Icon name="arrowRight" />
            </button>

          </section>

          <section className="dashboard-mode-card practice-card">

            <div className="dashboard-mode-top">

              <div className="dashboard-mode-icon green">
                <Icon name="brain" />
              </div>

              <span className="dashboard-mode-pill green-pill">
                AI Practice
              </span>

            </div>

            <h2>
              Practice <Icon name="brain" />
            </h2>

            <p>
              Test your understanding with gentle,
              supportive questions generated from
              your own lesson.
            </p>

            <button
              className="dashboard-mode-btn green"
              onClick={() =>
                navigate("/upload")
              }
            >
              Start from a lesson ⚡
            </button>

          </section>

          <div className="dashboard-section-heading">

            <h3>Continue Learning</h3>

            <button
              type="button"
              onClick={() =>
                navigate("/progress")
              }
            >
              View all
            </button>

          </div>

          {recent ? (

            <section className="dashboard-continue-card">

              <div className="dashboard-topic-icon">
                <Icon name="book" />
              </div>

              <div className="dashboard-topic-copy">

                <span>
                  {recent.subject}
                </span>

                <h3>
                  {recent.title}
                </h3>

                <p>
                  Your most recently adapted lesson
                </p>

                <div className="dashboard-topic-progress">

                  <div
                    style={{
                      width: `${Math.max(
                        10,
                        accuracy
                      )}%`,
                    }}
                  />

                </div>

              </div>

              <button
                className="dashboard-topic-arrow"
                onClick={() =>
                  navigate("/upload")
                }
              >
                <Icon name="arrowRight" />
              </button>

            </section>

          ) : (

            <section className="dashboard-continue-card">

              <div className="dashboard-topic-icon">
                <Icon name="sparkle" />
              </div>

              <div className="dashboard-topic-copy">

                <span>
                  Start learning
                </span>

                <h3>
                  No lessons yet
                </h3>

                <p>
                  Adapt your first lesson with Ddiba.
                </p>

              </div>

              <button
                className="dashboard-topic-arrow"
                onClick={() =>
                  navigate("/upload")
                }
              >
                <Icon name="arrowRight" />
              </button>

            </section>

          )}

        </>
      )}

      <nav className="dashboard-bottom-nav">

        <button
          className="active"
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