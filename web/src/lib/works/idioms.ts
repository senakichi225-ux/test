import { z } from "zod";
import data from "../../../content/idioms.json";

const localized = z.object({ en: z.string().min(1), ja: z.string().min(1) });

/** 四字熟語ペアで選べる四字熟語（content/idioms.json） */
export const idiomSchema = z.object({
  /** 4文字ちょうど（2文字ずつ2枚に書く） */
  text: z.string().regex(/^\p{Script=Han}{4}$/u),
  reading: z.string().min(1),
  romaji: z.string().min(1),
  meaning: localized,
  /** 意味と英語の説明を辞書で確認したら true */
  checked: z.boolean(),
});

export const idiomsFileSchema = z.object({
  note: z.string(),
  groups: z.array(z.object({ id: z.string().regex(/^[a-z-]+$/), label: localized, idioms: z.array(idiomSchema).min(1) })),
});

export type Idiom = z.output<typeof idiomSchema>;
export const idiomGroups = idiomsFileSchema.parse(data).groups;

/** 「一期一会」→ ["一期", "一会"]（1枚目・2枚目） */
export function splitPair(text: string): [string, string] {
  const chars = Array.from(text);
  return [chars.slice(0, 2).join(""), chars.slice(2).join("")];
}
