import { getAllListings, getProfilePriceStats, getAllListingPhotos } from "@/lib/queries";
import { FavoritesView } from "@/components/FavoritesView";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const [listings, priceStats, photos] = await Promise.all([
    getAllListings(),
    getProfilePriceStats(),
    getAllListingPhotos(),
  ]);

  const avgPriceByProfile = Object.fromEntries(
    priceStats.map((s) => [s.modelProfileId, s.avgPrice])
  );
  const coverPhotoByListing: Record<number, string> = {};
  for (const p of photos) {
    if (!(p.listingId in coverPhotoByListing)) coverPhotoByListing[p.listingId] = p.url;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-accent-600">
        Şəxsi siyahı
      </p>
      <h1 className="mt-1 text-3xl font-bold text-foreground">Sevimlilərim</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Bəyəndiyiniz elanlar bu cihazda, brauzerinizdə saxlanılır — hesab
        yaratmağa ehtiyac yoxdur.
      </p>

      <FavoritesView
        listings={listings}
        avgPriceByProfile={avgPriceByProfile}
        coverPhotoByListing={coverPhotoByListing}
      />
    </div>
  );
}
