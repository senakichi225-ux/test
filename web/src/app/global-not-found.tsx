import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

/**
 * どのページにも当たらない URL の 404（言語が分からないので、英語と日本語を並べる）。
 * [locale]/layout.tsx を通らないので、フォントとスタイルをここで読み込む。
 */
const cormorant = Cormorant_Garamond({ subsets: ["latin", "latin-ext"], weight: ["300", "500"], variable: "--font-cormorant" });
const hanken = Hanken_Grotesk({ subsets: ["latin", "latin-ext"], variable: "--font-hanken" });

export const metadata: Metadata = {
  title: "Page not found — SŌN",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${cormorant.variable} ${hanken.variable} antialiased`}>
      <body className="min-h-dvh bg-washi text-sumi">
        <main id="main" className="flex min-h-dvh flex-col items-center justify-center gap-8 px-5 text-center">
          <span className="font-serif text-3xl font-medium tracking-brand" translate="no">
            SŌN
          </span>
          <div className="space-y-2">
            <h1 className="font-serif text-4xl font-light">Page not found</h1>
            <p lang="ja" className="text-usuzumi">
              ページが見つかりません
            </p>
          </div>
          <nav aria-label="Language" className="flex gap-8 text-sm">
            <Link href="/en" className="underline decoration-nezumi underline-offset-8 hover:decoration-sumi">
              Back to SŌN
            </Link>
            <Link href="/ja" lang="ja" className="underline decoration-nezumi underline-offset-8 hover:decoration-sumi">
              SŌN にもどる
            </Link>
          </nav>
        </main>
      </body>
    </html>
  );
}
