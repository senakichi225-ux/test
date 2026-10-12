import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { inquiryInputSchema, invalidInquiryFields } from "@/lib/inquiry/schema";
import { createLocalInquiryStore } from "@/lib/inquiry/store";

const valid = {
  type: "commission",
  name: "",
  email: "Architect@Example.com",
  country: "",
  work: "",
  message: "A pair of doors for a hotel lobby.",
  consent: "yes",
  locale: "en",
};

describe("inquiryInputSchema", () => {
  it("正しい入力を受け付け、空の任意項目は未入力にする", () => {
    const r = inquiryInputSchema.safeParse(valid);
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.email).toBe("architect@example.com");
    expect(r.data.name).toBeUndefined();
    expect(r.data.work).toBeUndefined();
  });

  it("種類・メール・メッセージ・同意がだめなら、その項目を返す", () => {
    const r = inquiryInputSchema.safeParse({ ...valid, type: "spam", email: "x", message: " ", consent: "" });
    expect(r.success).toBe(false);
    if (r.success) return;
    expect(invalidInquiryFields(r.error).sort()).toEqual(["consent", "email", "message", "type"]);
  });

  it("作品の指定は英小文字・数字・ハイフンだけ", () => {
    expect(inquiryInputSchema.safeParse({ ...valid, work: "ichi" }).success).toBe(true);
    expect(inquiryInputSchema.safeParse({ ...valid, work: "../etc" }).success).toBe(false);
  });
});

describe("createLocalInquiryStore", () => {
  let dir: string;
  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "wado-inquiry-"));
  });
  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("問い合わせを追加して、同時に送られても1件も失わない", async () => {
    const store = createLocalInquiryStore(path.join(dir, "inquiries.json"));
    const input = inquiryInputSchema.parse(valid);
    await Promise.all(Array.from({ length: 15 }, () => store.add(input)));
    const entries = await store.list();
    expect(entries).toHaveLength(15);
    expect(new Set(entries.map((e) => e.id)).size).toBe(15);
    expect(entries[0]).toMatchObject({ type: "commission", email: "architect@example.com" });
  });
});
