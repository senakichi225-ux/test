import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

/** ヘッダー・本文・フッターの共通の外枠 */
export async function PageShell({ children }: { children: React.ReactNode }) {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return (
    <>
      <SiteHeader dict={dict} locale={locale} />
      <main id="main">{children}</main>
      <SiteFooter dict={dict} locale={locale} />
    </>
  );
}

/** ページの見出し部分（ラベル＋大見出し＋リード文） */
export function PageIntro({ label, title, lead, children }: { label: string; title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-20 pb-16 sm:px-10 lg:px-16 lg:pt-28 lg:pb-24">
      <div className="max-w-3xl space-y-8">
        <p className="label">{label}</p>
        <h1 className="font-serif text-5xl leading-[1.02] font-light text-balance text-sumi sm:text-6xl lg:text-7xl">{title}</h1>
        {lead && <p className="max-w-2xl text-lg leading-relaxed text-usuzumi">{lead}</p>}
        {children}
      </div>
    </div>
  );
}
