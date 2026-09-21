import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const SITE_URL = "https://masin-bazasi-canli.netlify.app";
const SITE_TITLE = "MaşınBazası — maşın alarkən nəyə diqqət etməlisiniz";
const SITE_DESCRIPTION =
  "Sadəcə elanlar deyil — hər model üçün xronik problemlər, real bazar qiyməti və elanlar bir arada.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · MaşınBazası",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "az_AZ",
    siteName: "MaşınBazası",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
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
              <Link href="/modeller" className="hidden text-foreground/80 hover:text-catalog-600 sm:inline">
                Model bazası
              </Link>
              <Link href="/muqayise" className="hidden text-foreground/80 hover:text-catalog-600 sm:inline">
                Müqayisə
              </Link>
              <Link href="/elanlar" className="text-foreground/80 hover:text-accent-600">
                Elanlar
              </Link>
              <Link href="/sevimlilerim" className="text-foreground/80 hover:text-accent-600" aria-label="Sevimlilərim">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M12 20.5s-7.5-4.6-10-9.3C.5 8 1.8 4.5 5 3.4c2.2-.8 4.5.1 6 2 1.5-1.9 3.8-2.8 6-2 3.2 1.1 4.5 4.6 3 7.8-2.5 4.7-10 9.3-10 9.3Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
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
              MaşınBazası — konsepsiya prototipidir. Xronik problem və qiymət
              məlumatları forumlardan, xarici bazalardan və analitik
              hesablamalardan toplanıb; alış qərarından əvvəl mütləq öz
              yoxlamanızı edin.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
