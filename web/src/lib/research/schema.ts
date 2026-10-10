import { z } from "zod";

export const researchAreas = ["trends", "specs", "logistics", "competitors", "suppliers", "stories"] as const;
export const researchStatuses = ["hypothesis", "investigating", "verified", "rejected"] as const;

export type ResearchArea = (typeof researchAreas)[number];
export type ResearchStatus = (typeof researchStatuses)[number];

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD");

export const evidenceSchema = z.object({
  url: z.url(),
  source: z.string().min(1),
  checked_at: isoDate,
  /** 一次情報（公式・規格書・運送会社の公式条件など）かどうか */
  primary: z.boolean(),
  note: z.string().optional(),
});

/** research/*.json の1項目（docs/research_plan.md §7） */
export const researchItemSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    area: z.enum(researchAreas),
    title: z.string().min(1),
    status: z.enum(researchStatuses),
    summary: z.string().min(1),
    data: z.record(z.string(), z.unknown()).optional(),
    evidence: z.array(evidenceSchema),
    owner: z.string().min(1),
    next_action: z.string().optional(),
    updated_at: isoDate,
  })
  .refine((item) => item.status !== "verified" || item.evidence.some((e) => e.primary), {
    message: "verified にするには、一次情報の根拠（primary: true）が1つ以上必要です",
    path: ["status"],
  });

export const researchFileSchema = z.object({
  area: z.enum(researchAreas),
  items: z.array(researchItemSchema),
});

export type ResearchItem = z.output<typeof researchItemSchema>;
export type ResearchFile = z.output<typeof researchFileSchema>;
