import type { Metadata } from "next";
import { Suspense } from "react";
import { InquiryForm } from "@/components/InquiryForm";
import { PageIntro, PageShell } from "@/components/PageShell";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { works } from "@/lib/works";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: `${dict.contact.title} — WADŌ`, description: dict.contact.lead };
}

export default async function ContactPage() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const options = works.map((w) => ({ slug: w.slug, title: w.title[locale] }));
  return (
    <PageShell>
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1fr_1.2fr]">
        <PageIntro label="WADŌ" title={dict.contact.title} lead={dict.contact.lead} />
        <section aria-label={dict.contact.title} className="px-5 pb-32 sm:px-10 lg:px-16 lg:pt-28">
          {/* URL の ?work= / ?type= を読むフォームなので、Suspense で囲む（Cache Components） */}
          <Suspense fallback={<div className="h-[36rem]" aria-hidden />}>
            <InquiryForm copy={dict.contact} locale={locale} works={options} />
          </Suspense>
        </section>
      </div>
    </PageShell>
  );
}
