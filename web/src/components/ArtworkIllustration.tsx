import type { Illustration } from "@/lib/works/schema";

/**
 * 作品のイラスト（CSS と SVG だけ）。写真ができるまでの代わり。
 * 襖の構造でつくる作品を表す：和紙の面（上張り）、木の縁、墨の一筆、落款、引手。
 * 必ず「Illustration」と明記して使う（CLAUDE.md §5）。
 */

/** 和紙の面と木の縁（1枚分） */
function Panel({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-washi shadow-[0_1px_0_rgba(22,21,19,0.06),0_24px_48px_-28px_rgba(22,21,19,0.5)] ${className}`}
    >
      {/* 木の縁（ふち）：内側に細い面取りの光 */}
      <div className="absolute inset-0 border-[clamp(4px,2.4%,10px)] border-[#2a2420]" />
      <div className="absolute inset-[clamp(4px,2.4%,10px)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]" />
      {/* 上張りの和紙：わずかな繊維と、紙の層のふくらみ */}
      <div className="absolute inset-[clamp(4px,2.4%,10px)] bg-[radial-gradient(120%_90%_at_30%_25%,#f8f5ee_0%,#f1ece2_55%,#e7e0d3_100%)]">
        <div className="washi-texture absolute inset-0 opacity-80" />
        {children}
      </div>
    </div>
  );
}

/** 落款（作品の中の小さな印。UI の色ではなく、作品の一部） */
function Seal({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`absolute aspect-square bg-[#a8432e]/85 ${className}`}
    />
  );
}

/** 引手：くぼんだ丸い取っ手 */
function Hikite({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`absolute aspect-square rounded-full bg-[radial-gradient(circle_at_42%_38%,#3b342d_0%,#1c1814_58%,#6b6156_72%,#2b2520_100%)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] ${className}`}
    />
  );
}

/** 墨の一筆（太さの変わる帯を、塗りの形で描く） */
function Stroke({ d, className = "" }: { d: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
      className={`absolute inset-0 h-full w-full ${className}`}
    >
      <path d={d} fill="#161513" opacity="0.9" />
    </svg>
  );
}

// 「一」の筆：入り（太く）→ 送り（細く）→ 止め（ふくらむ）
const ICHI_STROKE =
  "M14 69.5 C 16 66.8, 21 66.2, 27 66.6 C 42 67.2, 58 66.9, 72 66.3 C 79 66, 84 65.6, 87.5 66.6 C 89.5 67.3, 89.2 69.4, 86.8 70.3 C 82 71.6, 74 70.8, 64 70.9 C 48 71.1, 33 71.6, 22 72.4 C 17 72.8, 13.2 72.1, 14 69.5 Z";
// 四字熟語：縦書き2行の短い筆（右の行 → 左の行）
const brush = (x: number, y: number, w: number) =>
  `M${x} ${y} C ${x + w * 0.3} ${y - 1.5}, ${x + w * 0.7} ${y - 1.2}, ${x + w} ${y} C ${x + w + 0.8} ${y + 1}, ${x + w} ${y + 2.4}, ${x + w * 0.7} ${y + 2.2} C ${x + w * 0.4} ${y + 2}, ${x + w * 0.2} ${y + 2.6}, ${x} ${y + 2.2} C ${x - 1} ${y + 1.8}, ${x - 0.8} ${y + 0.4}, ${x} ${y} Z`;
const IDIOM_STROKES = [
  brush(56, 22, 22),
  brush(58, 42, 18),
  brush(24, 30, 20),
  brush(22, 50, 22),
].join(" ");
const MA_STROKE =
  "M30 30 C 34 27.5, 42 27.5, 50 30.5 C 56 33, 60 37, 61.5 41 C 62.2 43, 60.4 44, 58.6 42.6 C 54.5 38.8, 48 35.5, 41 34.2 C 36 33.3, 31.5 33.6, 29.2 33 C 27.8 32.6, 28.5 30.8, 30 30 Z";

export function ArtworkIllustration({
  kind,
  label,
  animate = false,
  className = "",
}: {
  kind: Illustration;
  /** 支援技術向けの説明 */
  label: string;
  /** 光が横から差す演出（ヒーローだけ） */
  animate?: boolean;
  className?: string;
}) {
  const light = animate ? (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="animate-light-sweep absolute inset-y-0 -left-1/4 w-[150%] bg-[linear-gradient(100deg,transparent_30%,rgba(255,255,255,0.55)_48%,transparent_66%)]" />
    </div>
  ) : null;

  if (kind === "idiom") {
    return (
      <div role="img" aria-label={label} className={`relative ${className}`}>
        <Panel className="aspect-[2/3] w-full">
          <Stroke d={IDIOM_STROKES} />
          <Seal className="bottom-[9%] left-[12%] w-[4.5%]" />
        </Panel>
        {light}
      </div>
    );
  }

  if (kind === "name") {
    return (
      <div role="img" aria-label={label} className={`relative ${className}`}>
        <Panel className="aspect-square w-full">
          {/* 文様紙：ごく淡い丸の繰り返し */}
          <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_center,transparent_0,transparent_8px,#c9c2b4_9px,transparent_10px)] [background-size:24px_24px]" />
          <Stroke d={MA_STROKE} />
          <Hikite className="right-[16%] top-[60%] w-[12%]" />
          <Seal className="bottom-[10%] left-[12%] w-[5%]" />
        </Panel>
        {light}
      </div>
    );
  }

  return (
    <div role="img" aria-label={label} className={`relative ${className}`}>
      <Panel className="aspect-[2/3] w-full">
        <Stroke d={ICHI_STROKE} />
        <Seal className="bottom-[9%] right-[10%] w-[4.5%]" />
      </Panel>
      {light}
    </div>
  );
}
