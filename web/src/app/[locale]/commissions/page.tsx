import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, PageShell } from "@/components/PageShell";
import { SectionHeading } from "@/components/SectionLabel";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: `${dict.commissions.title} — WADŌ`, description: dict.commissions.lead };
}

export default async function CommissionsPage() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const t = dict.commissions;
  return (
    <PageShell>
      <PageIntro label={t.why.label} title={t.title} lead={t.lead}>
        <p className="border-l-2 border-sumi pl-4 text-sm leading-relaxed text-sumi">{t.status}</p>
      </PageIntro>

      <section aria-label={t.why.label} className="mx-auto max-w-7xl px-5 pb-28 sm:px-10 lg:px-16">
        <ul className="grid gap-px bg-line md:grid-cols-3">
          {t.why.points.map((p) => (
            <li key={p.title} className="space-y-4 bg-washi p-8 md:p-10">
              <h2 className="font-serif text-2xl text-sumi">{p.title}</h2>
              <p className="leading-relaxed text-usuzumi">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="process-title" className="border-y border-line bg-washi-deep/60">
        <div className="mx-auto grid max-w-7xl gap-16 px-5 py-28 sm:px-10 lg:grid-cols-[1fr_1.3fr] lg:px-16 lg:py-36">
          <div className="space-y-6">
            <SectionHeading id="process-title" label={t.process.label} title={t.process.title} />
            <p className="text-usuzumi">{t.process.lead}</p>
          </div>
          <ol className="divide-y divide-line border-y border-line">
            {t.process.steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[3rem_1fr] gap-6 py-5">
                <span className="font-serif text-2xl text-nezumi tabular-nums">{i + 1}</span>
                <div className="min-w-0">
                  <h3 className="font-serif text-xl text-sumi">{s.title}</h3>
                  <p className="text-usuzumi">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="resp-title" className="mx-auto max-w-7xl px-5 py-28 sm:px-10 lg:px-16 lg:py-36">
        <h2 id="resp-title" className="font-serif text-3xl font-light text-sumi sm:text-4xl">
          {t.responsibility.title}
        </h2>
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-sumi">
                {t.responsibility.columns.map((c) => (
                  <th key={c} scope="col" className="label py-3 pr-6 font-normal">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.responsibility.rows.map((r) => (
                <tr key={r[0]} className="border-b border-line">
                  <th scope="row" className="py-4 pr-6 font-normal text-sumi">
                    {r[0]}
                  </th>
                  <td className="py-4 pr-6 text-usuzumi">{r[1]}</td>
                  <td className="py-4 text-usuzumi">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-xs text-usuzumi">{t.process.lead}</p>
        <Link
          href={`/${locale}/contact?type=commission`}
          className="mt-14 inline-block bg-sumi px-8 py-4 text-xs tracking-[0.24em] text-washi uppercase transition-opacity hover:opacity-85"
        >
          {t.cta}
        </Link>
      </section>
    </PageShell>
  );
}
