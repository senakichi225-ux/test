import { locale as localeParam } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./config";
import en from "../../messages/en.json";

/** 辞書の形は英語版（messages/en.json）を正とする。ja.json も同じ形でなければならない（テストで確認） */
export type Dictionary = typeof en;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("../../messages/en.json").then((m) => m.default),
  ja: () => import("../../messages/ja.json").then((m) => m.default),
};

/** 言語を指定して辞書を読む（Server Action など、root-params が使えない場所用） */
export function loadDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}

/** 今のページの言語（URL の /[locale]）を読み取る。Server Component から使う */
export async function getLocale(): Promise<Locale> {
  const value = await localeParam();
  if (!isLocale(value)) notFound();
  return value;
}

/** 今のページの言語の辞書を読む。Server Component から使う */
export async function getDictionary(): Promise<Dictionary> {
  return loadDictionary(await getLocale());
}
