import { FusumaPanel, type FusumaVariant } from "@/components/FusumaPanel";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WaitlistForm } from "@/components/WaitlistForm";
import { Wordmark } from "@/components/Wordmark";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

function SectionHeading({ eyebrow, title, id }: { eyebrow: string; title: string; id: string }) {
  return (
    <div className="space-y-4">
      <p className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-kin">
        <span aria-hidden className="kin-rule inline-block w-8" />
        {eyebrow}
      </p>
      <h2 id={id} className="font-serif text-3xl leading-tight font-light text-sumi sm:text-4xl lg:text-5xl">
        {title}
      </h2>
    </div>
  );
}

const galleryVariants: { variant: FusumaVariant; hikite: "left" | "right" | "none" }[] = [
  { variant: "plain", hikite: "right" },
  { variant: "dusk", hikite: "left" },
  { variant: "ink", hikite: "none" },
  { variant: "pattern", hikite: "right" },
];

export default async function Home() {
  const dict = await getDictionary();
  const locale = await getLocale();

  return (
    <>
      <SiteHeader dict={dict} locale={locale} />

      <main id="main">
        {/* 1. Hero：ふすまがゆっくり開き、光が差し込む */}
        <section aria-labelledby="hero-title" className="relative overflow-hidden pt-16">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:py-28">
            <div className="animate-fade-up space-y-8">
              <p className="text-xs uppercase tracking-[0.3em] text-kin">{dict.hero.eyebrow}</p>
              <h1 id="hero-title" className="font-serif text-5xl leading-[1.08] font-light text-sumi sm:text-6xl lg:text-7xl">
                {dict.hero.title}
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-usuzumi sm:text-lg">{dict.hero.lead}</p>
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <a
                  href="#waitlist"
                  className="bg-sumi px-8 py-4 text-sm tracking-[0.2em] text-washi transition-colors hover:bg-ai"
                >
                  {dict.hero.cta}
                </a>
                <a href="#about" className="text-sm text-usuzumi underline decoration-kin/60 underline-offset-8 hover:text-sumi">
                  {dict.hero.secondary}
                </a>
              </div>
            </div>

            <div role="img" aria-label={dict.hero.visualAlt} className="relative mx-auto aspect-[4/5] w-full max-w-md lg:max-w-none">
              {/* ふすまの向こうの光 */}
              <div className="animate-light absolute inset-[6%] bg-[radial-gradient(ellipse_at_40%_45%,#fff8e6_0%,#f3dfb8_45%,#d9bf93_100%)]" />
              {/* 本物の襖のように、手前のレールの右の襖が左の襖に重なるようにすべり、右側から光が差す */}
              <div className="absolute inset-[6%] overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-1/2">
                  <FusumaPanel variant="plain" hikite="right" className="h-full w-full" />
                </div>
                <div className="animate-fusuma-open absolute inset-y-0 left-1/2 z-10 w-1/2">
                  <FusumaPanel variant="plain" hikite="left" className="h-full w-full" />
                </div>
              </div>
              {/* 敷居（しきい）と鴨居（かもい） */}
              <div className="absolute inset-x-0 top-[4%] h-[2%] bg-fuchi" />
              <div className="absolute inset-x-0 bottom-[4%] h-[2%] bg-fuchi" />
            </div>
          </div>
        </section>

        {/* 2. SŌN という名前 */}
        <section aria-labelledby="name-title" className="border-y border-sumi/10 bg-washi-deep/50">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
            <SectionHeading id="name-title" eyebrow={dict.name.eyebrow} title={dict.name.title} />
            <div className="mt-16 grid gap-12 md:grid-cols-3">
              {dict.name.letters.map((l) => (
                <div key={l.letter} className="space-y-4">
                  <p className="font-serif text-7xl leading-none font-light text-sumi" translate="no">
                    {l.letter}
                  </p>
                  <div className="kin-rule w-16" />
                  <p className="font-serif text-2xl text-sumi">{l.word}</p>
                  <p className="max-w-xs leading-relaxed text-usuzumi">{l.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. 襖とは */}
        <section id="about" aria-labelledby="about-title" className="scroll-mt-16">
          <div className="mx-auto grid max-w-7xl gap-16 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:py-36">
            <div className="space-y-8">
              <SectionHeading id="about-title" eyebrow={dict.about.eyebrow} title={dict.about.title} />
              <p className="max-w-xl text-lg leading-relaxed text-usuzumi">{dict.about.body}</p>
            </div>
            <ol className="space-y-12 lg:pt-20">
              {dict.about.points.map((p, i) => (
                <li key={p.title} className="grid grid-cols-[3rem_1fr] gap-6">
                  <span className="font-serif text-3xl text-kin">{String(i + 1).padStart(2, "0")}</span>
                  <div className="space-y-2 border-t border-sumi/15 pt-4">
                    <h3 className="font-serif text-2xl text-sumi">{p.title}</h3>
                    <p className="leading-relaxed text-usuzumi">{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 4. ギャラリー */}
        <section id="gallery" aria-labelledby="gallery-title" className="scroll-mt-16 bg-sumi text-washi">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
            <div className="space-y-4">
              <p className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-kin">
                <span aria-hidden className="kin-rule inline-block w-8" />
                {dict.gallery.eyebrow}
              </p>
              <h2 id="gallery-title" className="font-serif text-3xl font-light sm:text-4xl lg:text-5xl">
                {dict.gallery.title}
              </h2>
            </div>
            <ul className="mt-16 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-4">
              {dict.gallery.items.map((item, i) => (
                <li key={item.title} className={i % 2 === 1 ? "lg:mt-16" : ""}>
                  <figure className="space-y-5">
                    <FusumaPanel
                      variant={galleryVariants[i % galleryVariants.length].variant}
                      hikite={galleryVariants[i % galleryVariants.length].hikite}
                      className="aspect-[1/2] w-full"
                    />
                    <figcaption className="space-y-1">
                      <p className="font-serif text-lg sm:text-xl">{item.title}</p>
                      <p className="text-sm leading-relaxed text-washi/65">{item.caption}</p>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
            <p className="mt-16 max-w-2xl text-xs leading-relaxed text-washi/50">{dict.gallery.note}</p>
          </div>
        </section>

        {/* 5. 職人の技 */}
        <section id="craft" aria-labelledby="craft-title" className="scroll-mt-16">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-36">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
              <SectionHeading id="craft-title" eyebrow={dict.craft.eyebrow} title={dict.craft.title} />
              <p className="text-lg leading-relaxed text-usuzumi">{dict.craft.lead}</p>
            </div>
            <ol className="mt-16 grid gap-px overflow-hidden border border-sumi/10 bg-sumi/10 sm:grid-cols-2 lg:grid-cols-4">
              {dict.craft.steps.map((s, i) => (
                <li key={s.title} className="space-y-4 bg-washi p-8">
                  <span className="font-serif text-sm tracking-[0.2em] text-kin">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-serif text-2xl text-sumi">{s.title}</h3>
                  <p className="leading-relaxed text-usuzumi">{s.body}</p>
                </li>
              ))}
            </ol>
            <p className="mt-10 max-w-2xl text-sm leading-relaxed text-usuzumi">{dict.craft.note}</p>
          </div>
        </section>

        {/* 6. デザイナー・建築家の方へ */}
        <section id="designers" aria-labelledby="designers-title" className="scroll-mt-16 border-y border-sumi/10 bg-washi-deep/50">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <SectionHeading id="designers-title" eyebrow={dict.designers.eyebrow} title={dict.designers.title} />
              <span className="border border-kin px-3 py-1 text-xs uppercase tracking-[0.2em] text-kin">{dict.designers.badge}</span>
            </div>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-usuzumi">{dict.designers.lead}</p>
            <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {dict.designers.items.map((d) => (
                <li key={d.title} className="space-y-3 border-t border-sumi/20 pt-6">
                  <h3 className="font-serif text-2xl text-sumi">{d.title}</h3>
                  <p className="leading-relaxed text-usuzumi">{d.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 7. ウェイティングリスト */}
        <section id="waitlist" aria-labelledby="waitlist-title" className="scroll-mt-16">
          <div className="mx-auto grid max-w-7xl gap-16 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_1.2fr] lg:py-36">
            <div className="space-y-8">
              <SectionHeading id="waitlist-title" eyebrow={dict.waitlist.eyebrow} title={dict.waitlist.title} />
              <p className="max-w-md text-lg leading-relaxed text-usuzumi">{dict.waitlist.lead}</p>
              <Wordmark className="block pt-6 text-5xl text-sumi/15" />
            </div>
            <WaitlistForm copy={dict.waitlist} locale={locale} />
          </div>
        </section>
      </main>

      <SiteFooter dict={dict} locale={locale} />
    </>
  );
}
