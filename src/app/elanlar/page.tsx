import type { Metadata } from "next";
import { getAllListings, getProfilePriceStats, getAllListingPhotos } from "@/lib/queries";
import { ListingsExplorer } from "@/components/ListingsExplorer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Elanlar — aktiv avtomobil elanları",
  description:
    "Marka, şəhər, qiymət və vəziyyətə görə filtrləyin. Hər elan öz model profili ilə əlaqələndirilib.",
  alternates: { canonical: "/elanlar" },
};

export default async function ListingsPage() {
  const [listings, priceStats, photos] = await Promise.all([
    getAllListings(),
    getProfilePriceStats(),
    getAllListingPhotos(),
  ]);
  const activeCount = listings.filter((l) => l.status === "aktiv").length;

  const avgPriceByProfile = Object.fromEntries(
    priceStats.map((s) => [s.modelProfileId, s.avgPrice])
  );

  // Hər elanın ilk şəkli (sort_order-ə görə) — siyahı artıq sortOrder üzrə
  // sıralanıb gəlir, ona görə ilk rastlaşılan qeyd elə üz şəklidir.
  const coverPhotoByListing: Record<number, string> = {};
  for (const p of photos) {
    if (!(p.listingId in coverPhotoByListing)) {
      coverPhotoByListing[p.listingId] = p.url;
    }
  }

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
              {activeCount} aktiv elan. Marka, şəhər, qiymət və vəziyyətə görə
              filtrləyin — hər elan öz model profili ilə əlaqələndirilib, qiymətin
              bazara uyğun olub-olmadığını profil səhifəsində görə bilərsiniz.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <ListingsExplorer
            listings={listings}
            avgPriceByProfile={avgPriceByProfile}
            coverPhotoByListing={coverPhotoByListing}
          />
        </div>
      </div>
    </div>
  );
}
