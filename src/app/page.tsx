import Link from "next/link";
import {
  getModelProfileCards,
  getAllListings,
  getProfilePriceStats,
  getAllListingPhotos,
} from "@/lib/queries";
import { ModelProfileCard } from "@/components/ModelProfileCard";
import { ListingCard } from "@/components/ListingCard";
import { isGoodDeal } from "@/lib/deal";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [profiles, listings, priceStats, photos] = await Promise.all([
    getModelProfileCards(),
    getAllListings(),
    getProfilePriceStats(),
    getAllListingPhotos(),
  ]);

  const recentListings = listings.slice(0, 4);
  const avgPriceByProfile = Object.fromEntries(
    priceStats.map((s) => [s.modelProfileId, s.avgPrice])
  );
  const coverPhotoByListing: Record<number, string> = {};
  for (const p of photos) {
    if (!(p.listingId in coverPhotoByListing)) coverPhotoByListing[p.listingId] = p.url;
  }

  return (
    <div>
      <section className="bg-brand-500">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-100">
            Sadəcə elanlar deyil
          </p>
          <h1 className="mt-2 max-w-2xl text-3xl font-bold text-white sm:text-4xl">
            Maşın almazdan əvvəl bilməli olduğunuz hər şey — bir yerdə
          </h1>
          <p className="mt-3 max-w-xl text-brand-100">
            Hər model üçün xronik problemlər, real bazar qiyməti və mövcud
            elanlar birlikdə. Elana girəndə həm sahibinin yazdığını, həm də
            həmin modelin tanınmış problemlərini görürsünüz.
          </p>

          <form
            action="/modeller"
            method="GET"
            className="mt-6 flex max-w-xl gap-2 rounded-xl bg-white p-2 shadow-lg"
          >
            <input
              type="text"
              name="q"
              placeholder="Marka və ya model axtarın (məs: Camry, X5)"
              className="flex-1 rounded-lg border-0 px-3 py-2 text-foreground outline-none placeholder:text-foreground/40"
            />
            <button
              type="submit"
              className="rounded-lg bg-accent-500 px-4 py-2 font-medium text-white transition hover:bg-accent-600"
            >
              Axtar
            </button>
          </form>
        </div>
      </section>

      <section className="relative overflow-hidden bg-catalog-50">
        <div className="catalog-pattern pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-catalog-500 text-white shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M4 5h16M4 12h16M4 19h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-catalog-700">
                Model bazası
              </h2>
            </div>
            <Link href="/modeller" className="text-sm font-medium text-catalog-600 hover:underline">
              Hamısına bax →
            </Link>
          </div>
          <p className="mt-1 text-sm text-foreground/60">
            Hər profilin öz xronik problemləri, təmir xərci təxmini və bazar
            qiymət aralığı var.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.slice(0, 6).map((profile) => (
              <ModelProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500 text-white shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M3 13.5 4.8 8a2 2 0 0 1 1.9-1.4h10.6A2 2 0 0 1 19.2 8L21 13.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect x="2.5" y="13.5" width="19" height="5" rx="1.6" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </span>
            <h2 className="text-xl font-bold text-foreground">Son elanlar</h2>
          </div>
          <Link href="/elanlar" className="text-sm font-medium text-accent-600 hover:underline">
            Bütün elanlar →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recentListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              goodDeal={isGoodDeal(listing.price, avgPriceByProfile[listing.modelProfileId])}
              coverPhotoUrl={coverPhotoByListing[listing.id] ?? null}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
