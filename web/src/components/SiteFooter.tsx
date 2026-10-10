import Link from "next/link";
import { cacheLife } from "next/cache";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { TAGLINE } from "@/lib/brand";
import { Wordmark } from "./Wordmark";

/** 著作権表示の年。現在時刻を読むので、1日単位でキャッシュする（Cache Components） */
async function currentYear(): Promise<number> {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function SiteFooter({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const links = [
    { href: `/${locale}/works`, label: dict.nav.works },
    { href: `/${locale}/story`, label: dict.nav.story },
    { href: `/${locale}/commissions`, label: dict.nav.commissions },
    { href: `/${locale}/contact`, label: dict.footer.contact },
    { href: `/${locale}/shipping-care`, label: dict.footer.shipping },
    { href: `/${locale}/privacy`, label: dict.footer.privacy },
  ];
  return (
    <footer className="bg-sumi text-washi">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-10 md:grid-cols-[1fr_auto] lg:px-16">
        <div className="space-y-4">
          <Wordmark className="text-3xl" />
          <p className="font-serif text-xl font-light text-washi/80">{TAGLINE}</p>
          <p className="text-sm text-washi/60">{dict.footer.operated}</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm text-washi/70 md:text-right">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-washi">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mx-auto max-w-7xl border-t border-washi/10 px-5 py-6 text-xs text-washi/50 sm:px-10 lg:px-16">
        © {await currentYear()} kerokero. {dict.footer.rights}
      </div>
    </footer>
  );
}
