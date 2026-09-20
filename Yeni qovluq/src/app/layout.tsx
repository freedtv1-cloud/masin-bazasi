import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "MaşınBazası — maşın seçərkən nəyə diqqət etməli",
  description:
    "Yalnız elan yox — hər model üçün xronik problemlər, real bazar qiyməti və elanlar bir yerdə.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="az" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="sticky top-0 z-30 border-b border-border-subtle bg-surface/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold text-brand-500">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
                MB
              </span>
              <span className="text-base sm:text-lg">MaşınBazası</span>
            </Link>
            <nav className="flex items-center gap-3 text-sm font-medium sm:gap-6">
              <Link href="/modeller" className="hidden text-foreground/80 hover:text-brand-500 sm:inline">
                Model bazası
              </Link>
              <Link href="/elanlar" className="text-foreground/80 hover:text-brand-500">
                Elanlar
              </Link>
              <Link
                href="/elan-yarat"
                className="rounded-lg bg-accent-500 px-3 py-2 text-white shadow-sm transition hover:bg-accent-600 sm:px-4"
              >
                Elan yerləşdir
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border-subtle bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-foreground/60 sm:px-6">
            <p>
              MaşınBazası — konsepsiya prototipi. Xronik problem və qiymət
              məlumatları forum, xarici bazalar və AI generasiyası ilə
              toplanıb; alış qərarından əvvəl mütləq öz yoxlamanızı edin.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
