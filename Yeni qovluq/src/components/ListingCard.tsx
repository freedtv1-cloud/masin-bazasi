import Link from "next/link";
import { FavoriteButton } from "@/components/FavoriteButton";

function formatAzn(n: number) {
  return `${n.toLocaleString("az-AZ")} ₼`;
}

const STATUS_LABEL: Record<string, string> = {
  satılıb: "Satılıb",
  arxiv: "Arxiv",
};

export function ListingCard({
  listing,
  goodDeal = false,
  coverPhotoUrl = null,
}: {
  listing: {
    id: number;
    brandName: string;
    modelName: string;
    year: number;
    mileageKm: number;
    condition: string;
    price: number;
    city: string;
    status: string;
  };
  goodDeal?: boolean;
  coverPhotoUrl?: string | null;
}) {
  return (
    <Link
      href={`/elanlar/${listing.id}`}
      className="card-rise group relative flex flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-24 overflow-hidden bg-gradient-to-br from-accent-500 to-accent-700">
        {coverPhotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverPhotoUrl}
            alt={`${listing.brandName} ${listing.modelName}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <>
            <div className="market-pattern pointer-events-none absolute inset-0" />
            <svg
              className="absolute -bottom-2 right-2 text-white/25"
              width="72"
              height="72"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M3 13.5 4.8 8a2 2 0 0 1 1.9-1.4h10.6A2 2 0 0 1 19.2 8L21 13.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect x="2.5" y="13.5" width="19" height="5" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="7" cy="18.5" r="1.4" fill="currentColor" />
              <circle cx="17" cy="18.5" r="1.4" fill="currentColor" />
            </svg>
          </>
        )}

        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {listing.status !== "aktiv" && (
            <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-slate-600">
              {STATUS_LABEL[listing.status] ?? listing.status}
            </span>
          )}
          {goodDeal && (
            <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
              Sərfəli təklif
            </span>
          )}
        </div>

        <FavoriteButton listingId={listing.id} />

        <span className="absolute bottom-0 right-3 translate-y-1/2 rounded-full bg-white px-3 py-1 text-sm font-bold text-accent-600 shadow-md">
          {formatAzn(listing.price)}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between px-4 pb-4 pt-5">
        <div>
          <h3 className="font-semibold text-foreground">
            {listing.brandName} {listing.modelName}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-foreground/60">
            {listing.year} · {listing.mileageKm.toLocaleString("az-AZ")} km ·{" "}
            {listing.condition}
          </p>
        </div>
        <div className="mt-3 flex items-center gap-1 border-t border-border-subtle pt-3 text-sm text-foreground/50">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <circle cx="12" cy="9.5" r="2.2" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          {listing.city}
        </div>
      </div>
    </Link>
  );
}
