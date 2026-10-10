import { readFile } from "node:fs/promises";
import path from "node:path";
import { researchAreas, researchFileSchema, type ResearchArea, type ResearchItem } from "./schema";

export type ResearchData = {
  byArea: Record<ResearchArea, ResearchItem[]>;
  /** 読めなかった・形が正しくなかったファイル */
  errors: { file: string; message: string }[];
};

/** リポジトリ直下の research/ フォルダ（web/ の1つ上） */
export function defaultResearchDir(): string {
  return process.env.RESEARCH_DIR || path.join(process.cwd(), "..", "research");
}

/** research/{area}.json をすべて読み、スキーマで検証する */
export async function loadResearch(dir: string = defaultResearchDir()): Promise<ResearchData> {
  const byArea = Object.fromEntries(researchAreas.map((a) => [a, [] as ResearchItem[]])) as Record<ResearchArea, ResearchItem[]>;
  const errors: ResearchData["errors"] = [];

  await Promise.all(
    researchAreas.map(async (area) => {
      const file = `${area}.json`;
      let json: unknown;
      try {
        json = JSON.parse(await readFile(path.join(dir, file), "utf8"));
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
        errors.push({ file, message: (error as Error).message });
        return;
      }
      const parsed = researchFileSchema.safeParse(json);
      if (!parsed.success) {
        errors.push({ file, message: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(" / ") });
        return;
      }
      if (parsed.data.area !== area) {
        errors.push({ file, message: `area が "${parsed.data.area}" になっています（"${area}" のはず）` });
        return;
      }
      byArea[area] = parsed.data.items;
    }),
  );

  return { byArea, errors };
}
