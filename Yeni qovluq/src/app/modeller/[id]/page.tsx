import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getModelProfileDetail, getAllListingPhotos } from "@/lib/queries";
import { SeverityBadge } from "@/components/SeverityBadge";
import { PriceTrend } from "@/components/PriceTrend";
import { ListingCard } from "@/components/ListingCard";
import { RatingGaugeRow } from "@/components/RatingGauge";
import { isGoodDeal } from "@/lib/deal";

export const dynamic = "force-dynamic";

const SOURCE_LABEL: Record<string, string> = {
  forum: "Forum",
  xarici_baza: "Xarici baza",
  ai_generasiya: "Analitik hesablama",
};

function formatAzn(n: number) {
  return `${n.toLocaleString("az-AZ")} ₼`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await getModelProfileDetail(Number(id));
  if (!data) return { title: "Model tapılmadı" };
  const { profile } = data;
  const title = `${profile.brandName} ${profile.modelName} (${profile.yearFrom}–${profile.yearTo}) — xronik problemlər və qiymət`;
  const description =
    profile.summary ??
    `${profile.brandName} ${profile.modelName} (${profile.yearFrom}–${profile.yearTo}, ${profile.engine}) üçün bilinən xronik problemlər, təmir xərcləri və bazar qiymət aralığı.`;
  return {
    title,
    description,
    alternates: { canonical: `/modeller/${profile.id}` },
    openGraph: { title, description },
  };
}

export default async function ModelProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [data, photos] = await Promise.all([
    getModelProfileDetail(Number(id)),
    getAllListingPhotos(),
  ]);
  if (!data) notFound();

  const { profile, problems, prices, listings } = data;

  const avgPrice = prices.length
    ? prices.reduce((sum, p) => sum + p.price, 0) / prices.length
    : null;
  const coverPhotoByListing: Record<number, string> = {};
  for (const p of photos) {
    if (!(p.listingId in coverPhotoByListing)) coverPhotoByListing[p.listingId] = p.url;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav className="text-sm text-foreground/50">
        <Link href="/modeller" className="hover:text-catalog-600">
          Model bazası
        </Link>{" "}
        / {profile.brandName} {profile.modelName}
      </nav>

      <div className="mt-3 flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-catalog-600">
            {profile.brandName}
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-catalog-700">
            {profile.modelName}
          </h1>
          <p className="mt-1 text-foreground/60">
            {profile.yearFrom}–{profile.yearTo} · {profile.engine}
            {profile.bodyType ? ` · ${profile.bodyType}` : ""}
          </p>
          {profile.summary && (
            <p className="mt-4 max-w-2xl text-foreground/80">{profile.summary}</p>
          )}
          <div className="mt-6 flex flex-wrap gap-5 rounded-xl border border-border-subtle bg-surface p-4 shadow-sm">
            <RatingGaugeRow
              scores={{
                safetyScore: profile.safetyScore,
                reliabilityScore: profile.reliabilityScore,
                valueScore: profile.valueScore,
                performanceScore: profile.performanceScore,
              }}
              size={68}
            />
          </div>
        </div>
        <div className="w-full max-w-xs rounded-xl border border-catalog-100 bg-surface p-4 shadow-sm">
          <PriceTrend points={prices} />
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-catalog-700">Xronik problemlər</h2>
        <p className="mt-1 text-sm text-foreground/60">
          Bu məlumatlar forumlardan, xarici bazalardan və analitik
          hesablamalardan toplanıb — almazdan əvvəl mütləq serviste
          yoxlatdırın.
        </p>

        {problems.length === 0 ? (
          <p className="mt-6 text-foreground/60">
            Bu profil üçün hələ məlumat toplanmayıb.
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {problems.map((p) => (
              <li
                key={p.id}
                className="rounded-xl border border-border-subtle bg-surface p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <SeverityBadge level={p.severity} />
                  {(p.kmFrom || p.kmTo) && (
                    <span className="text-xs text-foreground/50">
                      {p.kmFrom ? p.kmFrom.toLocaleString("az-AZ") : "0"}–
                      {p.kmTo ? p.kmTo.toLocaleString("az-AZ") : "∞"} km
                    </span>
                  )}
                </div>
                <p className="mt-2 text-foreground/90">{p.description}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-foreground/50">
                  {p.repairCostMin && p.repairCostMax && (
                    <span>
                      Təxmini təmir: {formatAzn(p.repairCostMin)}–
                      {formatAzn(p.repairCostMax)}
                    </span>
                  )}
                  <span>Mənbə: {SOURCE_LABEL[p.sourceType] ?? p.sourceType}</span>
                  <span>Etibarlılıq: {Math.round(p.confidence * 100)}%</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-accent-600">
          Bu profilə aid elanlar ({listings.length})
        </h2>
        {listings.length === 0 ? (
          <p className="mt-6 text-foreground/60">
            Hazırda bu profil üzrə aktiv elan yoxdur.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
              <ListingCard
                key={l.id}
                listing={{
                  id: l.id,
                  brandName: profile.brandName,
                  modelName: profile.modelName,
                  year: l.year,
                  mileageKm: l.mileageKm,
                  condition: l.condition,
                  price: l.price,
                  city: l.city,
                  status: l.status,
                }}
                goodDeal={isGoodDeal(l.price, avgPrice)}
                coverPhotoUrl={coverPhotoByListing[l.id] ?? null}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
