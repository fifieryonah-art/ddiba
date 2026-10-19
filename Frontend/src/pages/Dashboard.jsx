import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import BottomNav from "../components/layout/BottomNav";
import PageHeader from "../components/layout/PageHeader";

export default function Dashboard() {
  const navigate = useNavigate();

  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <ResponsiveLayout className="dashboard-page prototype-dashboard-page">
      <PageHeader
        variant="dashboard"
        title="Dashboard"
        logoSize={39}
        rightContent={<span className="header-streak-pill"><Icon name="flame" /> 5</span>}
        onAvatarClick={() => navigate("/onboarding/profile")}
      />

      <section className="dashboard-greeting">
        <div>
          <h1>Hi, Sarah <span aria-hidden="true">👋</span></h1>

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
              <h2>5 Day Streak!</h2>
              <span>+120 XP</span>
            </div>

            <p>
              Joyful, pressure-free learning every day.
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
                  index < 5 ? "active" : ""
                }`}
              >
                {index < 5 ? <Icon name="flame" /> : index + 1}
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

          <span className="dashboard-mode-pill purple-pill">Adapted Reading</span>
        </div>

        <h2>Understand <Icon name="sparkle" /></h2>

        <p>
          Break down tough textbooks and notes into simple, visual, chunked lessons.
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

          <span className="dashboard-mode-pill green-pill">Gentle Recall</span>
        </div>

        <h2>Practice <Icon name="brain" /></h2>

        <p>
          Test your understanding with gentle, non-stress questions and zero timers.
        </p>

        <button
          className="dashboard-mode-btn green"
          onClick={() => navigate("/practice")}
        >
          Start Practice <Icon name="arrowRight" />
        </button>
      </section>

      <div className="dashboard-section-heading">
        <h3>Continue Learning</h3>
        <button type="button" onClick={() => navigate("/progress")}>View all</button>
      </div>

      <section className="dashboard-continue-card">
        <div className="dashboard-topic-icon">
          <Icon name="leaf" />
        </div>

        <div className="dashboard-topic-copy">
          <span>Continue Reading</span>
          <h3>Light Reactions</h3>

          <p>
            78% understood • Step 2 of 3
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

      <div className="dashboard-quick-tools">
        <button type="button" className="dashboard-quick-tool" onClick={() => navigate("/flashcards")}>
          <span className="dashboard-quick-tool-icon"><Icon name="book" /></span>
          <span>
            <strong>Flashcards</strong>
            <span>15 cards due</span>
          </span>
        </button>

        <button type="button" className="dashboard-quick-tool" onClick={() => navigate("/subscription")}>
          <span className="dashboard-quick-tool-icon"><Icon name="sparkle" /></span>
          <span>
            <strong>Free Tier</strong>
            <span>Unlimited mode</span>
          </span>
        </button>
      </div>

      <BottomNav />
    </ResponsiveLayout>
  );
}
