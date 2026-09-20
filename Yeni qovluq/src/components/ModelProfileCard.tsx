import Link from "next/link";
import type { ModelProfileCard as ModelProfileCardType } from "@/lib/queries";

function formatAzn(n: number) {
  return `${n.toLocaleString("az-AZ")} ₼`;
}

export function ModelProfileCard({ profile }: { profile: ModelProfileCardType }) {
  return (
    <Link
      href={`/modeller/${profile.id}`}
      className="group flex flex-col justify-between rounded-xl border border-border-subtle bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-brand-500">
          {profile.brandName}
        </p>
        <h3 className="mt-0.5 text-lg font-semibold text-foreground">
          {profile.modelName}
        </h3>
        <p className="mt-1 text-sm text-foreground/60">
          {profile.yearFrom}–{profile.yearTo} · {profile.engine}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3 text-sm">
        <span className="font-semibold text-brand-500">
          {profile.minPrice && profile.maxPrice
            ? `${formatAzn(profile.minPrice)} – ${formatAzn(profile.maxPrice)}`
            : "Qiymət məlumatı yoxdur"}
        </span>
        <span className="text-foreground/50 group-hover:text-accent-600">
          {profile.listingCount} elan →
        </span>
      </div>
    </Link>
  );
}
