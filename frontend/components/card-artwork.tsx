export default function CardArtwork({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 480 560"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="55%" stopColor="#8fd3f7" />
          <stop offset="100%" stopColor="#dff3fd" />
        </linearGradient>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fef9c3" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hillBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <linearGradient id="hillFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
      </defs>

      <rect width="480" height="560" fill="url(#sky)" />
      <circle cx="382" cy="92" r="95" fill="url(#sunGlow)" />
      <circle cx="382" cy="92" r="34" fill="#fefce8" />

      <g fill="#ffffff" opacity="0.96">
        <ellipse cx="120" cy="120" rx="52" ry="24" />
        <ellipse cx="160" cy="106" rx="40" ry="22" />
        <ellipse cx="82" cy="108" rx="30" ry="16" />
      </g>
      <g fill="#e0f2fe" opacity="0.9">
        <ellipse cx="330" cy="215" rx="44" ry="18" />
        <ellipse cx="362" cy="203" rx="30" ry="15" />
      </g>
      <g fill="#ffffff" opacity="0.92">
        <ellipse cx="210" cy="300" rx="56" ry="20" />
        <ellipse cx="248" cy="288" rx="36" ry="16" />
      </g>

      <g stroke="#334155" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.55">
        <path d="M66 210 q7 -8 14 0 q7 -8 14 0" />
        <path d="M110 232 q6 -7 12 0 q6 -7 12 0" />
      </g>

      <path d="M0 428 C 110 386, 250 408, 480 350 L480 560 L0 560 Z" fill="url(#hillBack)" />
      <path d="M0 560 L0 486 C 130 442, 320 478, 480 428 L480 560 Z" fill="url(#hillFront)" />

      <g stroke="#166534" strokeWidth="2" strokeLinecap="round" opacity="0.5">
        <path d="M70 520 q3 -10 8 -12" />
        <path d="M150 500 q3 -10 8 -12" />
        <path d="M260 530 q3 -10 8 -12" />
        <path d="M350 498 q3 -10 8 -12" />
        <path d="M420 520 q3 -10 8 -12" />
      </g>

      <g>
        <circle cx="96" cy="512" r="4" fill="#fef9c3" />
        <circle cx="96" cy="512" r="1.6" fill="#f59e0b" />
        <circle cx="188" cy="540" r="4" fill="#ffffff" />
        <circle cx="188" cy="540" r="1.6" fill="#f59e0b" />
        <circle cx="310" cy="505" r="4" fill="#fecdd3" />
        <circle cx="310" cy="505" r="1.6" fill="#e11d48" />
        <circle cx="402" cy="536" r="4" fill="#ffffff" />
        <circle cx="402" cy="536" r="1.6" fill="#f59e0b" />
      </g>
    </svg>
  );
}