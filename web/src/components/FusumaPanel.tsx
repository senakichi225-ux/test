/**
 * ふすまのイラスト（CSS と SVG だけで描く。写真の代わり）。
 * 実際の作品の写真は、権利の許可が取れてから差し替える（CLAUDE.md §5）。
 */
export type FusumaVariant = "plain" | "ink" | "pattern" | "dusk";

const surfaces: Record<FusumaVariant, string> = {
  plain: "bg-[linear-gradient(115deg,#fbf8f1_0%,#f3ede1_45%,#e8dfcf_100%)]",
  dusk: "bg-[linear-gradient(160deg,#f7e9d4_0%,#e9d2b4_55%,#cdb497_100%)]",
  ink: "bg-[linear-gradient(115deg,#faf7f0_0%,#f1ebdf_60%,#e6ddcc_100%)]",
  pattern: "bg-[#efe7d6]",
};

export function FusumaPanel({
  variant = "plain",
  hikite = "right",
  className = "",
}: {
  variant?: FusumaVariant;
  hikite?: "left" | "right" | "none";
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`relative overflow-hidden border-[5px] border-fuchi shadow-[0_30px_60px_-30px_rgba(31,29,26,0.45)] ${className}`}
    >
      <div className={`absolute inset-0 ${surfaces[variant]}`} />
      <div className="washi-texture absolute inset-0 opacity-90" />

      {variant === "pattern" && (
        // 唐紙（からかみ）風のくり返し文様
        <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_center,transparent_0,transparent_9px,#c9b48a_10px,transparent_11px),radial-gradient(circle_at_center,#d8c8a6_0,#d8c8a6_2px,transparent_3px)] [background-position:0_0,14px_14px] [background-size:28px_28px]" />
      )}

      {variant === "ink" && (
        // 墨の筆あと
        <svg viewBox="0 0 100 160" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <path
            d="M18 128 C 30 92, 46 70, 62 52 S 84 26, 86 18"
            fill="none"
            stroke="#1f1d1a"
            strokeWidth="5.5"
            strokeLinecap="round"
            opacity="0.82"
          />
          <path d="M30 136 C 44 118, 52 112, 70 108" fill="none" stroke="#1f1d1a" strokeWidth="2.2" strokeLinecap="round" opacity="0.55" />
          <circle cx="74" cy="34" r="9" fill="#b5482f" opacity="0.85" />
        </svg>
      )}

      {/* 斜めから差す光 */}
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0)_45%,rgba(31,29,26,0.07)_100%)]" />

      {hikite !== "none" && (
        // 引手（ひきて）：くぼんだ丸い取っ手
        <div
          className={`absolute top-1/2 aspect-square w-[13%] min-w-3 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_40%_35%,#3a3129_0%,#1f1a15_55%,#5b4a36_70%,#b08d45_74%,#6e5a3c_100%)] shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)] ${
            hikite === "right" ? "right-[8%]" : "left-[8%]"
          }`}
        />
      )}
    </div>
  );
}
