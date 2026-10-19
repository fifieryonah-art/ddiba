import React, { useEffect, useRef, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import PageHeader from "../components/layout/PageHeader";
import { apiUrl } from "../api";

export default function Auth() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("register");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const googleButtonRef = useRef(null);

  const isSignup = mode === "signup";

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    let retryTimer;

    const setupGoogleButton = () => {
      if (!clientId || !window.google || !googleButtonRef.current) {
        return false;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({ credential }) => {
          setError("");
          setIsSubmitting(true);

          try {
            const response = await fetch(apiUrl("/api/google/"), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ credential }),
            });
            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.detail || "Google sign-in failed.");
            }

            localStorage.setItem("ddiba_token", data.token);
            localStorage.setItem("ddiba_username", data.username);
            if (data.first_name) {
              localStorage.setItem("ddiba_name", data.first_name);
            }
            navigate(location.state?.from || "/dashboard", { replace: true });
          } catch (googleError) {
            setError(googleError.message || "Google sign-in failed. Please try email instead.");
          } finally {
            setIsSubmitting(false);
          }
        },
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        width: 360,
        text: "continue_with",
      });
      return true;
    };

    if (!setupGoogleButton()) {
      retryTimer = window.setInterval(() => {
        if (setupGoogleButton()) window.clearInterval(retryTimer);
      }, 250);
    }

    return () => {
      if (retryTimer) window.clearInterval(retryTimer);
    };
  }, [location.state, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !password.trim()) {
      setError("Please enter your name and password.");
      return;
    }

    try {
      const endpoint = isSignup
        ? "register"
        : "login";

      const payload = isSignup
        ? {
            username: email.trim(),
            email: email.trim(),
            first_name: name.trim(),
            password,
          }
        : {
            username: email.trim(),
            password,
          };

      const response = await fetch(
        apiUrl(`/api/${endpoint}/`),
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const endpoint =
        mode === "register"
          ? `${API_BASE_URL}/api/register/`
          : `${API_BASE_URL}/api/login/`;
      const response = await fetch(endpoint, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username: name.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        let message =
          data.detail ||
          data.non_field_errors?.[0] ||
          data.username?.[0] ||
          data.password?.[0] ||
          "Authentication failed.";

        throw new Error(message);
      }

      localStorage.setItem(
        "ddiba_token",
        data.token
      );

      localStorage.setItem(
        "ddiba_username",
        data.username
      );

      if (mode === "register") {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
        "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveLayout className="auth-page">

      <header className="auth-brand">
        <div className="auth-brand-logo">
          ⌣
        </div>

        <strong>Ddiba</strong>
      </header>

      <section className="auth-title">

        <h1>
          {mode === "register"
            ? "Learn your way."
            : "Welcome back."}
        </h1>

      </section>

      <div className="auth-actions">

        <button
          className="social-login-btn"
          type="button"
          disabled
        >
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

          <p>
            {mode === "register"
              ? "Or sign up with your name"
              : "Or log in with your name"}
          </p>

          <span></span>

        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          <label className="auth-field">

            Name

            <input
              type="text"
              name="name"
              placeholder="Your name"
              autoComplete="username"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
            />

          </label>

          <label className="auth-field">

            Password

            <input
              type="password"
              name="password"
              placeholder={
                mode === "register"
                  ? "Create a password"
                  : "Enter your password"
              }
              autoComplete={
                mode === "register"
                  ? "new-password"
                  : "current-password"
              }
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              minLength={8}
              required
            />

          </label>

          {error && (
            <div
              style={{
                padding: "11px 12px",
                borderRadius: "12px",
                background: "#fff0f2",
                color: "#a2394a",
                fontSize: "12px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-main-btn"
            disabled={loading}
          >

            {loading
              ? (
                mode === "register"
                  ? "Creating account..."
                  : "Logging in..."
              )
              : (
                mode === "register"
                  ? "Create account"
                  : "Log in"
              )}

          </button>

        </form>

        <div className="auth-divider">
          <span></span>
          <p>or</p>
          <span></span>
        </div>

        <div ref={googleButtonRef} className="google-signin-btn" aria-label="Continue with Google" />

      </div>

    </ResponsiveLayout>
  );
}