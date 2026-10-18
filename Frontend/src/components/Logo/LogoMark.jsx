import React, { useId } from "react";

export default function LogoMark({ size = 120, className = "" }) {
  const gradientId = `ddiba-logo-gradient-${useId().replace(/:/g, "")}`;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Ddiba logo"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#F7C948" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="52" stroke="#2D2A6E" strokeWidth="1.5" opacity="0.08" />
      <path
        d="M 20 38 C 20 20, 48 15, 62 30 C 72 42, 82 50, 82 68 C 82 84, 72 98, 58 102"
        stroke="#2D2A6E"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 88 38 C 88 20, 60 15, 46 30 C 36 42, 26 50, 26 68 C 26 84, 36 98, 50 102"
        stroke={`url(#${gradientId})`}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray="7 7"
        fill="none"
      />
      <circle cx="54" cy="102" r="7" fill="#F5A623" />
      <circle cx="22" cy="28" r="2.5" fill="#2D2A6E" opacity="0.3" />
      <circle cx="92" cy="28" r="2.5" fill="#F5A623" opacity="0.5" />
    </svg>
  );
}
