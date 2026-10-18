import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  User,
} from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "Sarah",
    email: "sarah@learning.edu",
    password: "password",
  });
  const isSignUp = mode === "signup";

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email").trim();
    const password = formData.get("password");
    const name = formData.get("name")?.trim() || "";

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/${isSignUp ? "register" : "login"}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isSignUp
            ? { username: email, email, first_name: name, password }
            : { username: email, password },
        ),
      });
      const data = await response.json();

      if (!response.ok) {
        const message = data.detail || data.non_field_errors?.[0] || Object.values(data)[0]?.[0];
        throw new Error(message || "We could not complete that request.");
      }

      localStorage.setItem("ddiba_token", data.token);
      localStorage.setItem("ddiba_username", data.username);
      navigate(isSignUp ? "/onboarding" : "/dashboard");
    } catch (submitError) {
      setError(
        submitError.message.includes("Failed to fetch")
          ? "The learning service is offline. Start the backend and try again."
          : submitError.message,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ResponsiveLayout className="auth-page">

      <header className="auth-header">
        <button type="button" className="auth-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft size={16} />
        </button>
        <div className="auth-brand">
          <div className="auth-brand-logo">⌣</div>
          <strong>Ddiba</strong>
        </div>
        <span className="auth-header-spacer" aria-hidden="true" />
      </header>

      <div className="auth-tabs" role="tablist" aria-label="Account mode">
        <button type="button" role="tab" aria-selected={isSignUp} className={isSignUp ? "active" : ""} onClick={() => { setMode("signup"); setError(""); }}>Sign Up</button>
        <button type="button" role="tab" aria-selected={!isSignUp} className={!isSignUp ? "active" : ""} onClick={() => { setMode("login"); setError(""); }}>Log In</button>
      </div>

      <section className="auth-title">
        <h1>{isSignUp ? "Create your calm space" : "Welcome back"}</h1>
        <p>{isSignUp ? <>Tell us how you like to <strong>learn</strong> so we can adapt every lesson.</> : "Continue your calm learning journey."}</p>
      </section>

      <div className="auth-actions">

        <button type="button" className="social-login-btn" onClick={() => setError("Google sign-in is coming soon. Use email for now.")}>
          <img
            className="social-icon"
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
            alt=""
            aria-hidden="true"
          />
          Continue with Google
        </button>

        <div className="auth-divider">
          <span></span>
          <p>or continue with email</p>
          <span></span>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          {isSignUp && <label className="auth-field"><span>Your preferred name</span><div className="auth-input-wrap"><User size={14} /><input type="text" name="name" value={form.name} onChange={updateField("name")} autoComplete="name" required /></div></label>}

          <label className="auth-field">
            <span>Email address</span>
            <div className="auth-input-wrap"><Mail size={14} /><input type="email" name="email" value={form.email} onChange={updateField("email")} autoComplete="email" required /></div>
          </label>
          <label className="auth-field">
            <span>Password</span>
            <div className="auth-input-wrap"><Lock size={14} /><input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={updateField("password")} placeholder={isSignUp ? "Create a password" : "Your password"} autoComplete={isSignUp ? "new-password" : "current-password"} minLength={isSignUp ? 8 : undefined} required /><button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={15} /> : <Eye size={15} />}</button></div>
          </label>

          {error && <p className="auth-error" role="alert">{error}</p>}
          <button type="submit" className="auth-main-btn" disabled={isSubmitting}>
            {isSubmitting ? "Connecting..." : isSignUp ? "Start Onboarding" : "Log In"}
            {!isSubmitting && <ArrowRight size={15} />}
          </button>
        </form>

        {isSignUp && <button type="button" className="auth-demo-btn" onClick={() => navigate("/onboarding")}><Sparkles size={12} />Instant Demo: Sign In as Sarah (5-Day Streak)</button>}

      </div>

      <section className="auth-pledge"><div className="auth-pledge-icon"><CheckCircle size={14} /></div><div><strong>The Ddiba Pledge</strong><p>No public scores, no timed pressure, and no penalties for taking breaks.</p></div></section>

    </ResponsiveLayout>
  );
}
