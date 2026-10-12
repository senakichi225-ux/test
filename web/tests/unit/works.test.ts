import { describe, expect, it } from "vitest";
import { works } from "@/lib/works";
import { cmToIn, workSchema } from "@/lib/works/schema";
import { idiomGroups, splitPair } from "@/lib/works/idioms";

const base = {
  slug: "x",
  series: "X",
  workNo: null,
  title: { en: "X", ja: "X" },
  kind: "unique",
  editionSize: null,
  panels: 1,
  year: null,
  status: "concept",
  medium: { en: "m", ja: "m" },
  size: { w: 60, h: 90, d: 2 },
  summary: { en: "s", ja: "s" },
  description: { en: "d", ja: "d" },
  illustration: "word",
  images: [],
  priceJpy: null,
};

describe("content/works.json", () => {
  it("読み込めて、slug が重複しない", () => {
    expect(works.length).toBeGreaterThan(0);
    expect(new Set(works.map((w) => w.slug)).size).toBe(works.length);
  });

  it("いまの作品はすべて構想中で、価格を出していない（実績・価格を作らない）", () => {
    for (const w of works) {
      if (w.status === "concept" || w.status === "prototype")
        expect(w.priceJpy).toBeNull();
    }
  });
});

describe("workSchema のルール", () => {
  it("構想・試作中の作品に価格を付けられない", () => {
    expect(workSchema.safeParse({ ...base, priceJpy: 100000 }).success).toBe(
      false,
    );
    expect(
      workSchema.safeParse({
        ...base,
        status: "prototype",
        workNo: "WADO-2026-WORD-U001",
        priceJpy: 100000,
      }).success,
    ).toBe(false);
  });

  it("試作以降は作品番号が必要", () => {
    expect(
      workSchema.safeParse({ ...base, status: "available", priceJpy: 200000 })
        .success,
    ).toBe(false);
    expect(
      workSchema.safeParse({
        ...base,
        status: "available",
        workNo: "WADO-2026-WORD-U001",
        priceJpy: 200000,
      }).success,
    ).toBe(true);
  });

  it("限定作品だけが総数を持つ", () => {
    expect(
      workSchema.safeParse({ ...base, kind: "edition", editionSize: null })
        .success,
    ).toBe(false);
    expect(
      workSchema.safeParse({ ...base, kind: "edition", editionSize: 30 })
        .success,
    ).toBe(true);
    expect(
      workSchema.safeParse({ ...base, kind: "unique", editionSize: 30 })
        .success,
    ).toBe(false);
  });

  it("作品番号の形を守る", () => {
    expect(
      workSchema.safeParse({ ...base, workNo: "WADO-2026-NAME-U003" }).success,
    ).toBe(true);
    expect(workSchema.safeParse({ ...base, workNo: "ICHI-1" }).success).toBe(
      false,
    );
  });
});

describe("cmToIn", () => {
  it("cm を inch（小数1桁）にする", () => {
    expect(cmToIn(60)).toBe(23.6);
    expect(cmToIn(90)).toBe(35.4);
    expect(cmToIn(2)).toBe(0.8);
  });
});

describe("content/idioms.json（四字熟語ペアの一覧）", () => {
  const all = idiomGroups.flatMap((g) => g.idioms.map((i) => i.text));

  it("12個あり、重複しない", () => {
    expect(all).toHaveLength(12);
    expect(new Set(all).size).toBe(all.length);
  });

  it("悪い意味に取られやすい四字熟語は一覧に入れない（言葉アートでのみ注文可）", () => {
    expect(all).not.toContain("因果応報");
    expect(all).not.toContain("唯我独尊");
  });

  it("2文字ずつに分けられる", () => {
    expect(splitPair("一期一会")).toEqual(["一期", "一会"]);
  });
});
