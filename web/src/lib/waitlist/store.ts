import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
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

/** ローカルの JSON ファイルに保存する実装 */
export function createLocalJsonStore(filePath: string): WaitlistStore {
  // 同時に書き込んで壊れないよう、書き込みを1つずつ順番に行う
  let queue: Promise<unknown> = Promise.resolve();
  const serialize = <T>(task: () => Promise<T>): Promise<T> => {
    const run = queue.then(task, task);
    queue = run.catch(() => undefined);
    return run;
  };

  async function read(): Promise<FileShape> {
    try {
      const data = JSON.parse(await readFile(filePath, "utf8")) as FileShape;
      return Array.isArray(data.entries) ? data : { version: 1, entries: [] };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return { version: 1, entries: [] };
      throw error;
    }
  }

  async function write(data: FileShape): Promise<void> {
    await mkdir(path.dirname(filePath), { recursive: true });
    // 途中で止まってもファイルが壊れないよう、一時ファイルに書いてから置き換える
    const tmp = `${filePath}.${process.pid}.tmp`;
    await writeFile(tmp, JSON.stringify(data, null, 2) + "\n", { encoding: "utf8", mode: 0o600 });
    await rename(tmp, filePath);
  }

  return {
    upsert(input, now = new Date()) {
      return serialize(async () => {
        const data = await read();
        const iso = now.toISOString();
        const index = data.entries.findIndex((e) => e.email === input.email);
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
        if (index >= 0) {
          const entry: WaitlistEntry = { ...data.entries[index], ...base };
          data.entries[index] = entry;
          await write(data);
          return { status: "updated" as const, entry };
        }
        const entry: WaitlistEntry = { id: randomUUID(), createdAt: iso, ...base };
        data.entries.push(entry);
        await write(data);
        return { status: "created" as const, entry };
      });
    },
    async list() {
      return (await read()).entries;
    },
  };
}

/** 保存先ファイル：環境変数 WAITLIST_FILE、なければ web/.data/waitlist.json（.gitignore 済み） */
export function defaultWaitlistFile(): string {
  return process.env.WAITLIST_FILE || path.join(process.cwd(), ".data", "waitlist.json");
}

let store: WaitlistStore | undefined;
export function getWaitlistStore(): WaitlistStore {
  store ??= createLocalJsonStore(defaultWaitlistFile());
  return store;
}
