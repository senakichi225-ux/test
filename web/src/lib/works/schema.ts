import { z } from "zod";

/** 作品の状態（docs/website_plan.md §1） */
export const workStatuses = ["concept", "prototype", "available", "reserved", "sold"] as const;
export type WorkStatus = (typeof workStatuses)[number];

/** 写真がないときに描くイラストの種類 */
export const illustrations = ["name", "word", "pair"] as const;
export type Illustration = (typeof illustrations)[number];

const localized = z.object({ en: z.string().min(1), ja: z.string().min(1) });

export const workSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    series: z.string().min(1),
    /** 作品台帳と同じ番号（WADO-2026-NAME-U001 など）。構想段階は null */
    workNo: z.string().regex(/^WADO-\d{4}-[A-Z0-9]+-[UE]\d{3}$/).nullable(),
    title: localized,
    kind: z.enum(["unique", "edition"]),
    /** 限定作品の総数（kind が edition のとき） */
    editionSize: z.number().int().positive().nullable(),
    /** 一点物の組数（2枚組なら 2） */
    panels: z.number().int().positive(),
    year: z.number().int().min(2026).nullable(),
    status: z.enum(workStatuses),
    medium: localized,
    /** 1枚あたりの寸法（cm）。構想段階は予定寸法 */
    size: z.object({ w: z.number().positive(), h: z.number().positive(), d: z.number().positive() }),
    summary: localized,
    description: localized,
    illustration: z.enum(illustrations),
    /** 写真（public/ 以下のパス）。権利の許可が取れたものだけ */
    images: z.array(z.object({ src: z.string().startsWith("/"), alt: localized })),
    /** 円。null のときは「Price on request」。構想・試作中は必ず null（価格は仮説のため） */
    priceJpy: z.number().int().positive().nullable(),
    /** true なら、作品ページに四字熟語の一覧（content/idioms.json）を出す */
    idiomList: z.boolean().default(false),
  })
  .refine((w) => (w.kind === "edition") === (w.editionSize !== null), {
    message: "限定作品（edition）だけが editionSize を持つ",
    path: ["editionSize"],
  })
  .refine((w) => !["concept", "prototype"].includes(w.status) || w.priceJpy === null, {
    message: "構想・試作中の作品に価格を付けない",
    path: ["priceJpy"],
  })
  .refine((w) => w.status === "concept" || w.workNo !== null, {
    message: "試作以降の作品には作品番号が必要",
    path: ["workNo"],
  });

export const worksFileSchema = z.object({ works: z.array(workSchema) });
export type Work = z.output<typeof workSchema>;

/** cm → inch（小数1桁） */
export function cmToIn(cm: number): number {
  return Math.round((cm / 2.54) * 10) / 10;
}
