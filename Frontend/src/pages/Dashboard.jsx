import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import LogoMark from "../components/Logo/LogoMark";

export default function Dashboard() {
  const navigate = useNavigate();

  const days = ["M", "T", "W", "T", "F", "S", "S"];

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
          <span className="header-streak-pill"><Icon name="flame" /> 5</span>
          <div className="dashboard-avatar">S</div>
        </div>
      </header>

      <section className="dashboard-greeting">
        <div>
          <h1>Hi, Sarah 👋</h1>

          <p>
            Ready to learn something joyful today?
          </p>
        </div>

        <div className="dashboard-profile-picture">
          <span>S</span>
          <i></i>
        </div>
      </section>

      <section className="dashboard-streak-card">
        <div className="dashboard-streak-heading">
          <div className="dashboard-streak-icon">
            <Icon name="flame" />
          </div>

          <div>
            <div className="dashboard-streak-title-row">
              <h2>4 Day Streak!</h2>

              <span>Steady pace</span>
            </div>

            <p>
              You're building steady momentum.
              <br />
              Keep it up!
            </p>
          </div>
        </div>

        <div className="dashboard-week">
          {days.map((day, index) => (
            <div
              className="dashboard-day"
              key={`${day}-${index}`}
            >
              <span>{day}</span>

              <div
                className={`dashboard-day-circle ${
                  index < 4 ? "active" : ""
                }`}
              >
                {index < 4 ? <Icon name="flame" /> : "•"}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="dashboard-section-heading">
        <h3>Core Modes</h3>
        <span>Personalized for you</span>
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

        <h2>Understand <Icon name="sparkle" /></h2>

        <p>
          Break down tough concepts into simple,
          friendly ideas & intuitive analogies.
        </p>

        <button
          className="dashboard-mode-btn primary"
          onClick={() => navigate("/upload")}
        >
          Explore Topic <Icon name="arrowRight" />
        </button>
      </section>

      <section className="dashboard-mode-card practice-card">
        <div className="dashboard-mode-top">
          <div className="dashboard-mode-icon green">
            <Icon name="brain" />
          </div>

          <span className="dashboard-mode-pill green-pill">
            Zero-Stress
          </span>
        </div>

        <h2>Practice <Icon name="brain" /></h2>

        <p>
          Test your understanding with gentle,
          supportive quizzes that adapt to your pace.
        </p>

        <button
          className="dashboard-mode-btn green"
          onClick={() => navigate("/practice")}
        >
          Quick Quiz ⚡
        </button>
      </section>

      <div className="dashboard-section-heading">
        <h3>Continue Learning</h3>

        <button
          type="button"
          onClick={() => navigate("/progress")}
        >
          View all
        </button>
      </div>

      <section className="dashboard-continue-card">
        <div className="dashboard-topic-icon">
          <Icon name="leaf" />
        </div>

        <div className="dashboard-topic-copy">
          <span>Biology</span>

          <h3>Light Reactions</h3>

          <p>
            Last studied 12 mins ago
          </p>

          <div className="dashboard-topic-progress">
            <div></div>
          </div>
        </div>

        <button
          className="dashboard-topic-arrow"
          onClick={() => navigate("/upload")}
        >
          <Icon name="arrowRight" />
        </button>
      </section>

      <nav className="dashboard-bottom-nav">
        <button
          className="active"
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
          onClick={() => navigate("/progress")}
        >
          <span><Icon name="chart" /></span>
          <small>Progress</small>
        </button>
      </nav>
    </ResponsiveLayout>
  );
}
