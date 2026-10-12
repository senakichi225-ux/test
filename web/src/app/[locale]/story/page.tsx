import type { Metadata } from "next";
import { ArtworkIllustration } from "@/components/ArtworkIllustration";
import { PageIntro, PageShell } from "@/components/PageShell";
import { SectionHeading } from "@/components/SectionLabel";
import { getDictionary } from "@/i18n/dictionaries";
import { TAGLINE } from "@/lib/brand";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: `${dict.story.title} — WADŌ`, description: dict.story.lead };
}

export default async function StoryPage() {
  const dict = await getDictionary();
  const t = dict.story;
  return (
    <PageShell>
      <PageIntro label={TAGLINE} title={t.title} lead={t.lead} />

      <section aria-label={`${t.mission.label} / ${t.concept.label}`} className="bg-sumi text-washi">
        <div className="mx-auto grid max-w-7xl gap-16 px-5 py-28 sm:px-10 md:grid-cols-2 lg:px-16 lg:py-36">
          {[t.mission, t.concept].map((b) => (
            <div key={b.label} className="space-y-6">
              <p className="label !text-washi/60">{b.label}</p>
              <p className="font-serif text-3xl leading-snug font-light text-balance sm:text-4xl">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="beyond-title" className="mx-auto max-w-7xl px-5 py-28 sm:px-10 lg:px-16 lg:py-36">
        <SectionHeading id="beyond-title" label={t.beyond.label} title={t.beyond.title} />
        <ul className="mt-16 grid gap-px bg-line md:grid-cols-3">
          {t.beyond.points.map((p) => (
            <li key={p.title} className="space-y-4 bg-washi p-8 md:p-10">
              <h3 className="font-serif text-2xl text-sumi">{p.title}</h3>
              <p className="leading-relaxed text-usuzumi">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="name-title" className="border-y border-line bg-washi-deep/60">
        <div className="mx-auto max-w-7xl px-5 py-28 sm:px-10 lg:px-16 lg:py-36">
          <SectionHeading id="name-title" label={dict.home.name.label} title={dict.home.name.title} />
          <p className="mt-6 text-usuzumi">{dict.home.name.reading}</p>
          <dl className="mt-14 grid gap-10 md:grid-cols-3">
            {dict.home.name.letters.map((l) => (
              <div key={l.letter} className="space-y-3">
                <dt className="flex items-baseline gap-4">
                  <span className="font-serif text-6xl font-light text-sumi" translate="no">
                    {l.letter}
                  </span>
                  <span className="label !text-sumi">{l.word}</span>
                </dt>
                <dd className="leading-relaxed text-usuzumi">{l.body}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 max-w-2xl text-sm text-usuzumi">{dict.home.name.note}</p>
        </div>
      </section>

      <section aria-labelledby="process-title" className="mx-auto grid max-w-7xl gap-16 px-5 py-28 sm:px-10 lg:grid-cols-[1fr_1.2fr] lg:px-16 lg:py-36">
        <div className="space-y-8">
          <SectionHeading id="process-title" label={t.process.label} title={t.process.title} />
          <p className="max-w-md text-usuzumi">{t.process.lead}</p>
          <div className="max-w-[12rem] bg-washi-deep p-6">
            <ArtworkIllustration kind="ma" label={dict.common.illustrationShort} />
          </div>
        </div>
        {/* 工程は順番に意味があるので番号つきの一覧 */}
        <ol className="divide-y divide-line border-y border-line">
          {t.process.steps.map((s, i) => (
            <li key={s.title} className="grid grid-cols-[3rem_1fr] gap-6 py-6">
              <span className="font-serif text-2xl text-nezumi tabular-nums">{i + 1}</span>
              <div className="min-w-0 space-y-1">
                <h3 className="font-serif text-2xl text-sumi">{s.title}</h3>
                <p className="leading-relaxed text-usuzumi">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-label={t.people.label} className="border-t border-line">
        <div className="mx-auto max-w-4xl px-5 py-28 sm:px-10 lg:py-36">
          <p className="label">{t.people.label}</p>
          <p className="mt-6 font-serif text-2xl leading-relaxed font-light text-sumi sm:text-3xl">{t.people.text}</p>
        </div>
      </section>
    </PageShell>
  );
}
