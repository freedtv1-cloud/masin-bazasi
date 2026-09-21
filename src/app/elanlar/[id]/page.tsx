import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getListingDetail } from "@/lib/queries";
import { SeverityBadge } from "@/components/SeverityBadge";
import { ListingGallery } from "@/components/ListingGallery";
import { FavoriteButton } from "@/components/FavoriteButton";

export const dynamic = "force-dynamic";

function formatAzn(n: number) {
  return `${n.toLocaleString("az-AZ")} ₼`;
}

function toWhatsAppLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const withCountryCode = digits.startsWith("994")
    ? digits
    : digits.startsWith("0")
      ? `994${digits.slice(1)}`
      : `994${digits}`;
  return `https://wa.me/${withCountryCode}`;
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await getListingDetail(Number(id));
  if (!data) return { title: "Elan tapılmadı" };
  const { listing } = data;
  const title = `${listing.brandName} ${listing.modelName} ${listing.year} — ${formatAzn(listing.price)}`;
  const description = [
    `${listing.mileageKm.toLocaleString("az-AZ")} km`,
    listing.condition,
    listing.city,
  ].join(" · ");
  return {
    title,
    description,
    alternates: { canonical: `/elanlar/${listing.id}` },
    openGraph: { title, description },
  };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getListingDetail(Number(id));
  if (!data) notFound();

  const { listing, problems, photos, priceRange } = data;
  const signal = priceRange
    ? priceSignal(listing.price, priceRange.min, priceRange.max)
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: `${listing.brandName} ${listing.modelName} ${listing.year}`,
    brand: { "@type": "Brand", name: listing.brandName },
    model: listing.modelName,
    vehicleModelDate: String(listing.year),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: listing.mileageKm,
      unitCode: "KMT",
    },
    offers: {
      "@type": "Offer",
      price: listing.price,
      priceCurrency: "AZN",
      availability:
        listing.status === "aktiv"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
      areaServed: listing.city,
    },
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="flex items-center justify-between text-sm text-foreground/50">
        <span>
          <Link href="/elanlar" className="hover:text-accent-600">
            Elanlar
          </Link>{" "}
          / {listing.brandName} {listing.modelName}
        </span>
        <span className="relative inline-block h-8 w-8">
          <FavoriteButton listingId={listing.id} />
        </span>
      </nav>

      <ListingGallery photos={photos} alt={`${listing.brandName} ${listing.modelName}`} />

      <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
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
            className="mt-1 inline-block text-sm text-catalog-600 hover:underline"
          >
            {listing.engine} ({listing.yearFrom}–{listing.yearTo}) profilinə bax →
          </Link>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-accent-600">
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
        <p className="mt-1 font-medium text-accent-600">{listing.sellerPhone}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={`tel:${listing.sellerPhone.replace(/\s+/g, "")}`}
            className="rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-accent-600"
          >
            Zəng et
          </a>
          <a
            href={toWhatsAppLink(listing.sellerPhone)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-600"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.77.46 3.45 1.34 4.95L2 22l5.28-1.39a9.87 9.87 0 0 0 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.82 14.02c-.24.68-1.4 1.3-1.93 1.36-.5.06-1.02.09-1.65-.1-.38-.11-.87-.28-1.5-.55-2.63-1.14-4.35-3.8-4.48-3.98-.13-.18-1.07-1.42-1.07-2.71s.68-1.93.92-2.19c.24-.26.53-.33.71-.33.18 0 .35 0 .5.01.16.01.38-.06.6.46.24.58.81 1.99.88 2.13.07.14.12.31.02.5-.09.18-.14.3-.28.46-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.16-.19.68-.79.86-1.06.18-.28.35-.23.6-.14.24.09 1.55.73 1.82.87.27.14.45.2.51.32.07.11.07.65-.17 1.33Z" />
            </svg>
            WhatsApp
          </a>
        </div>
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
