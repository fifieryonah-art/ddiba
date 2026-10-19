import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import PageHeader from "../components/layout/PageHeader";

const supportOptions = [
  { id: "largerText", icon: "type", title: "Larger text", description: "Increase body font size to make letters crisper." },
  { id: "spacing", icon: "spacing", title: "More spacing", description: "Add line and letter spacing to reduce crowding." },
  { id: "shortParagraphs", icon: "list", title: "Shorter paragraphs", description: "Break dense blocks into small digestible units." },
  { id: "highlightWords", icon: "pencil", title: "Highlight key words", description: "Gently emphasize core vocabulary and nouns." },
];

export default function ReadingSupport() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    largerText: false,
    spacing: false,
    shortParagraphs: true,
    highlightWords: true,
  });

  const toggleSetting = (id) => {
    setSettings((current) => ({ ...current, [id]: !current[id] }));
  };

  return (
    <ResponsiveLayout className="reading-support-page prototype-reading-support-page">
      <PageHeader title="Sensory Support" backTo="/onboarding/explanations" />

      <section className="reading-progress">
        <div className="reading-progress-top"><span>STEP 3 OF 4</span><span>75% Complete</span></div>
        <div className="reading-progress-track"><div className="reading-progress-fill"></div></div>
      </section>

      <section className="reading-heading">
        <h1>What makes reading easier for you?</h1>
        <p>Sensory and accessibility controls designed for focus and low eye fatigue.</p>
      </section>

      <section className="reading-preview-card">
        <div className="reading-preview-top">
          <span className="preview-label"><Icon name="sparkle" /> Live Preview</span>
          <span className="calm-mode-pill">Calm Mode Active</span>
        </div>
        <p className={`${settings.largerText ? "reading-preview-large" : ""} ${settings.spacing ? "reading-preview-spaced" : ""}`}>
          Neurodiversity-first learning reduces {settings.highlightWords ? <strong>cognitive friction</strong> : "cognitive friction"}.
          {settings.shortParagraphs && <> Every thought flows clearly, gently, and without rushing your brain.</>}
        </p>
      </section>

      <section className="reading-support-list">
        {supportOptions.map((option) => {
          const isEnabled = settings[option.id];
          return (
            <button type="button" key={option.id} className="reading-support-card" onClick={() => toggleSetting(option.id)}>
              <div className="reading-support-icon"><Icon name={option.icon} /></div>
              <div className="reading-support-copy"><h3>{option.title}</h3><p>{option.description}</p></div>
              <div className={`reading-toggle ${isEnabled ? "active" : ""}`}><span>{isEnabled ? "✓" : ""}</span></div>
            </button>
          );
        })}
      </section>

      <button className="reading-continue-btn" onClick={() => navigate("/onboarding/profile")}>
        Continue <Icon name="arrowRight" />
      </button>
    </ResponsiveLayout>
  );
}
