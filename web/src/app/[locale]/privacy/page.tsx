import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: `${dict.privacy.title} — SŌN` };
}

export default async function PrivacyPage() {
  const dict = await getDictionary();
  const locale = await getLocale();
  return (
    <>
      <SiteHeader dict={dict} locale={locale} />
      <main id="main" className="mx-auto max-w-3xl px-5 pt-36 pb-24 sm:px-8">
        <h1 className="font-serif text-4xl font-light text-sumi sm:text-5xl">{dict.privacy.title}</h1>
        <p className="mt-6 border-l-2 border-shu pl-4 text-sm text-shu">{dict.privacy.draft}</p>
        <p className="mt-2 text-sm text-usuzumi">{dict.privacy.updated}</p>
        <div className="mt-14 space-y-12">
          {dict.privacy.sections.map((s) => (
            <section key={s.title} className="space-y-3">
              <h2 className="font-serif text-2xl text-sumi">{s.title}</h2>
              <p className="leading-relaxed text-usuzumi">{s.body}</p>
            </section>
          ))}
        </div>
        <Link href={`/${locale}`} className="mt-16 inline-block text-sm text-ai underline underline-offset-4">
          ← {dict.privacy.back}
        </Link>
      </main>
      <SiteFooter dict={dict} locale={locale} />
    </>
  );
}
