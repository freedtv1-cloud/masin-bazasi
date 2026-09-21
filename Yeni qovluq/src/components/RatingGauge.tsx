// Dairəvi reytinq göstəricisi — 0-10 xal, dəyərə görə qırmızı/sarı/yaşıl
// rənglənən "dial" tərzli SVG halqa. Xarici kitabxana yoxdur, PriceTrend.tsx-də
// olduğu kimi əl ilə çəkilmiş SVG-dir.

type Tier = { ring: string; track: string; text: string };

function tierFor(score: number): Tier {
  if (score >= 7) {
    return { ring: "#1f9d6f", track: "#d3f0e2", text: "#12734f" }; // yaşıl
  }
  if (score >= 4) {
    return { ring: "#e0a812", track: "#faeec6", text: "#8a6209" }; // sarı
  }
  return { ring: "#dc4b3f", track: "#f8d9d5", text: "#a3352b" }; // qırmızı
}

export function RatingGauge({
  label,
  score,
  size = 56,
}: {
  label: string;
  score: number | null;
  size?: number;
}) {
  const strokeWidth = size <= 44 ? 4 : 5.5;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  if (score === null) {
    return (
      <div className="flex flex-col items-center gap-1">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
        </svg>
        <span className="text-[0.6rem] font-medium uppercase tracking-wide text-foreground/40">
          {label}
        </span>
      </div>
    );
  }

  const clamped = Math.max(0, Math.min(10, score));
  const filled = (clamped / 10) * circumference;
  const { ring, track, text } = tierFor(clamped);

  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${label}: 10 üzərindən ${clamped}`}
      >
        <circle cx={center} cy={center} r={radius} fill="none" stroke={track} strokeWidth={strokeWidth} />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={ring}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - filled}
          transform={`rotate(-90 ${center} ${center})`}
        />
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fill: text, fontSize: size * 0.32, fontWeight: 700 }}
        >
          {clamped}
        </text>
      </svg>
      <span className="text-[0.6rem] font-medium uppercase tracking-wide text-foreground/50">
        {label}
      </span>
    </div>
  );
}

// Ümumi bal nişanı (kartların başlığında) üçün rəng dərəcəsi — RatingGauge-də
// istifadə olunan eyni 7/4 həddi ilə, amma dolğun fon rəngli kiçik nişan kimi.
export type ScoreTier = "green" | "yellow" | "red";

export function scoreTier(score: number): ScoreTier {
  if (score >= 7) return "green";
  if (score >= 4) return "yellow";
  return "red";
}

export const TIER_BADGE_CLASS: Record<ScoreTier, string> = {
  green: "bg-emerald-500 text-white",
  yellow: "bg-amber-400 text-amber-950",
  red: "bg-rose-500 text-white",
};

export type ProfileScores = {
  safetyScore: number | null;
  reliabilityScore: number | null;
  valueScore: number | null;
  performanceScore: number | null;
};

export function RatingGaugeRow({
  scores,
  size = 56,
  compact = false,
}: {
  scores: ProfileScores;
  size?: number;
  compact?: boolean;
}) {
  const items: { key: keyof ProfileScores; label: string }[] = [
    { key: "safetyScore", label: compact ? "Təhl." : "Təhlükəsizlik" },
    { key: "reliabilityScore", label: compact ? "Döz." : "Dözümlülük" },
    { key: "valueScore", label: compact ? "Qiy." : "Qiymət" },
    { key: "performanceScore", label: compact ? "Perf." : "Performans" },
  ];

  return (
    <div className="flex items-start gap-3">
      {items.map((item) => (
        <RatingGauge key={item.key} label={item.label} score={scores[item.key]} size={size} />
      ))}
    </div>
  );
}
