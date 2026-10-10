import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Wordmark } from "./Wordmark";

export function SiteHeader({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const links = [
    { href: "#about", label: dict.nav.about },
    { href: "#gallery", label: dict.nav.gallery },
    { href: "#craft", label: dict.nav.craft },
    { href: "#designers", label: dict.nav.designers },
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-sumi/5 bg-washi/80 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:bg-washi focus:px-3 focus:py-2"
      >
        {dict.nav.skip}
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href={`/${locale}`} className="text-xl text-sumi" aria-label="SŌN">
          <Wordmark />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-8 text-sm text-usuzumi lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-sumi">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-5">
          <LanguageSwitcher current={locale} label={dict.nav.language} />
          <a
            href="#waitlist"
            className="hidden border border-sumi px-4 py-2 text-xs tracking-wider transition-colors hover:bg-sumi hover:text-washi sm:inline-block"
          >
            {dict.nav.waitlist}
          </a>
        </div>
      </div>
    </header>
  );
}
