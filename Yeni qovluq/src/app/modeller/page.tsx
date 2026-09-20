import { searchModelProfiles } from "@/lib/queries";
import { ModelProfileCard } from "@/components/ModelProfileCard";

export const dynamic = "force-dynamic";

export default async function ModelsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const profiles = await searchModelProfiles(q);

  return (
    <div className="relative overflow-hidden">
      <div className="catalog-pattern pointer-events-none absolute inset-0 h-64" />
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-catalog-600">
          Arayış kataloqu
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold text-catalog-700">
          Model bazası
        </h1>
        <p className="mt-1 text-sm text-foreground/60">
          Marka, model, xronik problemlər və bazar qiyməti — alış qərarından
          əvvəl bura baxın.
        </p>

        <form action="/modeller" method="GET" className="mt-6 flex max-w-md gap-2">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Marka və ya model axtarın"
            className="flex-1 rounded-lg border border-border-subtle bg-surface px-3 py-2 outline-none focus:border-catalog-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-catalog-500 px-4 py-2 font-medium text-white hover:bg-catalog-600"
          >
            Axtar
          </button>
        </form>

        {profiles.length === 0 ? (
          <p className="mt-10 text-foreground/60">
            &ldquo;{q}&rdquo; üzrə nəticə tapılmadı.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile) => (
              <ModelProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
