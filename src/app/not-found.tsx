import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-2xl font-bold text-brand-500">
        404
      </span>
      <h1 className="mt-4 text-2xl font-bold text-foreground">
        Axtardığınız səhifə tapılmadı
      </h1>
      <p className="mt-2 text-foreground/60">
        Bu elan və ya model profili silinmiş, ya da ünvan səhv yazılmış ola
        bilər.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
        >
          Ana səhifəyə qayıt
        </Link>
        <Link
          href="/modeller"
          className="rounded-lg border border-border-subtle px-4 py-2 text-sm font-medium text-catalog-600 hover:bg-catalog-50"
        >
          Model bazasına bax
        </Link>
        <Link
          href="/elanlar"
          className="rounded-lg border border-border-subtle px-4 py-2 text-sm font-medium text-accent-600 hover:bg-accent-50"
        >
          Elanlara bax
        </Link>
      </div>
    </div>
  );
}
