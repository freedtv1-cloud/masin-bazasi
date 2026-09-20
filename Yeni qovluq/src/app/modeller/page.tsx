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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold">Model bazası</h1>
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
          className="flex-1 rounded-lg border border-border-subtle bg-surface px-3 py-2 outline-none focus:border-brand-500"
        />
        <button
          type="submit"
          className="rounded-lg bg-brand-500 px-4 py-2 font-medium text-white hover:bg-brand-600"
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
  );
}
