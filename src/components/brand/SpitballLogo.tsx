"use client";

import { useId } from "react";

type SpitballLogoProps = {
  /** Accessible label for the logo. */
  title?: string;
  className?: string;
};

/**
 * Spitball.ai brand mark with isometric node graph and wordmark.
 */
export function SpitballLogo({
  title = "Spitball.ai",
  className,
}: SpitballLogoProps) {
  const id = useId().replace(/:/g, "");

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 120"
      role="img"
      aria-label={title}
      className={className}
    >
      <defs>
        <style>{`
          .logo-text-${id} {
            font-family: var(--font-heading), sans-serif;
            font-weight: 700;
            font-size: 46px;
            fill: #e4e1e6;
            letter-spacing: -0.02em;
          }
          .logo-ai-${id} {
            font-family: var(--font-mono), monospace;
            font-weight: 400;
            fill: #00dbe9;
          }
        `}</style>

        <linearGradient id={`grad-blue-bright-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dbfcff" />
          <stop offset="100%" stopColor="#00dbe9" />
        </linearGradient>
        <linearGradient id={`grad-blue-mid-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00dbe9" />
          <stop offset="100%" stopColor="#006970" />
        </linearGradient>
        <linearGradient id={`grad-purple-mid-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e9b3ff" />
          <stop offset="100%" stopColor="#7d01b1" />
        </linearGradient>
        <linearGradient id={`grad-purple-dark-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7d01b1" />
          <stop offset="100%" stopColor="#310048" />
        </linearGradient>
        <linearGradient id={`grad-mix-1-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00dbe9" />
          <stop offset="100%" stopColor="#7d01b1" />
        </linearGradient>
        <linearGradient id={`grad-dark-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#353438" />
          <stop offset="100%" stopColor="#0e0e11" />
        </linearGradient>

        <filter id={`neon-glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g stroke="rgba(0, 219, 233, 0.3)" strokeWidth="1.5" strokeDasharray="2 4">
        <line x1="55" y1="10" x2="65" y2="-5" />
        <line x1="90" y1="30" x2="110" y2="20" />
        <line x1="95" y1="70" x2="115" y2="85" />
        <line x1="10" y1="50" x2="-5" y2="40" />
        <line x1="65" y1="100" x2="70" y2="115" />
      </g>

      <g strokeWidth="1" strokeLinejoin="round" opacity="0.9">
        <polygon
          points="65,100 25,85 65,65"
          fill={`url(#grad-dark-${id})`}
          stroke="#353438"
        />
        <polygon
          points="25,85 10,50 45,40"
          fill={`url(#grad-blue-mid-${id})`}
          stroke="#006970"
        />
        <polygon
          points="10,50 25,20 45,40"
          fill={`url(#grad-blue-bright-${id})`}
          stroke="#00dbe9"
        />
        <polygon
          points="95,70 65,100 65,65"
          fill={`url(#grad-purple-dark-${id})`}
          stroke="#7d01b1"
        />
        <polygon
          points="45,40 65,65 25,85"
          fill={`url(#grad-dark-${id})`}
          stroke="#3b494b"
        />
        <polygon
          points="25,20 55,10 45,40"
          fill={`url(#grad-blue-bright-${id})`}
          stroke="#dbfcff"
        />
        <polygon
          points="55,10 90,30 45,40"
          fill={`url(#grad-blue-bright-${id})`}
          stroke="#00dbe9"
        />
        <polygon
          points="90,30 95,70 65,65"
          fill={`url(#grad-purple-mid-${id})`}
          stroke="#e9b3ff"
        />
        <polygon
          points="45,40 90,30 65,65"
          fill={`url(#grad-mix-1-${id})`}
          stroke="#e9b3ff"
        />
      </g>

      <g fill="#ffffff" filter={`url(#neon-glow-${id})`}>
        <circle cx="55" cy="10" r="2.5" fill="#dbfcff" />
        <circle cx="90" cy="30" r="3" fill="#e9b3ff" />
        <circle cx="95" cy="70" r="2.5" fill="#e9b3ff" />
        <circle cx="65" cy="100" r="2" fill="#7d01b1" />
        <circle cx="25" cy="85" r="2" fill="#006970" />
        <circle cx="10" cy="50" r="2.5" fill="#00dbe9" />
        <circle cx="25" cy="20" r="2" fill="#00dbe9" />
        <circle cx="45" cy="40" r="3.5" fill="#00dbe9" />
        <circle cx="65" cy="65" r="3.5" fill="#e9b3ff" />
      </g>

      <text x="125" y="75" className={`logo-text-${id}`}>
        Spitball<tspan className={`logo-ai-${id}`}>.ai</tspan>
      </text>
    </svg>
  );
}
