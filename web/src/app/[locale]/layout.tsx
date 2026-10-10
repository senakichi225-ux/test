import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Noto_Sans_JP, Shippori_Mincho } from "next/font/google";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { locales } from "@/i18n/config";
import "../globals.css";

// 見出し：欧文セリフ（Ō を含む Latin Extended-A に対応）＋和文明朝
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});
const shippori = Shippori_Mincho({
  weight: ["400", "500", "600"],
  variable: "--font-shippori",
  display: "swap",
  preload: false, // 和文は文字数が多いので先読みしない
});
// 本文：欧文サンセリフ＋和文ゴシック
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});
const notoJp = Noto_Sans_JP({
  variable: "--font-noto-jp",
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
      className={`${cormorant.variable} ${shippori.variable} ${inter.variable} ${notoJp.variable} antialiased`}
    >
      <body className="min-h-dvh bg-washi text-sumi">{children}</body>
    </html>
  );
}
