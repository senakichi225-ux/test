import data from "../../../content/works.json";
import { worksFileSchema, type Work } from "./schema";

/** content/works.json を読み込み、形を検証する（形が違えばビルドで止まる） */
export const works: Work[] = worksFileSchema.parse(data).works;

export function getWork(slug: string): Work | undefined {
  return works.find((w) => w.slug === slug);
}
