import React from "react";
import LogoMark from "./LogoMark";

export default function LogoLockup({ markSize = 64, className = "" }) {
  return (
    <div className={`ddiba-logo-lockup ${className}`.trim()}>
      <LogoMark size={markSize} />
      <div className="ddiba-logo-lockup__text">
        <div className="ddiba-logo-lockup__wordmark">Ddiba</div>
        <div className="ddiba-logo-lockup__tagline">
          Learn your <span>way</span>.
        </div>
      </div>
    </div>
  );
}
