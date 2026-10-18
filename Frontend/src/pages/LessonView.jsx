import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import LogoMark from "../components/Logo/LogoMark";

export default function LessonView() {
  const navigate = useNavigate();

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
          <button aria-label="Read aloud"><Icon name="volume" /></button>
          <button aria-label="Bookmark lesson">🔖</button>
        </div>
      </header>

      <section className="lesson-meta-row">
        <span className="lesson-subject-pill">
          <Icon name="leaf" /> Biology • Cell Energy
        </span>
      </section>

      <section className="lesson-title-section">
        <h1><Icon name="leaf" /> Photosynthesis</h1>

        <div className="lesson-calibration-pill">
          <Icon name="list" /> Calibrated to: Short explanations • Real-world examples
        </div>
      </section>

      <section className="concept-card">

        <div className="concept-card-heading">
          <div>
            <span>CONCEPT SNAPSHOT</span>
            <h2>The Solar Kitchen</h2>
          </div>

          <span className="active-lens-pill">
            <Icon name="sparkle" /> Active Lens
          </span>
        </div>

        <div className="concept-visual-row">

          <div className="concept-visual-item">
            <div className="concept-icon yellow"><Icon name="sun" /></div>

            <strong>Sunlight</strong>

            <small>Energy In</small>
          </div>

          <span className="concept-plus">+</span>

          <div className="concept-visual-item">
            <div className="concept-icon blue"><Icon name="spacing" /></div>

            <strong>H₂O & CO₂</strong>

            <small>Ingredients</small>
          </div>

          <span className="concept-arrow"><Icon name="arrowRight" /></span>

          <div className="concept-visual-item">
            <div className="concept-icon orange"><Icon name="lightbulb" /></div>

            <strong>Glucose</strong>

            <small>O₂ • Breath</small>
          </div>

        </div>

      </section>

      <section className="lesson-key-card">

        <div className="lesson-card-label">
          <Icon name="sparkle" /> Key Idea in 1 Sentence
        </div>

        <p>
          Plants use sunlight, water, and air to make
          their own food (sugar) and release oxygen
          for us to breathe.
        </p>

      </section>

      <section className="lesson-analogy-card">

        <div className="lesson-analogy-heading">

          <span>
            <Icon name="lightbulb" /> The Analogy
          </span>

          <span className="mental-model-pill">
            Mental Model
          </span>

        </div>

        <p>
          Think of a plant cell like a tiny solar-powered
          kitchen: sunlight is the electrical power, water
          and CO₂ are the raw ingredients, and glucose is
          freshly baked bread!
        </p>

      </section>

      <section className="lesson-breakdown-card">

        <div className="lesson-breakdown-title">
          <span className="breakdown-icon"><Icon name="list" /></span>

          <h3>Step-by-step breakdown</h3>
        </div>

        <div className="breakdown-step">

          <div className="breakdown-number">
            1
          </div>

          <div>
            <strong>Capture sunlight</strong>

            <p>
              Chlorophyll absorbs light energy from the sun.
            </p>
          </div>

        </div>

        <div className="breakdown-step">

          <div className="breakdown-number">
            2
          </div>

          <div>
            <strong>Split water</strong>

            <p>
              Light energy helps separate water into useful parts.
            </p>
          </div>

        </div>

        <div className="breakdown-step">

          <div className="breakdown-number">
            3
          </div>

          <div>
            <strong>Build food</strong>

            <p>
              The plant uses the captured energy to form glucose.
            </p>
          </div>

        </div>

      </section>

      <section className="lesson-check-card">

        <div>
          <span>Ready to check your understanding?</span>

          <strong>
            Try a gentle, zero-stress practice question.
          </strong>
        </div>

        <button
          onClick={() => navigate("/practice")}
        >
          Practice <Icon name="arrowRight" />
        </button>

      </section>

    </ResponsiveLayout>
  );
}
