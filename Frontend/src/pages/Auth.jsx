import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [form, setForm] = useState({
    name: "Sarah",
    email: "sarah@learning.edu",
    password: "password",
  });
  const isSignUp = mode === "signup";

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  return (
    <main className="auth-page">
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
        <button type="button" role="tab" aria-selected={isSignUp} className={isSignUp ? "active" : ""} onClick={() => setMode("signup")}>Sign Up</button>
        <button type="button" role="tab" aria-selected={!isSignUp} className={!isSignUp ? "active" : ""} onClick={() => setMode("login")}>Log In</button>
      </div>

      <section className="auth-title">
        <h1>{isSignUp ? "Create your calm space" : "Welcome back"}</h1>
        <p>
          {isSignUp ? (
            <>Tell us how you like to <strong>learn</strong> so we can adapt every lesson.</>
          ) : "Continue your calm learning journey."}
        </p>
      </section>

      <div className="auth-actions">
        <button type="button" className="social-login-btn" onClick={() => navigate(isSignUp ? "/onboarding" : "/dashboard")}>
          <img className="social-icon" src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="" aria-hidden="true" />
          Continue with Google
        </button>

        <div className="auth-divider"><span></span><p>or continue with email</p><span></span></div>

        <form className="auth-form" onSubmit={(event) => { event.preventDefault(); navigate(isSignUp ? "/onboarding" : "/dashboard"); }}>
          {isSignUp && (
            <label className="auth-field">
              <span>Your preferred name</span>
              <div className="auth-input-wrap">
                <User size={14} />
                <input type="text" name="name" value={form.name} onChange={updateField("name")} autoComplete="name" required />
              </div>
            </label>
          )}
          <label className="auth-field">
            <span>Email address</span>
            <div className="auth-input-wrap">
              <Mail size={14} />
              <input type="email" name="email" value={form.email} onChange={updateField("email")} autoComplete="email" required />
            </div>
          </label>
          <label className="auth-field">
            <span>Password</span>
            <div className="auth-input-wrap">
              <Lock size={14} />
              <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={updateField("password")} autoComplete={isSignUp ? "new-password" : "current-password"} required />
              <button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </label>
          <button type="submit" className="auth-main-btn">
            {isSignUp ? "Start Onboarding" : "Log In"}
            <ArrowRight size={15} />
          </button>
        </form>

        {isSignUp && (
          <button type="button" className="auth-demo-btn" onClick={() => navigate("/onboarding")}>
            <Sparkles size={12} />
            Instant Demo: Sign In as Sarah (5-Day Streak)
          </button>
        )}
      </div>

      <section className="auth-pledge">
        <div className="auth-pledge-icon"><CheckCircle size={14} /></div>
        <div><strong>The Ddiba Pledge</strong><p>No public scores, no timed pressure, and no penalties for taking breaks.</p></div>
      </section>
    </main>
  );
}
