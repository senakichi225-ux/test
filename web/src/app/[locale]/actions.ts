"use server";

import { inquiryFormToInput, inquiryInputSchema, invalidInquiryFields, type InquiryField } from "@/lib/inquiry/schema";
import { getInquiryStore } from "@/lib/inquiry/store";
import { formDataToInput, invalidFields, waitlistInputSchema, type WaitlistField } from "@/lib/waitlist/schema";
import { getWaitlistStore } from "@/lib/waitlist/store";
import { getWork } from "@/lib/works";

/** ボット対策：人には見えない項目に何か入っていたら、保存せずに成功したふりをする */
function isBot(formData: FormData): boolean {
  const honeypot = formData.get("company_website");
  return typeof honeypot === "string" && honeypot.trim() !== "";
}

// ---- ウェイティングリスト ----

export type WaitlistState = {
  status: "idle" | "created" | "updated" | "invalid" | "error";
  fields?: WaitlistField[];
  /** 入力エラーのとき、入力し直さなくてよいように値を返す */
  values?: Record<string, string>;
};

/** ウェイティングリストへの登録（Server Action）。公開の処理なので、すべての入力をサーバー側で検証する */
export async function joinWaitlist(_prev: WaitlistState, formData: FormData): Promise<WaitlistState> {
  if (isBot(formData)) return { status: "created" };

  const raw = formDataToInput(formData);
  const parsed = waitlistInputSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "invalid", fields: invalidFields(parsed.error), values: raw };
  }

  try {
    const { status } = await getWaitlistStore().upsert(parsed.data);
    return { status };
  } catch (error) {
    console.error("[waitlist] failed to save", error);
    return { status: "error", values: raw };
  }
}

// ---- 問い合わせ ----

export type InquiryState = {
  status: "idle" | "sent" | "invalid" | "error";
  fields?: InquiryField[];
  values?: Record<string, string>;
};

/** 問い合わせの受付（Server Action）。公開の処理なので、すべての入力をサーバー側で検証する */
export async function sendInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  if (isBot(formData)) return { status: "sent" };

  const raw = inquiryFormToInput(formData);
  const parsed = inquiryInputSchema.safeParse(raw);
  const fields = parsed.success ? [] : invalidInquiryFields(parsed.error);
  // 存在しない作品は受け付けない
  if (parsed.success && parsed.data.work && !getWork(parsed.data.work)) fields.push("work");
  if (!parsed.success || fields.length > 0) {
    return { status: "invalid", fields, values: raw };
  }

  try {
    await getInquiryStore().add(parsed.data);
    return { status: "sent" };
  } catch (error) {
    console.error("[inquiry] failed to save", error);
    return { status: "error", values: raw };
  }
}
