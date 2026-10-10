import { z } from "zod";
import { locales } from "@/i18n/config";

export const roles = ["designer", "architect", "homeowner", "hotel", "other"] as const;
export const interests = ["ichi", "tsui", "ma", "door", "unsure"] as const;

export type Role = (typeof roles)[number];
export type Interest = (typeof interests)[number];

/** 空文字は「未入力」として扱う */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? undefined : v))
    .optional();

/** フォームから受け取る値の検証。項目は必要最小限（CLAUDE.md §7） */
export const waitlistInputSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  role: z.enum(roles),
  country: optionalText(80),
  interest: z
    .union([z.enum(interests), z.literal("")])
    .transform((v) => (v === "" ? undefined : v))
    .optional(),
  message: optionalText(1000),
  consent: z.literal("yes"),
  locale: z.enum(locales),
});

export type WaitlistInput = z.output<typeof waitlistInputSchema>;
export type WaitlistField = "email" | "role" | "country" | "interest" | "message" | "consent";

/** 保存する1件分 */
export type WaitlistEntry = {
  id: string;
  email: string;
  role: Role;
  country?: string;
  interest?: Interest;
  message?: string;
  locale: WaitlistInput["locale"];
  consentAt: string;
  createdAt: string;
  updatedAt: string;
  source: "lp";
};

/** FormData → 検証用のプレーンなオブジェクト */
export function formDataToInput(formData: FormData): Record<string, string> {
  const pick = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" ? v : "";
  };
  return {
    email: pick("email"),
    role: pick("role"),
    country: pick("country"),
    interest: pick("interest"),
    message: pick("message"),
    consent: pick("consent"),
    locale: pick("locale"),
  };
}

/** 検証エラーを「どの項目がだめか」の一覧にする */
export function invalidFields(error: z.ZodError): WaitlistField[] {
  const fields = new Set<WaitlistField>();
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (key === "email" || key === "role" || key === "country" || key === "interest" || key === "message" || key === "consent") {
      fields.add(key);
    }
  }
  return [...fields];
}
