import React, {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import LogoMark from "../components/Logo/LogoMark";
import { apiFetch } from "../services/api";

export default function Practice() {
  const navigate = useNavigate();
  const location = useLocation();

  const [adaptedText, setAdaptedText] =
    useState(
      location.state?.adaptedText ||
        sessionStorage.getItem(
          "ddiba_adapted_text"
        ) ||
        ""
    );

  const [subject, setSubject] =
    useState(
      location.state?.subject ||
        sessionStorage.getItem(
          "ddiba_subject"
        ) ||
        "General"
    );

  const [questions, setQuestions] =
    useState([]);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [
    selectedAnswer,
    setSelectedAnswer,
  ] = useState("");

  const [feedback, setFeedback] =
    useState("");

  const [correct, setCorrect] =
    useState(null);

  const [
    loadingQuestions,
    setLoadingQuestions,
  ] = useState(true);

  const [
    submittingAnswer,
    setSubmittingAnswer,
  ] = useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const preparePractice = async () => {
      try {
        setLoadingQuestions(true);
        setError("");

        let lessonText =
          adaptedText;

        let lessonSubject =
          subject;

        if (!lessonText) {
          const lesson =
            await apiFetch(
              "/api/latest-lesson/"
            );

          lessonText =
            lesson.adapted_text ||
            lesson.original_text ||
            "";

          lessonSubject =
            lesson.subject ||
            "General";

          setAdaptedText(
            lessonText
          );

          setSubject(
            lessonSubject
          );

          sessionStorage.setItem(
            "ddiba_adapted_text",
            lessonText
          );

          sessionStorage.setItem(
            "ddiba_subject",
            lessonSubject
          );
        }

        if (!lessonText) {
          throw new Error(
            "No saved lesson is available."
          );
        }

        const data =
          await apiFetch(
            "/api/practice-questions/",
            {
              method: "POST",

              body: JSON.stringify({
                adapted_text:
                  lessonText,

                subject:
                  lessonSubject,
              }),
            }
          );

        setQuestions(
          data.questions || []
        );

      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "Please create a lesson before starting practice."
        );

      } finally {
        setLoadingQuestions(false);
      }
    };

    preparePractice();
  }, []);

  const currentQuestion =
    questions[currentIndex];

  const isMultipleChoice =
    currentQuestion?.type ===
      "multiple_choice" &&
    Array.isArray(
      currentQuestion?.options
    );

  const handleSubmitAnswer =
    async () => {
      if (
        !currentQuestion ||
        !selectedAnswer.trim()
      ) {
        return;
      }

      try {
        setSubmittingAnswer(true);
        setError("");

        const data =
          await apiFetch(
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
        setError(
          err.message ||
            "Could not check your answer."
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

    navigate("/progress");
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
        </div>
      </header>

      <section className="practice-title-area">

        <button
          className="practice-back-btn"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <Icon name="arrowLeft" />
        </button>

        <div>
          <h1>
            {subject} Practice
          </h1>

          <p>
            {questions.length
              ? `Question ${
                  currentIndex + 1
                } of ${
                  questions.length
                }`
              : "Preparing practice..."}
          </p>
        </div>

        <div className="practice-topic-icon">
          <Icon name="brain" />
        </div>

      </section>

      {questions.length > 0 && (
        <section className="practice-progress">

          <div className="practice-progress-top">
            <span>
              Question{" "}
              {currentIndex + 1}
            </span>

            <span>
              {Math.round(
                progressPercent
              )}
              %
            </span>
          </div>

          <div className="practice-progress-track">
            <div
              className="practice-progress-fill"
              style={{
                width:
                  `${progressPercent}%`,
              }}
            />
          </div>

        </section>
      )}

      {loadingQuestions && (
        <section className="practice-question-card">
          <h2>
            Ddiba is preparing your practice
          </h2>

          <p>
            Creating gentle questions from your saved lesson...
          </p>
        </section>
      )}

      {error && (
        <section className="practice-question-card">
          <h2>
            No lesson ready yet
          </h2>

          <p>{error}</p>

          <button
            className="practice-submit-btn"
            onClick={() =>
              navigate("/upload")
            }
          >
            Create Lesson
            <Icon name="arrowRight" />
          </button>
        </section>
      )}

      {!loadingQuestions &&
        !error &&
        currentQuestion && (
          <>
            <section className="practice-question-card">

              <span className="practice-question-label">
                <Icon name="sparkle" />
                Think it through
              </span>

              <h2>
                {currentQuestion.question}
              </h2>

              {isMultipleChoice ? (
                <div className="practice-options">

                  {currentQuestion.options.map(
                    (
                      option,
                      index
                    ) => (
                      <button
                        key={`${option}-${index}`}
                        type="button"
                        className={
                          selectedAnswer ===
                          option
                            ? "selected"
                            : ""
                        }
                        disabled={
                          correct !== null
                        }
                        onClick={() =>
                          setSelectedAnswer(
                            option
                          )
                        }
                      >
                        <span>
                          {String.fromCharCode(
                            65 + index
                          )}
                        </span>

                        {option}
                      </button>
                    )
                  )}

                </div>
              ) : (
                <textarea
                  value={
                    selectedAnswer
                  }
                  onChange={(event) =>
                    setSelectedAnswer(
                      event.target.value
                    )
                  }
                  disabled={
                    correct !== null
                  }
                  placeholder="Write your answer in your own words..."
                />
              )}

            </section>

            {correct === null ? (
              <button
                className="practice-submit-btn"
                onClick={
                  handleSubmitAnswer
                }
                disabled={
                  submittingAnswer ||
                  !selectedAnswer.trim()
                }
              >
                {submittingAnswer
                  ? "Checking..."
                  : "Check Answer"}

                <Icon name="arrowRight" />
              </button>
            ) : (
              <>
                <section
                  className={`practice-feedback-card ${
                    correct
                      ? "correct"
                      : "incorrect"
                  }`}
                >
                  <strong>
                    {correct
                      ? "Nice work!"
                      : "Almost there"}
                  </strong>

                  <p>
                    {feedback}
                  </p>
                </section>

                <button
                  className="practice-submit-btn"
                  onClick={
                    handleNextQuestion
                  }
                >
                  {currentIndex <
                  questions.length - 1
                    ? "Next Question"
                    : "View Progress"}

                  <Icon name="arrowRight" />
                </button>
              </>
            )}
          </>
        )}

    </ResponsiveLayout>
  );
}