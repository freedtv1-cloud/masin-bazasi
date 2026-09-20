import { getAllListings } from "@/lib/queries";
import { ListingCard } from "@/components/ListingCard";

export const dynamic = "force-dynamic";

export default async function ListingsPage() {
  const listings = await getAllListings();

  return (
    <div className="relative overflow-hidden">
      <div className="market-pattern pointer-events-none absolute inset-0 h-64" />
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-600">
              Canlı bazar
            </p>
            <h1 className="mt-1 text-3xl font-bold text-foreground">Elanlar</h1>
            <p className="mt-1 text-sm text-foreground/60">
              {listings.length} aktiv elan. Hər elan öz model profilinə bağlıdır
              — qiymətin uyğun olub-olmadığını profil səhifəsində yoxlaya bilərsiniz.
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
}
