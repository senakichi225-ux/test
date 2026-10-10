/** 対応言語。英語が既定（CLAUDE.md §3・§4） */
export const locales = ["en", "ja"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** 言語切り替えに表示する名前（それぞれの言語で書く） */
export const localeLabels: Record<Locale, string> = {
  en: "English",
  ja: "日本語",
};

/**
 * Accept-Language ヘッダーから、対応言語のうち最も優先度の高いものを選ぶ。
 * 例："ja-JP,ja;q=0.9,en;q=0.8" → "ja"
 */
export function pickLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return defaultLocale;
  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      const quality = q ? Number(q.trim().slice(2)) : 1;
      return { lang: tag.trim().toLowerCase().split("-")[0], quality: Number.isNaN(quality) ? 0 : quality };
    })
    .filter((x) => x.lang && x.quality > 0)
    .sort((a, b) => b.quality - a.quality);
  for (const { lang } of ranked) {
    if (isLocale(lang)) return lang;
  }
  return defaultLocale;
}
