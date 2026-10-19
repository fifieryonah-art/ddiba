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
  const location = useLocation();

  const [mode, setMode] = useState("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

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

    setError("");
    setIsSubmitting(true);

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

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The server returned an unexpected response."
        );
      }

      if (!response.ok) {
        const message =
          data.detail ||
          data.non_field_errors?.[0] ||
          data.username?.[0] ||
          data.email?.[0] ||
          data.password?.[0] ||
          "We could not complete that request.";

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

      if (data.first_name) {
        localStorage.setItem(
          "ddiba_name",
          data.first_name
        );
      } else if (name.trim()) {
        localStorage.setItem(
          "ddiba_name",
          name.trim()
        );
      }

      const destination = isSignup
        ? "/onboarding"
        : location.state?.from ||
          "/dashboard";

      navigate(
        destination,
        {
          replace: true,
        }
      );
    } catch (submitError) {
      console.error(
        "Authentication error:",
        submitError
      );

      if (
        submitError.message?.includes(
          "Failed to fetch"
        )
      ) {
        setError(
          "We could not reach the learning service. Please wait a minute and try again."
        );
      } else {
        setError(
          submitError.message ||
            "Something went wrong. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setPassword("");
  };

  return (
    <ResponsiveLayout
      className="auth-page prototype-auth-page"
    >
      <PageHeader
        variant="auth"
        title="Ddiba"
        backTo="/"
        logoSize={32}
      />

      <div className="prototype-auth-main">

        <div className="prototype-auth-tabs">

          <button
            type="button"
            className={
              isSignup
                ? "active"
                : ""
            }
            onClick={() =>
              switchMode("signup")
            }
          >
            Sign Up
          </button>

          <button
            type="button"
            className={
              !isSignup
                ? "active"
                : ""
            }
            onClick={() =>
              switchMode("login")
            }
          >
            Log In
          </button>

        </div>

        <div className="prototype-auth-title">

          <h1>
            {isSignup
              ? "Create your calm space"
              : "Welcome back, learner"}
          </h1>

          <p>
            {isSignup
              ? "Tell us how you like to learn so we can adapt every lesson."
              : "Pick up right where you left off, at your own pace."}
          </p>

        </div>

        <form
          className="prototype-auth-form"
          onSubmit={handleSubmit}
        >

          {isSignup && (
            <label>
              Your Preferred Name

              <input
                type="text"
                name="name"
                required
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder="e.g. Sarah"
                autoComplete="name"
              />

            </label>
          )}

          <label>
            Email Address

            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="student@example.com"
              autoComplete="email"
            />

          </label>

          <label>
            Password

            <div
              style={{
                position: "relative",
              }}
            >

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                required
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="••••••••"
                autoComplete={
                  isSignup
                    ? "new-password"
                    : "current-password"
                }
                minLength={
                  isSignup
                    ? 8
                    : undefined
                }
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />

              <button
                type="button"
                className="auth-password-toggle"
                onClick={() =>
                  setShowPassword(
                    (visible) =>
                      !visible
                  )
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

          </label>

          {error && (
            <p
              className="auth-error"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-main-btn prototype-auth-submit"
            disabled={isSubmitting}
          >

            {isSubmitting
              ? "Connecting..."
              : isSignup
              ? "Start Onboarding"
              : "Go to Dashboard"}

            {!isSubmitting && (
              <Icon name="arrowRight" />
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

      <div className="prototype-auth-pledge">

        <Icon name="sparkle" />

        <p>
          <strong>
            The Ddiba Pledge
          </strong>

          No public scores, no timed
          pressure, and no penalties
          for taking breaks.
        </p>

      </div>

    </ResponsiveLayout>
  );
}