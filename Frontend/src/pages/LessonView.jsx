import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import PageHeader from "../components/layout/PageHeader";

const currentTopic = {
  subject: "Biology",
  title: "Photosynthesis",
  analogyTitle: "The Solar Kitchen",
  keyIdea: "Plants use sunlight, water, and air to make their own food (sugar) and release oxygen for us to breathe.",
  analogyText: "Think of a plant cell like a tiny solar-powered kitchen: sunlight is the electrical power, water and CO2 are the raw ingredients, and glucose is freshly baked bread!",
  breakdownSteps: [
    { number: 1, title: "Capture sunlight", description: "Chlorophyll absorbs light energy from the sun." },
    { number: 2, title: "Split water", description: "Light energy helps separate water into useful parts." },
    { number: 3, title: "Build food", description: "The plant uses the captured energy to form glucose." },
  ],
  vocabulary: [
    { term: "Chlorophyll", definition: "The green pigment that captures light energy in plants." },
    { term: "Glucose", definition: "A sugar that stores the plant's captured energy." },
    { term: "Thylakoid", definition: "A membrane structure inside a chloroplast where light reactions begin." },
  ],
};

export default function LessonView() {
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState(false);
  const [selectedVocab, setSelectedVocab] = useState(null);
  const [isSpeechPlaying, setIsSpeechPlaying] = useState(false);

  const handleReadAloud = () => {
    if (!window.speechSynthesis) return;
    if (isSpeechPlaying) {
      window.speechSynthesis.cancel();
      setIsSpeechPlaying(false);
      return;
    }

    const speech = new SpeechSynthesisUtterance(
      `${currentTopic.title}. ${currentTopic.keyIdea} ${currentTopic.analogyText}`
    );
    speech.onend = () => setIsSpeechPlaying(false);
    window.speechSynthesis.speak(speech);
    setIsSpeechPlaying(true);
  };

  const headerActions = (
    <>
      <button type="button" onClick={handleReadAloud} aria-label={isSpeechPlaying ? "Stop read aloud" : "Read aloud"} className={isSpeechPlaying ? "lesson-tool-btn active" : "lesson-tool-btn"}>
        <Icon name="volume" />
      </button>
      <button type="button" onClick={() => setBookmarked((current) => !current)} aria-label="Bookmark lesson" className={bookmarked ? "lesson-tool-btn active" : "lesson-tool-btn"}>
        <span aria-hidden="true">🔖</span>
      </button>
    </>
  );

  return (
    <ResponsiveLayout className="lesson-page prototype-lesson-page">
      <PageHeader variant="lesson" title="Lesson View" backTo="/upload" rightContent={headerActions} />

      <div className="lesson-meta-row">
        <span className="lesson-subject-pill"><Icon name="leaf" /> {currentTopic.subject} • Cell Energy</span>
      </div>

      <section className="lesson-title-section">
        <h1><Icon name="leaf" /> {currentTopic.title}</h1>
        <div className="lesson-calibration-pill"><Icon name="list" /> Calibrated to: Short explanations • Real-world examples</div>
      </section>

      <section className="concept-card">
        <div className="concept-card-heading">
          <div><span>CONCEPT SNAPSHOT</span><h2>{currentTopic.analogyTitle}</h2></div>
          <span className="active-lens-pill"><Icon name="sparkle" /> Active Lens</span>
        </div>
        <div className="concept-visual-row">
          <div className="concept-visual-item"><div className="concept-icon yellow"><Icon name="sun" /></div><strong>Sunlight</strong><small>Energy In</small></div>
          <span className="concept-plus">+</span>
          <div className="concept-visual-item"><div className="concept-icon blue"><Icon name="spacing" /></div><strong>H₂O &amp; CO₂</strong><small>Ingredients</small></div>
          <span className="concept-arrow"><Icon name="arrowRight" /></span>
          <div className="concept-visual-item"><div className="concept-icon orange"><Icon name="lightbulb" /></div><strong>Glucose</strong><small>O₂ • Breath</small></div>
        </div>
      </section>

      <section className="lesson-key-card"><div className="lesson-card-label"><Icon name="sparkle" /> Key Idea in 1 Sentence</div><p>{currentTopic.keyIdea}</p></section>

      <section className="lesson-analogy-card"><div className="lesson-analogy-heading"><span><Icon name="lightbulb" /> The Analogy</span><span className="mental-model-pill">Mental Model</span></div><p>{currentTopic.analogyText}</p></section>

      <section className="lesson-breakdown-card">
        <div className="lesson-breakdown-title"><span className="breakdown-icon"><Icon name="list" /></span><h3>Step-by-step breakdown</h3></div>
        {currentTopic.breakdownSteps.map((step) => <div className="breakdown-step" key={step.number}><div className="breakdown-number">{step.number}</div><div><strong>{step.title}</strong><p>{step.description}</p></div></div>)}
      </section>

      <section className="lesson-vocabulary-card">
        <span className="lesson-vocabulary-label"><Icon name="book" /> Tap Any Word for Plain Definition:</span>
        <div className="lesson-vocabulary-list">
          {currentTopic.vocabulary.map((vocab) => {
            const isSelected = selectedVocab === vocab.term;
            return <button type="button" key={vocab.term} className={isSelected ? "lesson-vocabulary-pill active" : "lesson-vocabulary-pill"} onClick={() => setSelectedVocab(isSelected ? null : vocab.term)}>{vocab.term}</button>;
          })}
        </div>
        {selectedVocab && <div className="lesson-vocabulary-definition"><strong>{selectedVocab}:</strong> {currentTopic.vocabulary.find((vocab) => vocab.term === selectedVocab)?.definition}</div>}
      </section>

      <section className="lesson-check-card"><div><span>Ready to check your understanding?</span><strong>Try a gentle, zero-stress practice question.</strong></div><button type="button" onClick={() => navigate("/practice")}>Practice <Icon name="arrowRight" /></button></section>
    </ResponsiveLayout>
  );
}
