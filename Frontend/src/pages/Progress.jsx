import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import LogoMark from "../components/Logo/LogoMark";

export default function Progress() {
  const navigate = useNavigate();

  const days = ["M", "T", "W", "T", "F", "S", "S"];

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
          <span className="progress-streak-pill"><Icon name="flame" /> 5</span>
          <div className="progress-avatar">S</div>
        </div>

      </header>

      <section className="progress-complete-area">

        <span className="session-complete-pill">
          ✓ Session Complete
        </span>

        <span className="progress-save-text">
          ● Saved to Progress
        </span>

        <span className="progress-topic-pill">
          Biology: Photosynthesis Cycle
        </span>

        <h1>Your progress</h1>

        <p>
          Great work! You're grasping biological
          concepts with confidence.
        </p>

      </section>

      <section className="progress-streak-card">

        <div className="progress-streak-top">
          <div>
            <h2><Icon name="flame" /> 4 Day Streak!</h2>

            <p>
              4 days in a row of joyful, pressure-free learning.
            </p>
          </div>

          <span className="progress-xp-pill">
            +50 XP
          </span>
        </div>

        <div className="progress-week">

          {days.map((day, index) => (
            <div
              key={`${day}-${index}`}
              className="progress-day"
            >
              <span>{day}</span>

              <div
                className={`progress-day-circle ${
                  index < 4 ? "active" : ""
                }`}
              >
                {index < 4 ? <Icon name="flame" /> : index + 1}
              </div>
            </div>
          ))}

        </div>

      </section>

      <section className="accuracy-card">

        <div className="accuracy-copy">

          <span className="accuracy-label">
            <Icon name="sparkle" /> ACCURACY SCORE
          </span>

          <h2>88% Understanding</h2>

          <p>
            Mastery tier reached
          </p>

        </div>

        <div className="accuracy-ring">
          <div>
            <strong>88%</strong>
          </div>
        </div>

      </section>

      <section className="progress-stats">

        <article className="progress-stat-card">

          <span>
            <Icon name="check" /> Accuracy
          </span>

          <strong>
            4/5
          </strong>

          <p>
            Correct answers
          </p>

        </article>

        <article className="progress-stat-card">

          <span>
            <Icon name="clock" /> Focus
          </span>

          <strong>
            6 mins
          </strong>

          <p>
            Calm, mindful time
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
            <span>Personalized study tip</span>
          </div>

        </div>

        <blockquote>
          “You did well with the main idea! Let's practise
          water and carbon dioxide.”
        </blockquote>

        <div className="reflection-tip">

          <span>
            <Icon name="lightbulb" />
          </span>

          <p>
            Strengthening how reactants enter the plant will
            make the cycle crystal clear.
          </p>

        </div>

      </section>

      <button
        className="progress-practice-btn"
        onClick={() => navigate("/flashcards")}
      >
        Practice again <Icon name="arrowRight" />
      </button>

      <button
        className="progress-dashboard-btn"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>

      <nav className="progress-bottom-nav">

        <button
          onClick={() => navigate("/dashboard")}
        >
          <span><Icon name="book" /></span>
          <small>Learn</small>
        </button>

        <button
          onClick={() => navigate("/practice")}
        >
          <span><Icon name="play" /></span>
          <small>Practice</small>
        </button>

        <button
          onClick={() => navigate("/upload")}
        >
          <span><Icon name="file" /></span>
          <small>Notes</small>
        </button>

        <button
          className="active"
          onClick={() => navigate("/progress")}
        >
          <span><Icon name="chart" /></span>
          <small>Progress</small>
        </button>

      </nav>

    </ResponsiveLayout>
  );
}
