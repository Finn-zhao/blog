const STARS: Array<[number, number, number, number]> = [
  [54, 68, 1.4, 0.9], [128, 32, 1, 0.6], [210, 96, 1.2, 0.8], [302, 44, 0.9, 0.5],
  [388, 120, 1.5, 0.9], [470, 60, 1, 0.6], [560, 100, 1.3, 0.8], [642, 38, 1, 0.55],
  [730, 88, 1.6, 0.95], [812, 40, 1, 0.6], [905, 110, 1.2, 0.75], [990, 55, 1, 0.5],
  [1080, 90, 1.5, 0.85], [1170, 40, 1, 0.6], [1258, 105, 1.3, 0.8], [1350, 58, 1, 0.55],
  [1420, 120, 1.4, 0.85], [96, 180, 1, 0.5], [250, 210, 1.1, 0.6], [420, 190, 0.9, 0.45],
  [610, 220, 1.2, 0.65], [780, 180, 1, 0.5], [950, 230, 1.1, 0.55], [1130, 195, 0.9, 0.45],
  [1310, 215, 1.2, 0.6], [180, 300, 0.9, 0.4], [520, 320, 1, 0.45], [880, 310, 0.9, 0.4],
  [1220, 300, 1, 0.45], [1440, 200, 1.1, 0.5],
];

export default function PageBackdrop() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#0b1026_0%,#17224a_46%,#27436e_78%,#3b5b8c_100%)]" />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#fde68a" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="mtnBack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0b1026" />
          </linearGradient>
          <linearGradient id="mtnFront" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
        </defs>
        <circle cx="1150" cy="150" r="180" fill="url(#moonGlow)" />
        <circle cx="1150" cy="150" r="46" fill="#fef9c3" opacity="0.95" />
        <circle cx="1136" cy="138" r="10" fill="#fde68a" opacity="0.7" />
        <circle cx="1162" cy="164" r="7" fill="#fde68a" opacity="0.6" />
        {STARS.map(([cx, cy, r, o], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="#e2e8f0" opacity={o} />
        ))}
        <path
          d="M0 700 C 180 620, 320 660, 480 600 C 640 545, 780 620, 960 585 C 1140 550, 1280 615, 1440 570 L1440 900 L0 900 Z"
          fill="url(#mtnBack)"
          opacity="0.9"
        />
        <path
          d="M0 790 C 200 720, 420 770, 640 720 C 860 670, 1080 760, 1440 700 L1440 900 L0 900 Z"
          fill="url(#mtnFront)"
        />
      </svg>
      <div className="absolute inset-0 bg-slate-950/20" />
    </div>
  );
}