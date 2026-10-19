import React, { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
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
  const location = useLocation();

  const adaptedText =
    location.state?.adaptedText || "";

  const subject =
    location.state?.subject || "General";

  const [questions, setQuestions] =
    useState([]);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState("");

  const [feedback, setFeedback] =
    useState("");

  const [correct, setCorrect] =
    useState(null);

  const [loadingQuestions, setLoadingQuestions] =
    useState(true);

  const [submittingAnswer, setSubmittingAnswer] =
    useState(false);

  const [error, setError] =
    useState("");

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

    loadQuestions();

  }, [adaptedText, subject]);

  const currentQuestion =
    questions[currentIndex];

  const handleSubmitAnswer = async () => {
    if (
      !currentQuestion ||
      !selectedAnswer.trim()
    ) {
      return;
    }

    try {
      setSubmittingAnswer(true);
      setError("");

      const data = await apiFetch(
        "/api/evaluate-answer/",
        {
          method: "POST",
          body: JSON.stringify({
            question:
              currentQuestion.question,

            student_answer:
              selectedAnswer,

            reference_answer:
              currentQuestion.reference_answer,

            subject,
          }),
        }
      );

      setCorrect(
        data.correct
      );

      setFeedback(
        data.feedback
      );

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Something went wrong while evaluating your answer."
      );

    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleNextQuestion = () => {
    if (
      currentIndex <
      questions.length - 1
    ) {
      setCurrentIndex(
        (current) =>
          current + 1
      );

      setSelectedAnswer("");
      setFeedback("");
      setCorrect(null);
      setError("");

      return;
    }

    navigate(
      "/progress"
    );
  };

  const progressPercent =
    questions.length > 0
      ? ((currentIndex + 1) /
          questions.length) *
        100
      : 0;

  return (
    <ResponsiveLayout className="practice-page">

      <header className="practice-header">

        <div className="practice-brand">

          <LogoMark size={39} />

          <div>
            <small>Ddiba</small>
            <strong>Practice</strong>
          </div>

        </div>

        <div className="practice-header-actions">

          <span className="practice-streak-pill">
            <Icon name="brain" />
          </span>

          <div className="practice-avatar">
            L
          </div>

        </div>

      </header>

      <section className="practice-title-area">

        <button
          className="practice-back-btn"
          onClick={() =>
            navigate("/dashboard")
          }
          aria-label="Go back"
        >
          <Icon name="arrowLeft" />
        </button>

        <div>

          <h1>
            {subject} Practice
          </h1>

          <p>
            {questions.length > 0
              ? `Question ${
                  currentIndex + 1
                } of ${questions.length}`
              : "Preparing questions..."}
          </p>

        </div>

        <div className="practice-topic-icon">
          <Icon name="leaf" />
        </div>

      </section>

      {questions.length > 0 && (

        <div className="practice-progress-track">

          <div
            className="practice-progress-fill"
            style={{
              width:
                `${progressPercent}%`,
            }}
          />

        </div>

      )}

      {loadingQuestions && (

        <section className="practice-feedback-card success">

          <div className="practice-feedback-top">

            <span>
              <Icon name="sparkle" />
              Ddiba is preparing your practice
            </span>

          </div>

          <p>
            Generating questions from your adapted lesson...
          </p>

        </section>

      )}

      {error && (

        <section className="practice-feedback-card try-again">

          <div className="practice-feedback-top">

            <span>
              <Icon name="lightbulb" />
              Something needs attention
            </span>

          </div>

          <p>
            {error}
          </p>

        </section>

      )}

      {!loadingQuestions &&
        currentQuestion && (
          <>

            <section className="practice-question-meta">

              <span className="practice-concept-pill">
                <Icon name="help" />
                Concept Check
              </span>

              <span>
                {currentQuestion.type ===
                "multiple_choice"
                  ? "Multiple Choice"
                  : "Free Text"}
              </span>

            </section>

            <section className="practice-question">

              <h2>
                {currentQuestion.question}
              </h2>

              <div className="practice-image-card">

                <div className="practice-image-placeholder">
                  <Icon name="leaf" />
                </div>

                <span>
                  Adaptive practice
                </span>

              </div>

            </section>

            {currentQuestion.type ===
            "multiple_choice" ? (

              <section className="practice-answers">

                {currentQuestion.options?.map(
                  (answer, index) => {

                    const isSelected =
                      selectedAnswer ===
                      answer;

                    let stateClass = "";

                    if (
                      feedback &&
                      isSelected
                    ) {
                      stateClass =
                        correct
                          ? "correct"
                          : "wrong";
                    }

                    return (
                      <button
                        type="button"
                        key={`${answer}-${index}`}
                        className={`practice-answer ${stateClass}`}
                        onClick={() => {
                          if (!feedback) {
                            setSelectedAnswer(
                              answer
                            );
                          }
                        }}
                      >

                        <div className="practice-answer-letter">
                          {String.fromCharCode(
                            65 + index
                          )}
                        </div>

                        <div className="practice-answer-copy">

                          <strong>
                            {answer}
                          </strong>

                          {isSelected && (
                            <small>
                              Your selected answer
                            </small>
                          )}

                        </div>

                        <div
                          className={`practice-answer-radio ${
                            isSelected
                              ? "selected"
                              : ""
                          }`}
                        >
                          {isSelected
                            ? "✓"
                            : ""}
                        </div>

                      </button>
                    );
                  }
                )}

              </section>

            ) : (

              <section className="practice-free-text-card">

                <textarea
                  value={selectedAnswer}
                  onChange={(event) =>
                    setSelectedAnswer(
                      event.target.value
                    )
                  }
                  placeholder="Type your answer in your own words..."
                  disabled={
                    Boolean(feedback)
                  }
                />

              </section>

            )}

            {!feedback && (

              <button
                className="practice-finish-btn"
                onClick={
                  handleSubmitAnswer
                }
                disabled={
                  !selectedAnswer.trim() ||
                  submittingAnswer
                }
              >

                {submittingAnswer
                  ? "Ddiba is checking your answer..."
                  : (
                    <>
                      Check Answer
                      <Icon name="arrowRight" />
                    </>
                  )}

              </button>

            )}

            {feedback && (

              <>

                <section
                  className={`practice-feedback-card ${
                    correct
                      ? "success"
                      : "try-again"
                  }`}
                >

                  <div className="practice-feedback-top">

                    <span>

                      {correct ? (
                        <>
                          <Icon name="sparkle" />
                          Nice work!
                        </>
                      ) : (
                        <>
                          <Icon name="lightbulb" />
                          Keep going!
                        </>
                      )}

                    </span>

                    {correct && (
                      <span className="xp-pill">
                        +25 XP
                      </span>
                    )}

                  </div>

                  <p>
                    {feedback}
                  </p>

                </section>

                <button
                  className="practice-finish-btn"
                  onClick={
                    handleNextQuestion
                  }
                >

                  {currentIndex <
                  questions.length - 1 ? (
                    <>
                      Next Question
                      <Icon name="arrowRight" />
                    </>
                  ) : (
                    <>
                      Finish Session
                      <Icon name="arrowRight" />
                    </>
                  )}

                </button>

              </>

            )}

          </>
        )}

      <nav className="practice-bottom-nav">

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
          className="active"
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