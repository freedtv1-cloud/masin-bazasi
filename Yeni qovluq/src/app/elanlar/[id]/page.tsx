import { notFound } from "next/navigation";
import Link from "next/link";
import { getListingDetail } from "@/lib/queries";
import { SeverityBadge } from "@/components/SeverityBadge";

export const dynamic = "force-dynamic";

function formatAzn(n: number) {
  return `${n.toLocaleString("az-AZ")} ₼`;
}

function priceSignal(price: number, min: number, max: number) {
  const mid = (min + max) / 2;
  if (price <= min + (mid - min) * 0.3) {
    return { label: "Bazara görə ucuzdur", tone: "bg-emerald-100 text-emerald-800" };
  }
  if (price >= max - (max - mid) * 0.3) {
    return { label: "Bazara görə bahadır", tone: "bg-rose-100 text-rose-800" };
  }
  return { label: "Bazar aralığına uyğundur", tone: "bg-amber-100 text-amber-800" };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getListingDetail(Number(id));
  if (!data) notFound();

  const { listing, problems, priceRange } = data;
  const signal = priceRange
    ? priceSignal(listing.price, priceRange.min, priceRange.max)
    : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <nav className="text-sm text-foreground/50">
        <Link href="/elanlar" className="hover:text-brand-500">
          Elanlar
        </Link>{" "}
        / {listing.brandName} {listing.modelName}
      </nav>

      <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-2xl font-bold">
            {listing.brandName} {listing.modelName} · {listing.year}
          </h1>
          <p className="mt-1 text-foreground/60">
            {listing.mileageKm.toLocaleString("az-AZ")} km · {listing.condition} ·{" "}
            {listing.city}
          </p>
          <Link
            href={`/modeller/${listing.modelProfileId}`}
            className="mt-1 inline-block text-sm text-brand-500 hover:underline"
          >
            {listing.engine} ({listing.yearFrom}–{listing.yearTo}) profilinə bax →
          </Link>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-brand-500">
            {formatAzn(listing.price)}
          </p>
          {signal && (
            <span className={`severity-badge mt-1 ${signal.tone}`}>{signal.label}</span>
          )}
        </div>
      </div>

      {listing.description && (
        <p className="mt-6 rounded-xl border border-border-subtle bg-surface p-4 text-foreground/80 shadow-sm">
          {listing.description}
        </p>
      )}

      <section className="mt-8 rounded-xl border border-border-subtle bg-surface p-4 shadow-sm">
        <h2 className="font-semibold">Satıcı</h2>
        <p className="mt-1 text-foreground/80">
          {listing.sellerName} · {listing.sellerCity}
        </p>
        <p className="mt-1 font-medium text-brand-500">{listing.sellerPhone}</p>
      </section>

      {problems.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">
            Bu modelin tanınmış xronik problemləri
          </h2>
          <ul className="mt-4 space-y-3">
            {problems.map((p) => (
              <li
                key={p.id}
                className="rounded-xl border border-border-subtle bg-surface p-4 shadow-sm"
              >
                <SeverityBadge level={p.severity} />
                <p className="mt-2 text-foreground/90">{p.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
