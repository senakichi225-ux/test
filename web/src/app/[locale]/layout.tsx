import type { Metadata } from "next";
import { Cormorant_Garamond, Hanken_Grotesk, Zen_Kaku_Gothic_New, Zen_Old_Mincho } from "next/font/google";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { locales } from "@/i18n/config";
import "../globals.css";

// 見出し・ロゴ：欧文セリフ（Ō を含む Latin Extended-A に対応）＋和文明朝
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  variable: "--font-cormorant",
  display: "swap",
});
const zenMincho = Zen_Old_Mincho({
  weight: ["400", "500"],
  variable: "--font-zen-mincho",
  display: "swap",
  preload: false, // 和文は文字数が多いので先読みしない
});
// 本文・UI：欧文グロテスク＋和文ゴシック
const hanken = Hanken_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-hanken",
  display: "swap",
});
const zenGothic = Zen_Kaku_Gothic_New({
  weight: ["400", "500"],
  variable: "--font-zen-gothic",
  display: "swap",
  preload: false,
});

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  const locale = await getLocale();
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      locale: locale === "ja" ? "ja_JP" : "en_US",
      type: "website",
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${zenMincho.variable} ${hanken.variable} ${zenGothic.variable} antialiased`}
    >
      <body className="min-h-dvh bg-washi text-sumi">{children}</body>
    </html>
  );
}
