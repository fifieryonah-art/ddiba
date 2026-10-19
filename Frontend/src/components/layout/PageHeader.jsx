import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../ui/Icon";
import LogoMark from "../Logo/LogoMark";
import LogoLockup from "../Logo/LogoLockup";

/** Shared page header for onboarding and dashboard routes. */
export default function PageHeader({
  title,
  backTo,
  variant = "onboarding",
  logoSize = 31,
  rightContent = null,
  avatar = "S",
  onAvatarClick,
}) {
  const navigate = useNavigate();

  if (variant === "dashboard") {
    return (
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <LogoMark size={logoSize} />
          <div className="dashboard-brand-copy">
            <small>Ddiba</small>
            <strong>{title}</strong>
          </div>
        </div>

        <div className="dashboard-header-actions">
          {rightContent}
          <button
            type="button"
            className="dashboard-avatar"
            onClick={onAvatarClick}
          >
            {avatar}
          </button>
        </div>
      </header>
    );
  }

  if (variant === "auth") {
    return (
      <header className="auth-prototype-header">
        <button
          className="onboarding-back-btn"
          onClick={() => navigate(backTo)}
          aria-label="Go back"
        >
          <Icon name="arrowLeft" />
        </button>
        <LogoLockup markSize={logoSize} className="auth-prototype-lockup" />
        <span className="auth-prototype-header-spacer" aria-hidden="true" />
      </header>
    );
  }

  if (variant === "lesson") {
    return (
      <header className="lesson-header">
        <button
          className="lesson-back-btn"
          onClick={() => navigate(backTo)}
          aria-label="Go back"
        >
          <Icon name="arrowLeft" />
        </button>

        <div className="lesson-brand">
          <LogoMark size={logoSize} />
          <span>{title}</span>
        </div>

        <div className="lesson-header-actions">
          {rightContent}
        </div>
      </header>
    );
  }

  if (variant === "practice") {
    return (
      <header className="practice-header">
        <div className="practice-brand">
          <LogoMark size={logoSize} />
          <div>
            <small>Ddiba</small>
            <strong>{title}</strong>
          </div>
        </div>

        <div className="practice-header-actions">
          {rightContent}
          <div className="practice-avatar">{avatar}</div>
        </div>
      </header>
    );
  }

  if (variant === "progress") {
    return (
      <header className="progress-header">
        <div className="progress-brand">
          <LogoMark size={logoSize} />
          <div>
            <small>Ddiba</small>
            <strong>{title}</strong>
          </div>
        </div>

        <div className="progress-header-actions">
          {rightContent}
          <div className="progress-avatar">{avatar}</div>
        </div>
      </header>
    );
  }

  if (variant === "upload") {
    return (
      <header className="upload-main-header">
        <div className="upload-brand">
          <LogoMark size={logoSize} />
          <div className="upload-brand-copy"><small>Ddiba</small><strong>{title}</strong></div>
        </div>
        <div className="upload-header-actions">
          {rightContent}
          <div className="upload-avatar">{avatar}</div>
        </div>
      </header>
    );
  }

  if (variant === "session") {
    return (
      <header className="session-summary-header">
        <div className="session-header-title"><LogoMark size={logoSize} /><span>{title}</span></div>
        <div className="session-header-actions">{rightContent}</div>
      </header>
    );
  }

  return (
    <header className="onboarding-topbar">
      <button
        className="onboarding-back-btn"
        onClick={() => navigate(backTo)}
        aria-label="Go back"
      >
        <Icon name="arrowLeft" />
      </button>

      <div className="onboarding-brand">
        <LogoMark size={logoSize} />
        <span>{title}</span>
      </div>

      <div className="onboarding-avatar">{avatar}</div>
    </header>
  );
}
