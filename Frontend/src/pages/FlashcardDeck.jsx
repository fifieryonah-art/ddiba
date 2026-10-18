import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import LogoMark from "../components/Logo/LogoMark";

export default function FlashcardDeck() {
  const navigate = useNavigate();

  const reviewCards = [
    "Thylakoid Membrane & Light Reactions",
    "Calvin Cycle Reactants & Rubisco",
    "Photophosphorylation vs Respiration",
  ];

  const masteredCards = [
    "Chloroplast Structure",
    "Role of Chlorophyll",
    "Glucose Production",
  ];

  return (
    <ResponsiveLayout className="flashcard-deck-page">

      <header className="flashcard-header">
        <button
          className="flashcard-back-btn"
          onClick={() => navigate("/progress")}
          aria-label="Go back"
        >
          <Icon name="arrowLeft" />
        </button>

        <div className="flashcard-header-title">
          <LogoMark size={31} />
          <span>Interactive Flashcards</span>
        </div>

        <div className="flashcard-avatar">S</div>
      </header>

      <section className="flashcard-deck-heading">
        <span className="flashcard-due-pill">
          <Icon name="clock" /> Due for quick recall
        </span>

        <h1>Photosynthesis & Energy</h1>

        <p>
          Spaced repetition interval #3
        </p>
      </section>

      <section className="flashcard-mastery-card">

        <div className="flashcard-mastery-top">
          <span>Mastery progress</span>
          <strong>10 / 15 cards</strong>
        </div>

        <div className="flashcard-mastery-track">
          <div className="flashcard-mastery-fill"></div>
        </div>

        <div className="flashcard-mastery-bottom">
          <span>67% mastered</span>
          <span>5 cards remaining</span>
        </div>

      </section>

      <section className="flashcard-safe-card">

        <div className="flashcard-safe-icon">
          <Icon name="leaf" />
        </div>

        <div>
          <h3>Safe & Mindful Pacing</h3>

          <p>
            Bite-sized chunks • calming controls • no rush
          </p>
        </div>

      </section>

      <div className="flashcard-section-heading">
        <h3>Deck Breakdown</h3>

        <span>15 total cards</span>
      </div>

      <section className="flashcard-group-card review-group">

        <div className="flashcard-group-title">
          <div>
            <span className="flashcard-group-icon orange">
              ⚑
            </span>

            <div>
              <h3>Needs Review</h3>

              <p>
                Recommended for earlier repetition
              </p>
            </div>
          </div>

          <span className="flashcard-count-pill orange">
            3 cards
          </span>
        </div>

        <div className="flashcard-topic-list">

          {reviewCards.map((topic) => (
            <button
              type="button"
              className="flashcard-topic-row"
              key={topic}
            >
              <div className="flashcard-topic-status review">
                !
              </div>

              <span>{topic}</span>

              <span className="flashcard-row-arrow">
                <Icon name="arrowRight" />
              </span>
            </button>
          ))}

        </div>

      </section>

      <section className="flashcard-group-card mastered-group">

        <div className="flashcard-group-title">
          <div>
            <span className="flashcard-group-icon green">
              ✓
            </span>

            <div>
              <h3>Solid Grasp</h3>

              <p>
                High recall confidence rate
              </p>
            </div>
          </div>

          <span className="flashcard-count-pill green">
            7 cards
          </span>
        </div>

        <div className="flashcard-topic-list">

          {masteredCards.map((topic) => (
            <button
              type="button"
              className="flashcard-topic-row"
              key={topic}
            >
              <div className="flashcard-topic-status mastered">
                ✓
              </div>

              <span>{topic}</span>

              <span className="flashcard-row-arrow">
                <Icon name="arrowRight" />
              </span>
            </button>
          ))}

        </div>

      </section>

      <button
        className="flashcard-start-btn"
        onClick={() => navigate("/session-summary")}
      >
        Start Flashcards (15 Cards) <Icon name="arrowRight" />
      </button>

    </ResponsiveLayout>
  );
}
