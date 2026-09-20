import Link from "next/link";

function formatAzn(n: number) {
  return `${n.toLocaleString("az-AZ")} ₼`;
}

export function ListingCard({
  listing,
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
}) {
  return (
    <Link
      href={`/elanlar/${listing.id}`}
      className="flex flex-col justify-between rounded-xl border border-border-subtle bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-foreground">
            {listing.brandName} {listing.modelName}
          </h3>
          <p className="text-sm text-foreground/60">
            {listing.year} · {listing.mileageKm.toLocaleString("az-AZ")} km ·{" "}
            {listing.condition}
          </p>
        </div>
        {listing.status !== "aktiv" && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {listing.status}
          </span>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3 text-sm">
        <span className="text-lg font-semibold text-brand-500">
          {formatAzn(listing.price)}
        </span>
        <span className="text-foreground/50">{listing.city}</span>
      </div>
    </Link>
  );
}
