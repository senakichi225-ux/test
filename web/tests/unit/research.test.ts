import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadResearch } from "@/lib/research/load";
import { researchAreas, researchItemSchema } from "@/lib/research/schema";

const dir = path.resolve(__dirname, "../../../research");

describe("research/*.json", () => {
  it("すべてのファイルがスキーマどおりで、読み込みエラーがない", async () => {
    const data = await loadResearch(dir);
    expect(data.errors).toEqual([]);
    for (const area of researchAreas) {
      expect(data.byArea[area].length, area).toBeGreaterThan(0);
      for (const item of data.byArea[area]) expect(item.area).toBe(area);
    }
  });

  it("id はすべての観点を通して重複しない", async () => {
    const data = await loadResearch(dir);
    const ids = researchAreas.flatMap((a) => data.byArea[a].map((i) => i.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("一次情報の根拠がないものは verified にできない", () => {
    const base = {
      id: "x",
      area: "specs",
      title: "t",
      summary: "s",
      owner: "o",
      updated_at: "2026-10-10",
      status: "verified",
    };
    const secondary = { url: "https://example.com", source: "s", checked_at: "2026-10-10", primary: false };
    expect(researchItemSchema.safeParse({ ...base, evidence: [secondary] }).success).toBe(false);
    expect(researchItemSchema.safeParse({ ...base, evidence: [{ ...secondary, primary: true }] }).success).toBe(true);
  });
});
