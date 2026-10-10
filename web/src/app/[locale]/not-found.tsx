import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

export default async function NotFound() {
  const dict = await getDictionary();
  const locale = await getLocale();
  return (
    <main id="main" className="flex min-h-dvh flex-col items-center justify-center gap-6 px-5 text-center">
      <Wordmark className="text-3xl" />
      <h1 className="font-serif text-2xl font-light">{dict.notFound.title}</h1>
      <Link href={`/${locale}`} className="text-sm text-ai underline underline-offset-4">
        {dict.notFound.back}
      </Link>
    </main>
  );
}
