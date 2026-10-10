import { randomUUID } from "node:crypto";
import path from "node:path";
import { createJsonFile, dataDir } from "../jsonFile";
import type { InquiryEntry, InquiryInput } from "./schema";

/** 問い合わせの保存先（アダプタ）。いまはパソコンの中のファイルだけ */
export interface InquiryStore {
  add(input: InquiryInput, now?: Date): Promise<InquiryEntry>;
  list(): Promise<InquiryEntry[]>;
}

type FileShape = { version: 1; entries: InquiryEntry[] };
const isFile = (d: unknown): d is FileShape => !!d && typeof d === "object" && Array.isArray((d as FileShape).entries);

export function createLocalInquiryStore(filePath: string): InquiryStore {
  const file = createJsonFile<FileShape>(filePath, () => ({ version: 1, entries: [] }), isFile);
  return {
    add(input, now = new Date()) {
      return file.update((data) => {
        const iso = now.toISOString();
        const entry: InquiryEntry = { id: randomUUID(), createdAt: iso, consentAt: iso, ...input };
        data.entries.push(entry);
        return { data, result: entry };
      });
    },
    async list() {
      return (await file.read()).entries;
    },
  };
}

/** 保存先ファイル：環境変数 INQUIRY_FILE、なければ web/.data/inquiries.json */
export function defaultInquiryFile(): string {
  return process.env.INQUIRY_FILE || path.join(dataDir(), "inquiries.json");
}

let store: InquiryStore | undefined;
export function getInquiryStore(): InquiryStore {
  store ??= createLocalInquiryStore(defaultInquiryFile());
  return store;
}
