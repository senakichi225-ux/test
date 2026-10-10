/**
 * ブランドの基本情報。ブランド名はここだけで定義し、ほかで直書きしない（CLAUDE.md §1）。
 */
export const BRAND_NAME = "SŌN";

/** URL・ファイル名など、Ō が使えない場所での表記 */
export const BRAND_ASCII = "SON";

/** ブランドの運営元 */
export const OPERATOR_NAME = "kerokero";

/** SŌN の3文字に込めた意味（文言は messages/{locale}.json の name セクション） */
export const BRAND_LETTERS = ["S", "Ō", "N"] as const;
