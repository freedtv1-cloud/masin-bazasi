const STYLES: Record<string, string> = {
  "aşağı": "bg-emerald-100 text-emerald-800",
  orta: "bg-amber-100 text-amber-800",
  "yüksək": "bg-rose-100 text-rose-800",
};

const DOT: Record<string, string> = {
  "aşağı": "bg-emerald-500",
  orta: "bg-amber-500",
  "yüksək": "bg-rose-500",
};

export function SeverityBadge({ level }: { level: string }) {
  const style = STYLES[level] ?? "bg-slate-100 text-slate-700";
  const dot = DOT[level] ?? "bg-slate-400";
  return (
    <span className={`severity-badge ${style}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden />
      {level} risk
    </span>
  );
}
