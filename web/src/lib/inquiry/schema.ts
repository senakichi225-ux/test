import { z } from "zod";
import { locales } from "@/i18n/config";

export const inquiryTypes = ["purchase", "commission", "gallery", "press", "other"] as const;
export type InquiryType = (typeof inquiryTypes)[number];

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? undefined : v))
    .optional();

/** 問い合わせフォームの検証。項目は必要最小限（CLAUDE.md §7） */
export const inquiryInputSchema = z.object({
  type: z.enum(inquiryTypes),
  name: optionalText(100),
  email: z.string().trim().toLowerCase().pipe(z.email()),
  country: optionalText(80),
  /** 作品の slug（作品ページから来たとき）。空なら未指定 */
  work: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]*$/)
    .max(60)
    .transform((v) => (v === "" ? undefined : v))
    .optional(),
  message: z.string().trim().min(1).max(2000),
  consent: z.literal("yes"),
  locale: z.enum(locales),
});

export type InquiryInput = z.output<typeof inquiryInputSchema>;
export type InquiryField = "type" | "name" | "email" | "country" | "work" | "message" | "consent";

export type InquiryEntry = InquiryInput & { id: string; createdAt: string; consentAt: string };

export function inquiryFormToInput(formData: FormData): Record<string, string> {
  const pick = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" ? v : "";
  };
  return {
    type: pick("type"),
    name: pick("name"),
    email: pick("email"),
    country: pick("country"),
    work: pick("work"),
    message: pick("message"),
    consent: pick("consent"),
    locale: pick("locale"),
  };
}

const FIELDS: readonly InquiryField[] = ["type", "name", "email", "country", "work", "message", "consent"];
export function invalidInquiryFields(error: z.ZodError): InquiryField[] {
  const out = new Set<InquiryField>();
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && (FIELDS as readonly string[]).includes(key)) out.add(key as InquiryField);
  }
  return [...out];
}
