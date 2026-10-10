import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, PageShell } from "@/components/PageShell";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: `${dict.privacy.title} — SŌN` };
}

export default async function PrivacyPage() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return (
    <PageShell>
      <PageIntro label="SŌN" title={dict.privacy.title}>
        <p className="border-l-2 border-shu pl-4 text-sm text-shu">{dict.privacy.draft}</p>
        <p className="text-sm text-usuzumi">{dict.privacy.updated}</p>
      </PageIntro>
      <div className="mx-auto max-w-7xl px-5 pb-32 sm:px-10 lg:px-16">
        <div className="max-w-3xl space-y-12">
          {dict.privacy.sections.map((s) => (
            <section key={s.title} className="space-y-3">
              <h2 className="font-serif text-2xl text-sumi">{s.title}</h2>
              <p className="leading-relaxed text-usuzumi">{s.body}</p>
            </section>
          ))}
        </div>
        <Link href={`/${locale}`} className="mt-16 inline-block text-sm text-sumi underline underline-offset-4">
          ← {dict.privacy.back}
        </Link>
      </div>
    </PageShell>
  );
}
