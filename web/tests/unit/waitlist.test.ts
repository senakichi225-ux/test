import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { invalidFields, waitlistInputSchema } from "@/lib/waitlist/schema";
import { createLocalJsonStore } from "@/lib/waitlist/store";

const valid = {
  email: "  Designer@Example.COM ",
  role: "designer",
  country: "France",
  interest: "ichi",
  message: "",
  consent: "yes",
  locale: "en",
};

describe("waitlistInputSchema", () => {
  it("正しい入力を受け付け、メールを小文字にし、空の任意項目は未入力にする", () => {
    const r = waitlistInputSchema.safeParse(valid);
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.email).toBe("designer@example.com");
    expect(r.data.message).toBeUndefined();
  });

  it("任意項目（国・興味・メッセージ）が空でも受け付ける", () => {
    const r = waitlistInputSchema.safeParse({ ...valid, country: "", interest: "", message: "" });
    expect(r.success).toBe(true);
  });

  it("メール・役割・同意が正しくないと、その項目を返す", () => {
    const r = waitlistInputSchema.safeParse({ ...valid, email: "not-an-email", role: "", consent: "" });
    expect(r.success).toBe(false);
    if (r.success) return;
    expect(invalidFields(r.error).sort()).toEqual(["consent", "email", "role"]);
  });

  it("知らない言語や長すぎるメッセージは受け付けない", () => {
    expect(waitlistInputSchema.safeParse({ ...valid, locale: "fr" }).success).toBe(false);
    expect(waitlistInputSchema.safeParse({ ...valid, message: "a".repeat(1001) }).success).toBe(false);
  });
});

describe("createLocalJsonStore", () => {
  let dir: string;
  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "wado-waitlist-"));
  });
  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("新しいメールは追加し、同じメールは重複させずに更新する", async () => {
    const file = path.join(dir, "nested", "waitlist.json");
    const store = createLocalJsonStore(file);
    const input = waitlistInputSchema.parse(valid);

    const first = await store.upsert(input, new Date("2026-10-10T00:00:00Z"));
    expect(first.status).toBe("created");

    const second = await store.upsert({ ...input, role: "architect" }, new Date("2026-10-11T00:00:00Z"));
    expect(second.status).toBe("updated");

    const entries = await store.list();
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      email: "designer@example.com",
      role: "architect",
      createdAt: "2026-10-10T00:00:00.000Z",
      updatedAt: "2026-10-11T00:00:00.000Z",
      source: "lp",
    });
    expect(JSON.parse(await readFile(file, "utf8")).version).toBe(1);
  });

  it("同時に登録しても、1件も失わない", async () => {
    const store = createLocalJsonStore(path.join(dir, "waitlist.json"));
    const input = waitlistInputSchema.parse(valid);
    await Promise.all(
      Array.from({ length: 20 }, (_, i) => store.upsert({ ...input, email: `user${i}@example.com` })),
    );
    expect(await store.list()).toHaveLength(20);
  });
});
