import { randomUUID } from "node:crypto";
import path from "node:path";
import { createJsonFile, dataDir } from "../jsonFile";
import type { WaitlistEntry, WaitlistInput } from "./schema";

/**
 * ウェイティングリストの保存先（アダプタ）。
 * いまは「パソコンの中のファイル」だけ。外部サービスに替えるときは、この形の別実装を作って差し替える（CLAUDE.md §7）。
 */
export interface WaitlistStore {
  /** 同じメールアドレスがあれば更新、なければ追加する */
  upsert(input: WaitlistInput, now?: Date): Promise<{ status: "created" | "updated"; entry: WaitlistEntry }>;
  list(): Promise<WaitlistEntry[]>;
}

type FileShape = { version: 1; entries: WaitlistEntry[] };
type UpsertResult = { status: "created" | "updated"; entry: WaitlistEntry };
const isFile = (d: unknown): d is FileShape => !!d && typeof d === "object" && Array.isArray((d as FileShape).entries);

/** ローカルの JSON ファイルに保存する実装 */
export function createLocalJsonStore(filePath: string): WaitlistStore {
  const file = createJsonFile<FileShape>(filePath, () => ({ version: 1, entries: [] }), isFile);

  return {
    upsert(input, now = new Date()) {
      return file.update<UpsertResult>((data) => {
        const iso = now.toISOString();
        const base = {
          email: input.email,
          role: input.role,
          country: input.country,
          interest: input.interest,
          message: input.message,
          locale: input.locale,
          consentAt: iso,
          updatedAt: iso,
          source: "lp" as const,
        };
        const index = data.entries.findIndex((e) => e.email === input.email);
        if (index >= 0) {
          const entry: WaitlistEntry = { ...data.entries[index], ...base };
          data.entries[index] = entry;
          return { data, result: { status: "updated", entry } };
        }
        const entry: WaitlistEntry = { id: randomUUID(), createdAt: iso, ...base };
        data.entries.push(entry);
        return { data, result: { status: "created", entry } };
      });
    },
    async list() {
      return (await file.read()).entries;
    },
  };
}

/** 保存先ファイル：環境変数 WAITLIST_FILE、なければ web/.data/waitlist.json */
export function defaultWaitlistFile(): string {
  return process.env.WAITLIST_FILE || path.join(dataDir(), "waitlist.json");
}

let store: WaitlistStore | undefined;
export function getWaitlistStore(): WaitlistStore {
  store ??= createLocalJsonStore(defaultWaitlistFile());
  return store;
}
