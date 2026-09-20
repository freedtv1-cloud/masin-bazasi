import Link from "next/link";
import { getModelProfileCards, getAllListings } from "@/lib/queries";
import { ModelProfileCard } from "@/components/ModelProfileCard";
import { ListingCard } from "@/components/ListingCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [profiles, listings] = await Promise.all([
    getModelProfileCards(),
    getAllListings(),
  ]);

  const recentListings = listings.slice(0, 4);

  return (
    <div>
      <section className="bg-brand-500">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-100">
            Sadəcə elan yox
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

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-semibold">Model bazası</h2>
          <Link href="/modeller" className="text-sm font-medium text-brand-500 hover:underline">
            Hamısına bax →
          </Link>
        </div>
        <p className="mt-1 text-sm text-foreground/60">
          Hər profil xronik problemlər, təmir xərci təxmini və bazar qiymət
          aralığı ilə gəlir.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.slice(0, 6).map((profile) => (
            <ModelProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-semibold">Son elanlar</h2>
          <Link href="/elanlar" className="text-sm font-medium text-brand-500 hover:underline">
            Bütün elanlar →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recentListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </div>
  );
}
