import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { idiomGroups } from "@/lib/works/idioms";

/** 四字熟語アートで選べる四字熟語の一覧 */
export function IdiomList({
  copy,
  locale,
}: {
  copy: Dictionary["work"]["idioms"];
  locale: Locale;
}) {
  return (
    <section aria-labelledby="idioms-title" className="space-y-8">
      <div className="space-y-3">
        <h2 id="idioms-title" className="label">
          {copy.title}
        </h2>
        <p className="max-w-prose leading-relaxed text-usuzumi">{copy.lead}</p>
      </div>
      {idiomGroups.map((g) => (
        <div key={g.id} className="space-y-1">
          <h3 className="label !text-sumi">{g.label[locale]}</h3>
          <ul className="divide-y divide-line border-y border-line">
            {g.idioms.map((it) => (
              <li
                key={it.text}
                className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-1 py-4"
              >
                <p lang="ja" className="font-serif text-2xl text-sumi">
                  {it.text}
                </p>
                <p className="text-sm text-usuzumi">
                  {locale === "ja" ? it.reading : it.romaji}
                </p>
                <p className="col-span-2 min-w-0 text-sm leading-relaxed text-usuzumi">
                  {it.meaning[locale]}
                </p>
                <p className="col-span-2 min-w-0 text-sm leading-relaxed text-sumi">
                  {copy.wishLabel}
                  {it.wish[locale]}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <p className="text-xs text-usuzumi">{copy.note}</p>
    </section>
  );
}
