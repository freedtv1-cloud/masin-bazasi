"use client";

import { useMemo, useState } from "react";
import { ListingCard } from "@/components/ListingCard";
import { isGoodDeal } from "@/lib/deal";

export type ExplorableListing = {
  id: number;
  year: number;
  mileageKm: number;
  condition: string;
  price: number;
  city: string;
  status: string;
  brandName: string;
  modelName: string;
  modelProfileId: number;
};

const CONDITION_OPTIONS = ["əla", "yaxşı", "orta", "təmirə ehtiyaclı"];

const SORT_OPTIONS = [
  { value: "newest", label: "Ən yeni" },
  { value: "price_asc", label: "Qiymət: ucuzdan bahaya" },
  { value: "price_desc", label: "Qiymət: bahadan ucuza" },
  { value: "year_desc", label: "İl: yenidən köhnəyə" },
  { value: "mileage_asc", label: "Yürüş: azdan çoxa" },
];

const fieldClass =
  "w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-sm outline-none focus:border-accent-500";

export function ListingsExplorer({
  listings,
  avgPriceByProfile = {},
  coverPhotoByListing = {},
}: {
  listings: ExplorableListing[];
  avgPriceByProfile?: Record<number, number>;
  coverPhotoByListing?: Record<number, string>;
}) {
  const [brand, setBrand] = useState("");
  const [city, setCity] = useState("");
  const [condition, setCondition] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");

  const activeListings = useMemo(
    () => listings.filter((l) => l.status === "aktiv"),
    [listings]
  );

  const brands = useMemo(
    () => Array.from(new Set(activeListings.map((l) => l.brandName))).sort((a, b) => a.localeCompare(b, "az")),
    [activeListings]
  );
  const cities = useMemo(
    () => Array.from(new Set(activeListings.map((l) => l.city))).sort((a, b) => a.localeCompare(b, "az")),
    [activeListings]
  );

  const filtered = useMemo(() => {
    let rows = activeListings;
    if (brand) rows = rows.filter((l) => l.brandName === brand);
    if (city) rows = rows.filter((l) => l.city === city);
    if (condition) rows = rows.filter((l) => l.condition === condition);

    const min = minPrice.trim() ? Number(minPrice) : null;
    const max = maxPrice.trim() ? Number(maxPrice) : null;
    if (min !== null && !Number.isNaN(min)) rows = rows.filter((l) => l.price >= min);
    if (max !== null && !Number.isNaN(max)) rows = rows.filter((l) => l.price <= max);

    rows = [...rows];
    if (sort === "price_asc") rows.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") rows.sort((a, b) => b.price - a.price);
    else if (sort === "year_desc") rows.sort((a, b) => b.year - a.year);
    else if (sort === "mileage_asc") rows.sort((a, b) => a.mileageKm - b.mileageKm);
    // "newest" — sorğudan gələn sıra (createdAt desc) olduğu kimi saxlanılır.

    return rows;
  }, [activeListings, brand, city, condition, minPrice, maxPrice, sort]);

  const hasActiveFilters =
    brand !== "" || city !== "" || condition !== "" || minPrice !== "" || maxPrice !== "" || sort !== "newest";

  function resetFilters() {
    setBrand("");
    setCity("");
    setCondition("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 rounded-xl border border-border-subtle bg-surface p-4 shadow-sm sm:grid-cols-3 lg:grid-cols-6">
        <select
          className={fieldClass}
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          aria-label="Marka"
        >
          <option value="">Bütün markalar</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          className={fieldClass}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          aria-label="Şəhər"
        >
          <option value="">Bütün şəhərlər</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className={fieldClass}
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          aria-label="Vəziyyət"
        >
          <option value="">Bütün vəziyyətlər</option>
          {CONDITION_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="number"
          inputMode="numeric"
          min={0}
          placeholder="Min qiymət (₼)"
          className={fieldClass}
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          aria-label="Minimum qiymət"
        />

        <input
          type="number"
          inputMode="numeric"
          min={0}
          placeholder="Maks qiymət (₼)"
          className={fieldClass}
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          aria-label="Maksimum qiymət"
        />

        <select
          className={fieldClass}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sırala"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-foreground/60">
        <span>{filtered.length} elan tapıldı</span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="font-medium text-accent-600 hover:underline"
          >
            Filtrləri təmizlə
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-foreground/60">
          Bu kriteriyalara uyğun elan tapılmadı. Filtrləri dəyişməyi sınayın.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              goodDeal={isGoodDeal(listing.price, avgPriceByProfile[listing.modelProfileId])}
              coverPhotoUrl={coverPhotoByListing[listing.id] ?? null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
