"use client";

import Link from "next/link";
import { ListingCard } from "@/components/ListingCard";
import { useFavoriteIds } from "@/components/FavoriteButton";
import { isGoodDeal } from "@/lib/deal";
import type { ExplorableListing } from "@/components/ListingsExplorer";

export function FavoritesView({
  listings,
  avgPriceByProfile,
  coverPhotoByListing,
}: {
  listings: ExplorableListing[];
  avgPriceByProfile: Record<number, number>;
  coverPhotoByListing: Record<number, string>;
}) {
  const favoriteIds = useFavoriteIds();
  const favorites = listings.filter((l) => favoriteIds.includes(l.id));

  if (favorites.length === 0) {
    return (
      <div className="mt-8 rounded-xl border border-dashed border-border-subtle p-10 text-center">
        <p className="text-foreground/70">
          Hələ sevimlilərə heç bir elan əlavə etməmisiniz.
        </p>
        <p className="mt-1 text-sm text-foreground/50">
          Bəyəndiyiniz elanın kartındakı ürək düyməsinə klikləyin — burada
          görünəcək.
        </p>
        <Link
          href="/elanlar"
          className="mt-4 inline-block rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-600"
        >
          Elanlara bax →
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {favorites.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          goodDeal={isGoodDeal(listing.price, avgPriceByProfile[listing.modelProfileId])}
          coverPhotoUrl={coverPhotoByListing[listing.id] ?? null}
        />
      ))}
    </div>
  );
}
