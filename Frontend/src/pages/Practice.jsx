import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";

const answers = [
  "Carbon monoxide",
  "Sunlight energy",
  "Soil nitrogen",
  "Oxygen gas",
];

export default function Practice() {
  const navigate = useNavigate();

  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const correctAnswer = 1;

  return (
    <main className="practice-page">

      <header className="practice-header">

        <div className="practice-brand">
          <div className="practice-logo">⌣</div>

          <div>
            <small>Ddiba</small>
            <strong>Practice</strong>
          </div>
        </div>

        <div className="practice-header-actions">
          <span className="practice-streak-pill">
            <Icon name="flame" /> 5
          </span>

          <div className="practice-avatar">
            S
          </div>
        </div>

      </header>

      <section className="practice-title-area">

        <button
          className="practice-back-btn"
          onClick={() => navigate("/lesson")}
        >
          <Icon name="arrowLeft" />
        </button>

        <div>
          <h1>Photosynthesis Practice</h1>
          <p>Question 2 of 5</p>
        </div>

        <div className="practice-topic-icon">
          <Icon name="leaf" />
        </div>

      </section>

      <div className="practice-progress-track">
        <div className="practice-progress-fill"></div>
      </div>

      <section className="practice-question-meta">

        <span className="practice-concept-pill">
          <Icon name="help" /> Concept Check
        </span>

        <span>
          Step 2 • Light Energy
        </span>

      </section>

      <section className="practice-question">

        <h2>
          What is the primary “fuel” or ingredient that
          chlorophyll traps from the environment?
        </h2>

        <div className="practice-image-card">
          <div className="practice-image-placeholder">
            <Icon name="leaf" />
          </div>

          <span>
            Chloroplast in action
          </span>
        </div>

      </section>

      <section className="practice-answers">

        {answers.map((answer, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === correctAnswer;

          let stateClass = "";

          if (isSelected && isCorrect) {
            stateClass = "correct";
          } else if (isSelected && !isCorrect) {
            stateClass = "wrong";
          }

          return (
            <button
              type="button"
              key={answer}
              className={`practice-answer ${stateClass}`}
              onClick={() => setSelectedAnswer(index)}
            >

              <div className="practice-answer-letter">
                {String.fromCharCode(65 + index)}
              </div>

              <div className="practice-answer-copy">

                <strong>{answer}</strong>

                {isSelected && isCorrect && (
                  <small>Your selected answer</small>
                )}

              </div>

              <div
                className={`practice-answer-radio ${
                  isSelected ? "selected" : ""
                }`}
              >
                {isSelected && isCorrect ? "✓" : ""}
              </div>

            </button>
          );
        })}

      </section>

      {selectedAnswer !== null && (
        <section
          className={`practice-feedback-card ${
            selectedAnswer === correctAnswer
              ? "success"
              : "try-again"
          }`}
        >

          <div className="practice-feedback-top">

            <span>
              {selectedAnswer === correctAnswer
                ? <><Icon name="sparkle" /> Spot on, Sarah!</>
                : <><Icon name="lightbulb" /> Good try, Sarah!</>}
            </span>

            <span className="xp-pill">
              +25 XP
            </span>

          </div>

          <p>
            {selectedAnswer === correctAnswer
              ? "Chlorophyll acts like solar panels in leaf cells, absorbing sunlight energy to begin photosynthesis."
              : "Think back to the Solar Kitchen analogy. What provides the energy that starts the process?"}
          </p>

        </section>
      )}

      <button
        className="practice-finish-btn"
        onClick={() => navigate("/progress")}
        disabled={selectedAnswer === null}
      >
        Finish Session <Icon name="arrowRight" />
      </button>

      <nav className="practice-bottom-nav">

        <button
          onClick={() => navigate("/dashboard")}
        >
          <span><Icon name="book" /></span>
          <small>Learn</small>
        </button>

        <button
          className="active"
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

    </main>
  );
}
