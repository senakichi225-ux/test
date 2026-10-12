import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtworkIllustration } from "@/components/ArtworkIllustration";
import { PageShell } from "@/components/PageShell";
import { WorkCaption } from "@/components/WorkCaption";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getWork, works } from "@/lib/works";

export async function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/works/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [work, locale] = [getWork(slug), await getLocale()];
  if (!work) return {};
  return { title: `${work.title[locale]} — WADŌ`, description: work.summary[locale] };
}

export default async function WorkPage({ params }: PageProps<"/[locale]/works/[slug]">) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <PageShell>
      <article className="mx-auto grid max-w-7xl gap-16 px-5 pt-14 pb-32 sm:px-10 lg:grid-cols-[1.1fr_1fr] lg:gap-24 lg:px-16 lg:pt-20">
        <figure className="space-y-4">
          <div className="flex aspect-[4/5] items-center justify-center bg-washi-deep px-[14%] py-[10%]">
            <ArtworkIllustration
              kind={work.illustration}
              label={`${work.title[locale]} — ${dict.common.illustrationShort}`}
              className={work.illustration === "pair" ? "w-full" : work.illustration === "name" ? "w-3/5" : "w-[62%]"}
            />
          </div>
          <figcaption className="text-xs text-usuzumi">{dict.common.illustration}</figcaption>
        </figure>

        <div className="space-y-10 lg:pt-8">
          <Link href={`/${locale}/works`} className="label inline-block hover:!text-sumi">
            ← {dict.works.back}
          </Link>
          <header className="space-y-5">
            <h1 className="font-serif text-5xl leading-none font-light text-sumi sm:text-6xl">{work.title[locale]}</h1>
            <p className="font-serif text-2xl font-light text-usuzumi">{work.summary[locale]}</p>
          </header>
          <WorkCaption work={work} dict={dict} locale={locale} />
          <section aria-labelledby="about-work" className="space-y-4">
            <h2 id="about-work" className="label">
              {dict.work.about}
            </h2>
            <p className="max-w-prose leading-relaxed text-usuzumi">{work.description[locale]}</p>
          </section>
          <div className="space-y-5 border-t border-line pt-8">
            <p className="max-w-prose text-sm text-usuzumi">{dict.work.inquireNote}</p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href={`/${locale}/contact?work=${work.slug}`}
                className="bg-sumi px-8 py-4 text-xs tracking-[0.24em] text-washi uppercase transition-opacity hover:opacity-85"
              >
                {dict.common.inquireAbout}
              </Link>
              <Link href={`/${locale}#waitlist`} className="text-sm text-sumi underline decoration-nezumi underline-offset-8 hover:decoration-sumi">
                {dict.home.hero.secondary}
              </Link>
            </div>
          </div>
        </div>
      </article>
    </PageShell>
  );
}
