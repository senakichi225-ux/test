import Link from "next/link";
import { cacheLife } from "next/cache";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { Wordmark } from "./Wordmark";

/** 著作権表示の年。現在時刻を読むので、1日単位でキャッシュする（Cache Components） */
async function currentYear(): Promise<number> {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function SiteFooter({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <footer className="border-t border-sumi/10 bg-washi-deep/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-14 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <Wordmark className="text-2xl" />
          <p className="text-sm text-usuzumi">{dict.footer.operated}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-usuzumi md:items-end">
          <Link href={`/${locale}/privacy`} className="underline decoration-kin/60 underline-offset-4 hover:text-sumi">
            {dict.footer.privacy}
          </Link>
          <p>{dict.footer.contact}</p>
          <p className="text-xs">© {await currentYear()} kerokero. {dict.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
