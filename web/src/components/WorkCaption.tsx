import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { cmToIn, type Work } from "@/lib/works/schema";

/** 寸法を「60 × 90 × 2 cm / 23.6 × 35.4 × 0.8 in」の形にする */
export function formatSize(work: Work): string {
  const { w, h, d } = work.size;
  return `${w} × ${h} × ${d} cm / ${cmToIn(w)} × ${cmToIn(h)} × ${cmToIn(d)} in`;
}

/** 種類：一点物／限定 n 点／2枚組 */
export function formatKind(work: Work, t: Dictionary["common"]): string {
  const base = work.kind === "edition" ? t.edition.replace("{n}", String(work.editionSize)) : t.unique;
  return work.panels > 1 ? `${base} · ${t.diptych}` : base;
}

/** 価格の表示。構想・試作中は「まだ販売していません」、価格なしは「Price on request」 */
export function formatPrice(work: Work, t: Dictionary["common"], locale: Locale): string {
  if (work.status === "concept" || work.status === "prototype") return t.notForSale;
  if (work.priceJpy === null) return t.priceOnRequest;
  return new Intl.NumberFormat(locale === "ja" ? "ja-JP" : "en-US", { style: "currency", currency: "JPY" }).format(work.priceJpy);
}

/** 美術館の壁のラベルのような作品キャプション（docs/website_plan.md §3） */
export function WorkCaption({ work, dict, locale }: { work: Work; dict: Dictionary; locale: Locale }) {
  const c = dict.common;
  const t = dict.work;
  const rows: [string, string][] = [
    [t.year, work.year ? String(work.year) : t.yearPlanned],
    [t.medium, work.medium[locale]],
    [t.size, `${formatSize(work)}${work.panels > 1 ? ` (${c.perPanel})` : ""}${work.status === "concept" ? ` — ${c.plannedSize}` : ""}`],
    [t.type, `${formatKind(work, c)} · ${c.certificate}`],
    [t.workNo, work.workNo ?? t.workNoPending],
    [t.status, c.status[work.status]],
    [t.price, formatPrice(work, c, locale)],
  ];
  return (
    <dl className="divide-y divide-line border-y border-line text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-4 py-3 sm:grid-cols-[9rem_1fr]">
          <dt className="label pt-0.5">{k}</dt>
          <dd className="min-w-0 text-sumi tabular-nums">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
