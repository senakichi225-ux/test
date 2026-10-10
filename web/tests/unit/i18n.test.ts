import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import ja from "../../messages/ja.json";
import { pickLocale } from "@/i18n/config";

/** オブジェクトの「形」（キーと配列の長さ）を文字列の一覧にする */
function shape(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) {
    return [`${prefix}[${value.length}]`, ...value.flatMap((v, i) => shape(v, `${prefix}[${i}]`))];
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => shape(v, prefix ? `${prefix}.${k}` : k));
  }
  return [prefix];
}

describe("messages", () => {
  it("日本語と英語の辞書は、同じ項目をそろえて持っている", () => {
    expect(shape(ja).sort()).toEqual(shape(en).sort());
  });

  it("空の文言がない", () => {
    const empty = (v: unknown): boolean =>
      typeof v === "string" ? v.trim() === "" : Array.isArray(v) ? v.some(empty) : v && typeof v === "object" ? Object.values(v).some(empty) : false;
    expect(empty(en)).toBe(false);
    expect(empty(ja)).toBe(false);
  });
});

describe("pickLocale", () => {
  it("ブラウザの言語設定から、対応言語を選ぶ", () => {
    expect(pickLocale("ja-JP,ja;q=0.9,en;q=0.8")).toBe("ja");
    expect(pickLocale("en-US,en;q=0.9")).toBe("en");
    expect(pickLocale("fr-FR,fr;q=0.9,ja;q=0.5")).toBe("ja");
    expect(pickLocale("fr-FR,de;q=0.9")).toBe("en");
    expect(pickLocale(null)).toBe("en");
    expect(pickLocale("ja;q=0")).toBe("en");
  });
});
