import { BRAND_NAME } from "@/lib/brand";

/** 文字だけのワードマーク「SŌN」（CLAUDE.md §5） */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-serif font-medium tracking-brand ${className}`} translate="no">
      {BRAND_NAME}
    </span>
  );
}
