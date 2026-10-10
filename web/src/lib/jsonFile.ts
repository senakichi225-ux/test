import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * パソコンの中の JSON ファイルを、安全に読み書きする小さな部品。
 * - 書き込みは1つずつ順番に行う（同時に書いて壊さない）
 * - 一時ファイルに書いてから置き換える（途中で止まっても壊れない）
 * - 個人情報を含むので、ファイルの権限は本人だけ（0600）
 */
export function createJsonFile<T>(filePath: string, empty: () => T, isValid: (data: unknown) => data is T) {
  let queue: Promise<unknown> = Promise.resolve();

  async function read(): Promise<T> {
    try {
      const data: unknown = JSON.parse(await readFile(filePath, "utf8"));
      return isValid(data) ? data : empty();
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return empty();
      throw error;
    }
  }

  async function write(data: T): Promise<void> {
    await mkdir(path.dirname(filePath), { recursive: true });
    const tmp = `${filePath}.${process.pid}.tmp`;
    await writeFile(tmp, JSON.stringify(data, null, 2) + "\n", { encoding: "utf8", mode: 0o600 });
    await rename(tmp, filePath);
  }

  /** 読んで、変えて、書く。を1つの順番待ちの中で行う */
  function update<R>(fn: (data: T) => { data: T; result: R } | Promise<{ data: T; result: R }>): Promise<R> {
    const run = queue.then(async () => {
      const next = await fn(await read());
      await write(next.data);
      return next.result;
    });
    queue = run.catch(() => undefined);
    return run;
  }

  return { read, update };
}

/** 保存先のフォルダ：web/.data（.gitignore 済み） */
export function dataDir(): string {
  return path.join(process.cwd(), ".data");
}
