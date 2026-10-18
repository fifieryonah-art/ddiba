import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import PageHeader from "../components/layout/PageHeader";
import BottomNav from "../components/layout/BottomNav";
import { apiUrl, authHeaders } from "../api";

const fallbackQuestions = [
  {
    question: "What is the primary fuel or ingredient that chlorophyll traps from the environment?",
    answers: ["Carbon monoxide", "Sunlight energy", "Soil nitrogen", "Oxygen gas"],
    correctAnswer: 1,
    conceptTag: "Concept Check",
    stepTag: "Step 2 • Light Energy",
    explanation: "Chlorophyll acts like solar panels in leaf cells, absorbing sunlight energy to begin photosynthesis.",
    hint: "Think back to the Solar Kitchen analogy. What provides the energy that starts the process?",
  },
];

export default function Practice() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState(fallbackQuestions);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch(apiUrl("/api/practice-questions/"), {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        adapted_text: "Photosynthesis uses sunlight, water, and carbon dioxide to make glucose and oxygen.",
      }),
    })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("Practice API unavailable"))))
      .then((data) => {
        const apiQuestions = (data.questions || [])
          .filter((question) => question.type === "multiple_choice" && question.options?.length)
          .map((question) => ({
            question: question.question,
            answers: question.options,
            correctAnswer: Math.max(0, question.options.indexOf(question.reference_answer)),
            conceptTag: "Concept Check",
            stepTag: "Adaptive practice",
            explanation: "Your answer matches the reference answer for this practice question.",
            hint: "Review the lesson and try the question again.",
          }));

        if (!cancelled && apiQuestions.length) setQuestions(apiQuestions);
      })
      .catch(() => {
        // TODO: replace fallback data once the practice API is always available.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const currentQuestion = questions[questionIndex] || questions[0];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  const handleNext = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((current) => current + 1);
      setSelectedAnswer(null);
    } else {
      navigate("/progress");
    }
  };

  return (
    <ResponsiveLayout className="practice-page prototype-practice-page">
      <PageHeader
        variant="practice"
        title="Practice"
        logoSize={39}
        rightContent={<span className="practice-streak-pill"><Icon name="flame" /> 5</span>}
      />

      <section className="practice-title-area">
        <button className="practice-back-btn" onClick={() => navigate("/lesson")} aria-label="Back to lesson">
          <Icon name="arrowLeft" />
        </button>
        <div>
          <h1>Photosynthesis Practice</h1>
          <p>Question {questionIndex + 1} of {questions.length}</p>
        </div>
        <div className="practice-topic-icon"><Icon name="leaf" /></div>
      </section>

      <div className="practice-progress-track">
        <div className="practice-progress-fill" style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}></div>
      </div>

      <section className="practice-question-meta">
        <span className="practice-concept-pill"><Icon name="help" /> {currentQuestion.conceptTag}</span>
        <span>{currentQuestion.stepTag}</span>
      </section>

      <section className="practice-question">
        <h2>{currentQuestion.question}</h2>
        <div className="practice-image-card">
          <div className="practice-image-placeholder"><Icon name="leaf" /></div>
          <span>Chloroplast in action</span>
        </div>
      </section>

      <section className="practice-answers">
        {currentQuestion.answers.map((answer, index) => {
          const isSelected = selectedAnswer === index;
          const isAnswerCorrect = index === currentQuestion.correctAnswer;
          const stateClass = isSelected ? (isAnswerCorrect ? "correct" : "wrong") : "";

          return (
            <button type="button" key={answer} className={`practice-answer ${stateClass}`} onClick={() => setSelectedAnswer(index)}>
              <div className="practice-answer-letter">{String.fromCharCode(65 + index)}</div>
              <div className="practice-answer-copy">
                <strong>{answer}</strong>
                {isSelected && isAnswerCorrect && <small>Your selected answer</small>}
              </div>
              <div className={`practice-answer-radio ${isSelected ? "selected" : ""}`}>
                {isSelected && isAnswerCorrect ? "✓" : isSelected ? "•" : ""}
              </div>
            </button>
          );
        })}
      </section>

      {selectedAnswer !== null && (
        <section className={`practice-feedback-card ${isCorrect ? "success" : "try-again"}`}>
          <div className="practice-feedback-top">
            <span>{isCorrect ? <><Icon name="sparkle" /> Spot on, Sarah!</> : <><Icon name="lightbulb" /> Good try, Sarah!</>}</span>
            <span className="xp-pill">{isCorrect ? "+25 XP" : "Hint"}</span>
          </div>
          <p>{isCorrect ? currentQuestion.explanation : currentQuestion.hint}</p>
        </section>
      )}

      <button className="practice-finish-btn" onClick={handleNext} disabled={selectedAnswer === null}>
        {questionIndex < questions.length - 1 ? "Next Question" : "Finish Session"} <Icon name="arrowRight" />
      </button>

      <BottomNav />
    </ResponsiveLayout>
  );
}
