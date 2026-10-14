import Link from "next/link";
import { ArtworkIllustration } from "@/components/ArtworkIllustration";
import { SectionHeading } from "@/components/SectionLabel";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WaitlistForm } from "@/components/WaitlistForm";
import { formatKind, formatSize } from "@/components/WorkCaption";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { TAGLINE } from "@/lib/brand";
import { works } from "@/lib/works";

/** 襖の層を、ずらして重ねた図（左上が表側の和紙と落款、右下が芯の骨）。枠はない */
function LayerDiagram({ labels }: { labels: string[] }) {
  const layer = "absolute aspect-[2/3] w-[46%]";
  return (
    <div
      role="img"
      aria-label={labels.join(", ")}
      className="relative mx-auto aspect-square w-full max-w-lg"
    >
      {/* 骨：木の格子 */}
      <div
        className={`${layer} left-[44%] top-[22%] border border-[#8b7a64] bg-[repeating-linear-gradient(0deg,transparent_0,transparent_18%,#b9a78d_18%,#b9a78d_20%),repeating-linear-gradient(90deg,transparent_0,transparent_30%,#b9a78d_30%,#b9a78d_33%)]`}
      />
      {/* 下張り：何層もの紙 */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${layer} border border-line bg-washi-deep/90`}
          style={{ left: `${36 - i * 2}%`, top: `${17 - i * 1.4}%` }}
        />
      ))}
      {/* 上張り：和紙の面と墨 */}
      <div
        className={`${layer} left-[22%] top-[9%] overflow-hidden border border-line bg-[#f7f4ed] shadow-[0_18px_40px_-24px_rgba(22,21,19,0.45)]`}
      >
        <div className="washi-texture absolute inset-0 opacity-80" />
        <div className="absolute left-[16%] right-[14%] top-[66%] h-[3.5%] rounded-full bg-sumi/85" />
        <span className="absolute bottom-[8%] right-[10%] aspect-square w-[6%] bg-[#a8432e]/85" />
      </div>
    </div>
  );
}

export default async function Home() {
  const dict = await getDictionary();
  const locale = await getLocale();
  const t = dict.home;
  const featured = works.find((w) => w.slug === "word-art") ?? works[0];

  return (
    <>
      <SiteHeader dict={dict} locale={locale} />

      <main id="main">
        {/* Hero：タグラインと、光が差す作品 */}
        <section
          aria-labelledby="hero-title"
          className="mx-auto grid max-w-7xl items-center gap-16 px-5 pt-16 pb-24 sm:px-10 lg:grid-cols-[1fr_0.8fr] lg:gap-24 lg:px-16 lg:pt-24 lg:pb-36"
        >
          <div className="animate-fade-up space-y-10">
            <p className="label">WADŌ · Fusuma Art</p>
            <h1
              id="hero-title"
              className="font-serif text-6xl leading-[0.98] font-light text-balance text-sumi sm:text-7xl lg:text-8xl"
            >
              {TAGLINE}
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-usuzumi">
              {t.hero.lead}
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href={`/${locale}/works`}
                className="bg-sumi px-8 py-4 text-xs tracking-[0.24em] text-washi uppercase transition-opacity hover:opacity-85"
              >
                {t.hero.cta}
              </Link>
              <a
                href="#waitlist"
                className="text-sm text-sumi underline decoration-nezumi underline-offset-8 hover:decoration-sumi"
              >
                {t.hero.secondary}
              </a>
            </div>
          </div>
          <figure className="mx-auto w-full max-w-sm space-y-5 lg:max-w-md">
            <div className="bg-washi-deep p-[12%]">
              <ArtworkIllustration
                kind="word"
                label={t.hero.visualAlt}
                animate
              />
            </div>
            <figcaption className="space-y-1 text-sm">
              <p className="text-sumi">{featured.title[locale]}</p>
              <p className="text-usuzumi tabular-nums">
                {formatSize(featured)}
              </p>
              <p className="label">{dict.common.illustrationShort}</p>
            </figcaption>
          </figure>
        </section>

        {/* 使命 */}
        <section aria-label={t.statement.label} className="bg-sumi text-washi">
          <div className="mx-auto max-w-5xl px-5 py-28 sm:px-10 lg:py-40">
            <p className="label !text-washi/60">{t.statement.label}</p>
            <p className="mt-8 font-serif text-3xl leading-snug font-light text-balance sm:text-4xl lg:text-5xl">
              {t.statement.text}
            </p>
          </div>
        </section>

        {/* 最初のコレクション */}
        <section
          aria-labelledby="collection-title"
          className="mx-auto max-w-7xl px-5 py-28 sm:px-10 lg:px-16 lg:py-40"
        >
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
            <SectionHeading
              id="collection-title"
              label={t.collection.label}
              title={t.collection.title}
            />
            <p className="max-w-md text-usuzumi lg:justify-self-end">
              {t.collection.lead}
            </p>
          </div>
          <ul className="mt-20 grid gap-x-10 gap-y-16 md:grid-cols-3">
            {works.map((w) => (
              <li key={w.slug}>
                <Link
                  href={`/${locale}/works/${w.slug}`}
                  className="group block space-y-6"
                >
                  <div className="flex aspect-[4/5] items-center justify-center bg-washi-deep px-[16%] transition-colors group-hover:bg-line/70">
                    <ArtworkIllustration
                      kind={w.illustration}
                      label={`${w.title[locale]} — ${dict.common.illustrationShort}`}
                      className={w.illustration === "name" ? "w-3/4" : "w-full"}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-serif text-2xl text-sumi">
                        {w.title[locale]}
                      </h3>
                      <span className="label shrink-0">
                        {dict.common.status[w.status]}
                      </span>
                    </div>
                    <p className="text-usuzumi">{w.summary[locale]}</p>
                    <p className="text-sm text-usuzumi tabular-nums">
                      {formatKind(w, dict.common)} · {w.size.w} × {w.size.h} cm
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-12 text-xs text-usuzumi">
            {dict.common.illustration}
          </p>
          <Link
            href={`/${locale}/works`}
            className="mt-6 inline-block text-sm text-sumi underline decoration-nezumi underline-offset-8 hover:decoration-sumi"
          >
            {t.collection.link}
          </Link>
        </section>

        {/* 襖の構造でつくる */}
        <section
          aria-labelledby="structure-title"
          className="border-y border-line bg-washi-deep/60"
        >
          <div className="mx-auto grid max-w-7xl gap-16 px-5 py-28 sm:px-10 lg:grid-cols-2 lg:px-16 lg:py-40">
            <div className="space-y-10">
              <SectionHeading
                id="structure-title"
                label={t.structure.label}
                title={t.structure.title}
              />
              <p className="max-w-lg text-lg leading-relaxed text-usuzumi">
                {t.structure.lead}
              </p>
              <LayerDiagram
                labels={t.structure.layers.map((l) => `${l.name} (${l.jp})`)}
              />
            </div>
            <div className="space-y-10 lg:pt-28">
              <dl className="divide-y divide-line border-y border-line">
                {t.structure.layers.map((l) => (
                  <div
                    key={l.name}
                    className="grid grid-cols-[6.5rem_1fr] gap-6 py-6"
                  >
                    <dt className="space-y-1">
                      <span className="block font-serif text-2xl text-sumi">
                        {l.jp}
                      </span>
                      <span className="label block">{l.name}</span>
                    </dt>
                    <dd className="min-w-0 leading-relaxed text-usuzumi">
                      {l.body}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="text-xs text-usuzumi">{t.structure.note}</p>
            </div>
          </div>
        </section>

        {/* 名前 */}
        <section
          aria-labelledby="name-title"
          className="mx-auto max-w-7xl px-5 py-28 sm:px-10 lg:px-16 lg:py-40"
        >
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              id="name-title"
              label={t.name.label}
              title={t.name.title}
            />
            <p className="text-usuzumi">{t.name.reading}</p>
          </div>
          <div className="mt-16 grid gap-px bg-line md:grid-cols-2">
            {t.name.letters.map((l) => (
              <div key={l.letter} className="space-y-5 bg-washi p-8 md:p-10">
                <p
                  className="font-serif text-8xl leading-none font-light text-sumi"
                  translate="no"
                >
                  {l.letter}
                </p>
                <p className="label !text-sumi">{l.word}</p>
                <p className="leading-relaxed text-usuzumi">{l.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-sm text-usuzumi">{t.name.note}</p>
        </section>

        {/* ウェイティングリスト */}
        <section
          id="waitlist"
          aria-labelledby="waitlist-title"
          className="scroll-mt-24 border-t border-line"
        >
          <div className="mx-auto grid max-w-7xl gap-16 px-5 py-28 sm:px-10 lg:grid-cols-[1fr_1.2fr] lg:px-16 lg:py-40">
            <div className="space-y-8">
              <SectionHeading
                id="waitlist-title"
                label={dict.waitlist.label}
                title={dict.waitlist.title}
              />
              <p className="max-w-md text-lg leading-relaxed text-usuzumi">
                {dict.waitlist.lead}
              </p>
            </div>
            <WaitlistForm copy={dict.waitlist} locale={locale} />
          </div>
        </section>
      </main>

      <SiteFooter dict={dict} locale={locale} />
    </>
  );
}
