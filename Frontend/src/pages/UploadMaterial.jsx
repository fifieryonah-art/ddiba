import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import PageHeader from "../components/layout/PageHeader";
import BottomNav from "../components/layout/BottomNav";
import { apiUrl, authHeaders } from "../api";

const sampleText = "Photosynthesis occurs inside chloroplasts where chlorophyll pigments trap radiant solar photons. This light energy excites electrons within thylakoid membrane protein complexes, initiating photolysis to break water molecules into oxygen gas, protons, and mobile electrons.";

export default function UploadMaterial() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("type");
  const [text, setText] = useState(sampleText);
  const [subject, setSubject] = useState("Biology");
  const [isRecording, setIsRecording] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const wordCount = useMemo(() => text.trim() ? text.trim().split(/\s+/).length : 0, [text]);

  const handleVoiceToggle = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setText((current) => `${current} Voice note: Mitochondria generate chemical energy for the cell.`);
      return;
    }
    if (isRecording) return;
    const recognition = new Recognition();
    setIsRecording(true);
    recognition.onresult = (event) => setText((current) => `${current} ${event.results[0][0].transcript}`);
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const handleTransform = async () => {
    if (!text.trim()) return;
    setIsTransforming(true);
    try {
      const response = await fetch(apiUrl("/api/adapt-lesson/"), {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ text, preferences: { subject, mode: "simplify" } }),
      });
      if (!response.ok) throw new Error("Adapt lesson request failed");
      navigate("/lesson");
    } catch {
      // TODO: show adapted API content when the backend response is connected to the lesson view.
      navigate("/lesson");
    } finally {
      setIsTransforming(false);
    }
  };

  return (
    <ResponsiveLayout className="upload-material-page prototype-upload-page">
      <PageHeader variant="upload" title="Adapt Notes" logoSize={39} rightContent={<span className="upload-streak-pill"><Icon name="flame" /> 5</span>} />

      <section className="upload-subheader"><button className="upload-back-btn" onClick={() => navigate("/dashboard")} aria-label="Back"><Icon name="arrowLeft" /></button><h2>New Learning Topic</h2><button className="upload-menu-btn" aria-label="More options"><Icon name="list" /></button></section>
      <span className="upload-reader-label"><Icon name="sparkle" /> DDIBA INTELLIGENT READER</span>

      <section className="upload-heading"><h1>What are you learning today?</h1><p>Drop in study notes, lecture slides, textbook excerpts, or questions.</p></section>

      <section className="free-tier-card"><span><Icon name="sparkle" /> Free tier: Unlimited adaptive transforms</span><button type="button" onClick={() => navigate("/subscription")}>View Plans</button></section>

      <div className="upload-samples"><span>QUICK SAMPLE TOPICS</span><div><button type="button" className={text === sampleText ? "active" : ""} onClick={() => { setText(sampleText); setSubject("Biology"); }}>🌿 Photosynthesis</button><button type="button" onClick={() => { setText("Objects in orbit are influenced by gravitational force and motion."); setSubject("Physics"); }}>🪐 Gravity &amp; Orbit</button></div></div>

      <section className="upload-tabs">
        <button type="button" className={activeTab === "type" ? "active" : ""} onClick={() => setActiveTab("type")}><Icon name="type" /> Type / Paste</button>
        <button type="button" className={activeTab === "voice" ? "active" : ""} onClick={() => setActiveTab("voice")}><Icon name="mic" /> Voice Dictate</button>
        <button type="button" className={activeTab === "file" ? "active" : ""} onClick={() => setActiveTab("file")}><Icon name="cloudUpload" /> Upload File</button>
      </section>

      {activeTab === "type" && <section className="upload-text-card"><div className="upload-text-card-top"><strong><Icon name="type" /> Raw text or study prompt</strong><button type="button" onClick={() => setText("")}><Icon name="refresh" /> Clear</button></div><textarea value={text} onChange={(event) => setText(event.target.value)} rows={5} placeholder="Paste or type what you're learning..." /><div className="upload-text-card-bottom"><span className="word-count-pill"><Icon name="check" /> {wordCount} words entered</span><div className="upload-text-actions"><button type="button" onClick={handleVoiceToggle}><Icon name="mic" /> {isRecording ? "Listening..." : "Dictate"}</button><button type="button" onClick={async () => { try { const clip = await navigator.clipboard.readText(); if (clip) setText(clip); } catch { /* Clipboard may be unavailable. */ } }}>Paste latest</button></div></div></section>}

      {activeTab === "voice" && <section className="upload-alternative-card"><div className="alternative-icon"><Icon name="mic" /></div><h3>{isRecording ? "Listening carefully..." : "Voice Dictation"}</h3><p>Speak naturally and Ddiba will transcribe and transform your thoughts into an adaptive lesson.</p><button type="button" onClick={handleVoiceToggle}>{isRecording ? "Stop Recording" : "Start Dictating"}</button></section>}

      {activeTab === "file" && <section className="upload-alternative-card"><div className="alternative-icon"><Icon name="cloudUpload" /></div><h3>Upload Learning Material</h3><p>PDF, lecture slides, text notes, or photos of your textbook pages.</p><label className="upload-file-label">Choose Document<input type="file" accept=".pdf,.doc,.docx,.txt,.ppt,.pptx" onChange={(event) => { const file = event.target.files?.[0]; if (file) { setText(`[Imported from ${file.name}]: ${sampleText}`); setActiveTab("type"); } }} /></label></section>}

      <section className="subject-framing"><p>Add quick subject framing:</p><div className="subject-options"><button type="button" className={subject === "Biology" ? "active" : ""} onClick={() => setSubject("Biology")}><Icon name="dna" /> Biology</button><button type="button" className={subject === "History" ? "active" : ""} onClick={() => setSubject("History")}><Icon name="scroll" /> History</button><button type="button" className={subject === "Math" ? "active" : ""} onClick={() => setSubject("Math")}>Σ Math</button></div></section>

      <button className="make-easier-btn" onClick={handleTransform} disabled={!text.trim() || isTransforming}>{isTransforming ? "Adapting to your brain..." : <><Icon name="sparkle" /> Make it easier <Icon name="arrowRight" /></>}</button>
      <BottomNav />
    </ResponsiveLayout>
  );
}
