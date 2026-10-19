import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import PageHeader from "../components/layout/PageHeader";
import { apiFetch } from "../services/api";

const styles = {visual: "Visual descriptions and diagrams", stepByStep: "Step by step", stories: "Stories and analogies", plain: "Plain and direct", audio: "Audio and listening"};
const supports = {larger_text: "Larger text", more_spacing: "More spacing", shorter_paragraphs: "Shorter paragraphs", highlight_words: "Highlight key words", read_aloud: "Read aloud"};

export default function Settings() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    apiFetch("/api/profile/").then(setProfile).catch(err => setError(err.message));
  }, []);
  const update = (key, value) => setProfile(current => ({...current, [key]: value}));
  const save = async event => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      const learningStyles = profile.learning_styles || [];
      await apiFetch("/api/profile/", {method: "PATCH", body: JSON.stringify({
        learning_styles: learningStyles,
        short_explanations: learningStyles.includes("plain"),
        step_by_step: learningStyles.includes("stepByStep"),
        examples: learningStyles.includes("stories"),
        listening_enabled: learningStyles.includes("audio"),
        explanation_depth: profile.explanation_depth,
        pace: profile.pace,
        learning_goal: profile.learning_goal,
        ...Object.fromEntries(Object.keys(supports).map(key => [key, profile[key]])),
      })});
      navigate("/dashboard");
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };
  return <ResponsiveLayout className="profile-summary-page">
    <PageHeader title="Learning settings" backTo="/dashboard" />
    <p>Update your preferences whenever you need. Your progress stays with your account.</p>
    {error && <p role="alert">{error}</p>}
    {!profile && !error && <p role="status">Loading your preferences…</p>}
    {profile && <form onSubmit={save} className="accommodations-card">
      <fieldset disabled={saving}><legend>How do you learn best?</legend>
        {Object.entries(styles).map(([key, label]) => <label key={key} style={{display: "block", padding: "8px"}}>
          <input type="checkbox" checked={(profile.learning_styles || []).includes(key)} onChange={event => update("learning_styles", event.target.checked ? [...(profile.learning_styles || []), key] : profile.learning_styles.filter(style => style !== key))} /> {label}
        </label>)}
      </fieldset>
      <label>Explanation depth <select value={profile.explanation_depth} onChange={event => update("explanation_depth", event.target.value)}>
        <option value="simple">Keep it simple</option><option value="breakdown">Break it down</option><option value="deep">Go deeper</option>
      </select></label>
      <fieldset disabled={saving}><legend>Reading support</legend>
        {Object.entries(supports).map(([key, label]) => <label key={key} style={{display: "block", padding: "8px"}}><input type="checkbox" checked={Boolean(profile[key])} onChange={event => update(key, event.target.checked)} /> {label}</label>)}
      </fieldset>
      <label>Learning goal <input maxLength={255} value={profile.learning_goal} onChange={event => update("learning_goal", event.target.value)} /></label>
      <label>Learning pace <select value={profile.pace} onChange={event => update("pace", event.target.value)}>
        <option value="gentle">Gentle</option><option value="steady">Steady</option><option value="quick">Quick</option>
      </select></label>
      <button className="profile-start-btn" disabled={saving || !(profile.learning_styles || []).length}>{saving ? "Saving…" : "Save preferences"}</button>
    </form>}
  </ResponsiveLayout>;
}
