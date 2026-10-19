import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import LogoMark from "../components/Logo/LogoMark";
import {
  apiFetch,
  getUsername,
} from "../services/api";

export default function ProfileSummary() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const username = getUsername() || "Learner";

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch(
          "/api/profile/"
        );

        setProfile(data);

      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "Unable to load your learning profile."
        );

      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const accommodations = [];

  if (profile?.short_explanations) {
    accommodations.push(
      "Short explanations"
    );
  }

  if (profile?.step_by_step) {
    accommodations.push(
      "Step-by-step guidance"
    );
  }

  if (profile?.examples) {
    accommodations.push(
      "Real-world examples"
    );
  }

  if (profile?.read_aloud) {
    accommodations.push(
      "Read aloud enabled"
    );
  }

  if (profile?.larger_text) {
    accommodations.push(
      "Larger text"
    );
  }

  if (profile?.more_spacing) {
    accommodations.push(
      "Relaxed spacing"
    );
  }

  if (profile?.shorter_paragraphs) {
    accommodations.push(
      "Shorter paragraphs"
    );
  }

  if (profile?.highlight_words) {
    accommodations.push(
      "Highlighted key words"
    );
  }

  const displayName =
    username.charAt(0).toUpperCase() +
    username.slice(1);

  const initial =
    displayName.charAt(0).toUpperCase();

  return (
    <ResponsiveLayout className="profile-summary-page">

      <header className="onboarding-topbar">

        <button
          className="onboarding-back-btn"
          onClick={() =>
            navigate(
              "/onboarding/reading-support"
            )
          }
          aria-label="Go back"
        >
          <Icon name="arrowLeft" />
        </button>

        <div className="onboarding-brand">
          <LogoMark size={31} />
          <span>Onboarding Goals</span>
        </div>

        <div className="onboarding-avatar">
          {initial}
        </div>

      </header>

      <section className="profile-progress">

        <div className="profile-progress-top">
          <span>
            ✓ STEP 4 OF 4 • COMPLETE!
          </span>

          <span>100% Complete</span>
        </div>

        <div className="profile-progress-track">
          <div className="profile-progress-fill">
          </div>
        </div>

      </section>

      <section className="profile-summary-heading">

        <h1>Your learning style</h1>

        <p>
          Here is how Ddiba is calibrated
          for you.
          <br />

          Tailored for{" "}
          <strong>{displayName}.</strong>
        </p>

      </section>

      {loading && (
        <p
          style={{
            textAlign: "center",
            margin: "20px 0",
          }}
        >
          Loading your learning profile...
        </p>
      )}

      {error && (
        <div
          style={{
            margin: "16px 0",
            padding: "12px",
            borderRadius: "12px",
            background: "#fff0f2",
            color: "#a2394a",
            fontSize: "12px",
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <section className="learner-profile-card">

            <div className="learner-avatar">
              {initial}
            </div>

            <div className="learner-profile-copy">

              <h3>
                {displayName}'s Profile
              </h3>

              <p>
                {profile?.pace === "gentle"
                  ? "Gentle-paced learner"
                  : `${
                      profile?.pace ||
                      "Personalized"
                    } learner`}
              </p>

              <span className="profile-ready-pill">
                ● Calibrated & Ready
              </span>

            </div>

          </section>

          <section className="accommodations-card">

            <div className="accommodations-heading">

              <h3>
                <Icon name="list" />{" "}
                Active Accommodations
              </h3>

              <span>
                {accommodations.length} applied
              </span>

            </div>

            <p className="accommodations-description">
              Customized interaction layers to
              keep explanations clear, low-stress,
              and engaging.
            </p>

            <div className="accommodation-chips">

              {accommodations.length > 0 ? (
                accommodations.map((item) => (
                  <span
                    key={item}
                    className="accommodation-chip"
                  >
                    ✓ {item}
                  </span>
                ))
              ) : (
                <span className="accommodation-chip">
                  Personalized learning
                </span>
              )}

            </div>

          </section>
        </>
      )}

      <section className="ddiba-promise-card">

        <div className="promise-icon">
          <Icon name="help" />
        </div>

        <div className="promise-copy">

          <h3>Our Promise to You</h3>

          <p>
            Your companion learns with you.
            If something doesn't click, we'll adapt.
          </p>

        </div>

      </section>

      <button
        className="profile-start-btn"
        onClick={() =>
          navigate("/dashboard")
        }
        disabled={loading}
      >
        Start Learning{" "}
        <Icon name="arrowRight" />
      </button>

    </ResponsiveLayout>
  );
}