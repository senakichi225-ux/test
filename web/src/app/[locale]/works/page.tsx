import type { Metadata } from "next";
import Link from "next/link";
import { ArtworkIllustration } from "@/components/ArtworkIllustration";
import { PageIntro, PageShell } from "@/components/PageShell";
import { formatKind, formatSize } from "@/components/WorkCaption";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { works } from "@/lib/works";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: `${dict.works.title} — SŌN`, description: dict.works.lead };
}

export default async function WorksPage() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return (
    <PageShell>
      <PageIntro label="SŌN" title={dict.works.title} lead={dict.works.lead} />
      <section aria-label={dict.works.title} className="mx-auto max-w-7xl px-5 pb-32 sm:px-10 lg:px-16">
        <ul className="divide-y divide-line border-y border-line">
          {works.map((w) => (
            <li key={w.slug}>
              <Link href={`/${locale}/works/${w.slug}`} className="group grid items-center gap-8 py-12 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-16">
                <div className="flex aspect-[4/3] items-center justify-center bg-washi-deep px-[18%] py-[8%] transition-colors group-hover:bg-line/70">
                  <ArtworkIllustration
                    kind={w.illustration}
                    label={`${w.title[locale]} — ${dict.common.illustrationShort}`}
                    className={w.illustration === "tsui" ? "w-full" : w.illustration === "ma" ? "w-1/2" : "w-[42%]"}
                  />
                </div>
                <div className="min-w-0 space-y-4">
                  <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                    <h2 className="font-serif text-3xl font-light text-sumi sm:text-4xl">{w.title[locale]}</h2>
                    <span className="label">{dict.common.status[w.status]}</span>
                  </div>
                  <p className="text-lg text-usuzumi">{w.summary[locale]}</p>
                  <p className="text-sm text-usuzumi tabular-nums">
                    {formatKind(w, dict.common)} · {formatSize(w)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-xs text-usuzumi">{dict.common.illustration}</p>
      </section>
    </PageShell>
  );
}
