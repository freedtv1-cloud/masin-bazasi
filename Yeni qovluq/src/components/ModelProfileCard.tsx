import Link from "next/link";
import type { ModelProfileCard as ModelProfileCardType } from "@/lib/queries";

function formatAzn(n: number) {
  return `${n.toLocaleString("az-AZ")} ₼`;
}

const BODY_TYPE_LABEL: Record<string, string> = {
  sedan: "Sedan",
  offroader: "Offroader",
  hetçbek: "Hetçbek",
  universal: "Universal",
  kupe: "Kupe",
  minivan: "Minivan",
};

export function ModelProfileCard({ profile }: { profile: ModelProfileCardType }) {
  return (
    <Link
      href={`/modeller/${profile.id}`}
      className="card-rise group flex flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-catalog-600 to-catalog-500 px-4 py-3">
        <div className="catalog-pattern pointer-events-none absolute inset-0" />
        <div className="relative flex items-start justify-between gap-2">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-catalog-50/80">
              {profile.brandName}
            </p>
            <h3 className="mt-0.5 font-[family-name:var(--font-display)] text-lg font-bold leading-tight text-white">
              {profile.modelName}
            </h3>
          </div>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M3 13.5 4.8 8a2 2 0 0 1 1.9-1.4h10.6A2 2 0 0 1 19.2 8L21 13.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect x="2.5" y="13.5" width="19" height="5" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="7" cy="18.5" r="1.4" fill="currentColor" />
              <circle cx="17" cy="18.5" r="1.4" fill="currentColor" />
            </svg>
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-foreground/60">
            {profile.yearFrom}–{profile.yearTo} · {profile.engine}
          </span>
          {profile.bodyType && (
            <span className="rounded-full bg-catalog-50 px-2 py-0.5 text-xs font-medium text-catalog-700">
              {BODY_TYPE_LABEL[profile.bodyType] ?? profile.bodyType}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3 text-sm">
          <span className="font-semibold text-catalog-700">
            {profile.minPrice && profile.maxPrice
              ? `${formatAzn(profile.minPrice)} – ${formatAzn(profile.maxPrice)}`
              : "Qiymət məlumatı yoxdur"}
          </span>
          <span className="font-medium text-foreground/50 group-hover:text-catalog-600">
            {profile.listingCount} elan →
          </span>
        </div>
      </div>
    </Link>
  );
}
