"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeLabels, locales, type Locale } from "@/i18n/config";

/** 今のページのまま、言語だけを切り替えるリンク */
export function LanguageSwitcher({ current, label }: { current: Locale; label: string }) {
  const pathname = usePathname() ?? `/${current}`;
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <nav aria-label={label} className="flex items-center gap-1 text-xs tracking-wider">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden className="text-nezumi">/</span>}
          <Link
            href={`/${l}${rest ? `/${rest}` : ""}`}
            hrefLang={l}
            lang={l}
            aria-current={l === current ? "true" : undefined}
            className={
              l === current
                ? "text-sumi underline decoration-sumi/40 underline-offset-4"
                : "text-usuzumi hover:text-sumi"
            }
          >
            {localeLabels[l as Locale]}
          </Link>
        </span>
      ))}
    </nav>
  );
}
