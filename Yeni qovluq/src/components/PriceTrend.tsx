type PricePoint = { date: string; price: number };

function formatAzn(n: number) {
  return `${n.toLocaleString("az-AZ")} ₼`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("az-AZ", { month: "short", year: "2-digit" });
}

export function PriceTrend({ points }: { points: PricePoint[] }) {
  if (points.length === 0) {
    return (
      <p className="text-sm text-foreground/60">
        Hələ qiymət tarixçəsi yoxdur.
      </p>
    );
  }

  const prices = points.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const width = 320;
  const height = 96;
  const padX = 8;
  const padY = 12;

  const coords = points.map((p, i) => {
    const x =
      points.length === 1
        ? width / 2
        : padX + (i / (points.length - 1)) * (width - padX * 2);
    const y =
      height - padY - ((p.price - min) / range) * (height - padY * 2);
    return { x, y, ...p };
  });

  const path = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(" ");

  const last = coords[coords.length - 1];

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-foreground/50">
            Bazar qiyməti aralığı
          </p>
          <p className="text-2xl font-semibold text-brand-500">
            {formatAzn(min)}
            <span className="mx-1 text-foreground/40">–</span>
            {formatAzn(max)}
          </p>
        </div>
        <p className="text-xs text-foreground/50">
          son qeyd: {formatDate(points[points.length - 1].date)}
        </p>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-3 h-24 w-full"
        role="img"
        aria-label={`Qiymət trendi, ${formatAzn(min)} ilə ${formatAzn(max)} arası`}
      >
        <path
          d={path}
          fill="none"
          stroke="var(--brand-500, #1d3557)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {coords.map((c, i) => (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r={i === coords.length - 1 ? 3.5 : 2.5}
            fill={i === coords.length - 1 ? "#e07a3f" : "#1d3557"}
          />
        ))}
      </svg>
      <p className="text-xs text-foreground/50">
        son qiymət ({formatDate(last.date)}): {formatAzn(last.price)}
      </p>
    </div>
  );
}
