import type { Metadata } from "next";
import { PageIntro, PageShell } from "@/components/PageShell";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: `${dict.shipping.title} — WADŌ` };
}

export default async function ShippingCarePage() {
  const dict = await getDictionary();
  const t = dict.shipping;
  return (
    <PageShell>
      <PageIntro label="WADŌ" title={t.title}>
        <p className="border-l-2 border-shu pl-4 text-sm text-shu">{t.draft}</p>
      </PageIntro>
      <div className="mx-auto max-w-7xl px-5 pb-32 sm:px-10 lg:px-16">
        <dl className="max-w-4xl divide-y divide-line border-y border-line">
          {t.sections.map((s) => (
            <div key={s.title} className="grid gap-3 py-8 md:grid-cols-[14rem_1fr] md:gap-10">
              <dt className="font-serif text-2xl text-sumi">{s.title}</dt>
              <dd className="min-w-0 leading-relaxed text-usuzumi">{s.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </PageShell>
  );
}
