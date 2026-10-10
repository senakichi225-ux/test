import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Wordmark } from "./Wordmark";

export function SiteHeader({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const links = [
    { href: `/${locale}/works`, label: dict.nav.works },
    { href: `/${locale}/story`, label: dict.nav.story },
    { href: `/${locale}/commissions`, label: dict.nav.commissions },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];
  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-30 border-b border-line/70 bg-washi/90 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:bg-washi focus:px-3 focus:py-2"
      >
        {dict.nav.skip}
      </a>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-2 px-5 py-4 sm:px-10 lg:px-16">
        <Link href={`/${locale}`} className="text-xl text-sumi" aria-label="SŌN — Home">
          <Wordmark />
        </Link>
        <div className="md:order-last">
          <LanguageSwitcher current={locale} label={dict.nav.language} />
        </div>
        <nav aria-label={dict.nav.main} className="order-last -mx-1 flex w-full gap-6 overflow-x-auto px-1 text-sm text-usuzumi md:order-none md:ml-auto md:w-auto md:gap-9">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="whitespace-nowrap py-1 transition-colors hover:text-sumi">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
