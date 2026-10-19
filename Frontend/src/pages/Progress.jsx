import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import PageHeader from "../components/layout/PageHeader";
import BottomNav from "../components/layout/BottomNav";

const days = ["M", "T", "W", "T", "F", "S", "S"];

export default function Progress() {
  const navigate = useNavigate();

  return (
    <ResponsiveLayout className="progress-page prototype-progress-page">
      <PageHeader
        variant="progress"
        title="Progress"
        logoSize={39}
        rightContent={<span className="progress-streak-pill"><Icon name="flame" /> 5</span>}
      />

      <section className="progress-complete-area">
        <div className="progress-complete-status">
          <span className="session-complete-pill"><Icon name="check" /> Session Complete</span>
          <span className="progress-save-text">● Saved to Progress</span>
        </div>
        <span className="progress-topic-pill">Biology: Photosynthesis Cycle</span>
        <h1>Your progress</h1>
        <p>Great work! You're grasping biological concepts with confidence and low fatigue.</p>
      </section>

      <section className="progress-streak-card">
        <div className="progress-streak-top">
          <div><h2><Icon name="flame" /> 5 Day Streak!</h2><p>5 days in a row of joyful, pressure-free learning.</p></div>
          <span className="progress-xp-pill">+50 XP</span>
        </div>
        <div className="progress-week">
          {days.map((day, index) => <div key={`${day}-${index}`} className="progress-day"><span>{day}</span><div className={`progress-day-circle ${index < 5 ? "active" : ""}`}>{index < 5 ? <Icon name="flame" /> : index + 1}</div></div>)}
        </div>
      </section>

      <section className="accuracy-card">
        <div className="accuracy-copy">
          <span className="accuracy-label"><Icon name="sparkle" /> ACCURACY SCORE</span>
          <h2>88% Understanding</h2>
          <p>Mastery tier reached</p>
        </div>
        <div className="accuracy-ring"><div><strong>88%</strong></div></div>
      </section>

      <section className="progress-stats">
        <article className="progress-stat-card"><span><Icon name="check" /> Accuracy</span><strong>4 / 5</strong><p>Correct answers</p></article>
        <article className="progress-stat-card"><span><Icon name="clock" /> Focus</span><strong>6 mins</strong><p>Calm, mindful time</p></article>
      </section>

      <section className="reflection-card">
        <div className="reflection-heading"><div className="reflection-icon"><Icon name="sparkle" /></div><div><strong>Ddiba's Reflection</strong><span>Personalized study tip</span></div></div>
        <blockquote>“You did wonderful with the main idea! Next, let's strengthen how water and carbon dioxide enter the leaf.”</blockquote>
        <div className="reflection-tip"><span><Icon name="lightbulb" /></span><p>Reviewing reactant pathways will make the entire cycle crystal clear.</p></div>
      </section>

      <button className="progress-practice-btn" onClick={() => navigate("/flashcards")}><span>Practice again with Flashcards</span><Icon name="arrowRight" /></button>
      <button className="progress-dashboard-btn" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>

      <BottomNav />
    </ResponsiveLayout>
  );
}
