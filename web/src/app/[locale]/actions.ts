"use server";

import { formDataToInput, invalidFields, waitlistInputSchema, type WaitlistField } from "@/lib/waitlist/schema";
import { getWaitlistStore } from "@/lib/waitlist/store";

export type WaitlistState = {
  status: "idle" | "created" | "updated" | "invalid" | "error";
  fields?: WaitlistField[];
  /** 入力エラーのとき、入力し直さなくてよいように値を返す */
  values?: Record<string, string>;
};

/**
 * ウェイティングリストへの登録（Server Action）。
 * 誰でも呼べる公開の処理なので、すべての入力をサーバー側で検証する。
 */
export async function joinWaitlist(_prev: WaitlistState, formData: FormData): Promise<WaitlistState> {
  // ボット対策：人には見えない項目に何か入っていたら、保存せずに成功したふりをする
  const honeypot = formData.get("company_website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { status: "created" };
  }

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
