import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Wordmark } from "@/components/Wordmark";
import { getDictionary } from "@/i18n/dictionaries";
import { loadResearch } from "@/lib/research/load";
import { researchAreas, researchStatuses, type ResearchStatus } from "@/lib/research/schema";

// 非公開ページ：検索エンジンに載せない（本番では proxy.ts で Basic 認証）
export const metadata: Metadata = {
  title: "Research — SŌN",
  robots: { index: false, follow: false },
};

/** research/*.json を読む。数分ごとに読み直す */
async function getResearch() {
  "use cache";
  cacheLife("minutes");
  return loadResearch();
}

const statusStyle: Record<ResearchStatus, string> = {
  hypothesis: "bg-usuzumi/15 text-usuzumi",
  investigating: "bg-ai/10 text-ai",
  verified: "bg-[#3f6a3a]/12 text-[#3f6a3a]",
  rejected: "bg-shu/10 text-shu",
};
const barStyle: Record<ResearchStatus, string> = {
  hypothesis: "bg-usuzumi/40",
  investigating: "bg-ai",
  verified: "bg-[#3f6a3a]",
  rejected: "bg-shu",
};

export default async function ResearchPage() {
  const [dict, data] = await Promise.all([getDictionary(), getResearch()]);
  const t = dict.research;
  const all = researchAreas.flatMap((a) => data.byArea[a]);
  const count = (items: typeof all, s: ResearchStatus) => items.filter((i) => i.status === s).length;

  return (
    <main id="main" className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-sumi/10 pb-8">
        <div className="space-y-2">
          <Wordmark className="text-lg text-usuzumi" />
          <h1 className="font-serif text-4xl font-light">{t.title}</h1>
          <p className="text-usuzumi">{t.lead}</p>
        </div>
        <p className="border border-shu/40 px-3 py-1 text-xs text-shu">{t.private}</p>
      </header>

      {data.errors.length > 0 && (
        <div role="alert" className="mt-8 border-l-2 border-shu bg-shu/5 p-4 text-sm">
          <p className="font-medium text-shu">{t.loadError}</p>
          <ul className="mt-2 list-disc pl-5 text-usuzumi">
            {data.errors.map((e) => (
              <li key={e.file}>
                <code>{e.file}</code>: {e.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 全体のまとめ */}
      <section aria-label="Summary" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border border-sumi/10 bg-white/40 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-usuzumi">{t.total}</p>
          <p className="mt-2 font-serif text-4xl">{all.length}</p>
        </div>
        {researchStatuses.map((s) => (
          <div key={s} className="border border-sumi/10 bg-white/40 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-usuzumi">{t.statuses[s]}</p>
            <p className="mt-2 font-serif text-4xl">{count(all, s)}</p>
          </div>
        ))}
      </section>

      {/* 観点ごとの進み具合 */}
      <section aria-label="Progress by area" className="mt-10 space-y-3">
        {researchAreas.map((a) => {
          const items = data.byArea[a];
          return (
            <a key={a} href={`#${a}`} className="grid grid-cols-[10rem_1fr_2rem] items-center gap-4 text-sm hover:text-ai sm:grid-cols-[14rem_1fr_2rem]">
              <span className="truncate">{t.areas[a]}</span>
              <span className="flex h-2.5 overflow-hidden bg-sumi/5" aria-hidden>
                {researchStatuses.map((s) => (
                  <span key={s} className={barStyle[s]} style={{ width: items.length ? `${(count(items, s) / items.length) * 100}%` : 0 }} />
                ))}
              </span>
              <span className="text-right text-usuzumi">{items.length}</span>
            </a>
          );
        })}
      </section>

      {/* 観点ごとの一覧 */}
      {researchAreas.map((a) => (
        <section key={a} id={a} aria-labelledby={`${a}-title`} className="mt-16 scroll-mt-6">
          <h2 id={`${a}-title`} className="border-b border-sumi/10 pb-3 font-serif text-2xl">
            {t.areas[a]} <span className="text-base text-usuzumi">({data.byArea[a].length})</span>
          </h2>
          {data.byArea[a].length === 0 ? (
            <p className="mt-4 text-sm text-usuzumi">{t.empty}</p>
          ) : (
            <ul className="mt-6 grid gap-4 lg:grid-cols-2">
              {data.byArea[a].map((item) => (
                <li key={item.id} className="space-y-3 border border-sumi/10 bg-white/50 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-medium leading-snug">{item.title}</h3>
                    <span className={`shrink-0 px-2 py-0.5 text-xs ${statusStyle[item.status]}`}>{t.statuses[item.status]}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-usuzumi">{item.summary}</p>
                  <div className="text-sm">
                    <p className="text-xs uppercase tracking-[0.15em] text-usuzumi">{t.evidence}</p>
                    {item.evidence.length === 0 ? (
                      <p className="mt-1 text-usuzumi/70">{t.noEvidence}</p>
                    ) : (
                      <ul className="mt-1 space-y-1">
                        {item.evidence.map((e) => (
                          <li key={e.url} className="break-all">
                            <a href={e.url} target="_blank" rel="noopener noreferrer" className="text-ai underline underline-offset-2">
                              {e.source}
                            </a>{" "}
                            <span className={`ml-1 px-1.5 text-[11px] ${e.primary ? "bg-[#3f6a3a]/12 text-[#3f6a3a]" : "bg-usuzumi/10 text-usuzumi"}`}>
                              {e.primary ? "primary" : "secondary"}
                            </span>
                            <span className="ml-1 text-xs text-usuzumi">
                              ({t.checked} {e.checked_at})
                            </span>
                            {e.note && <span className="block text-xs text-usuzumi">{e.note}</span>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-sumi/10 pt-3 text-xs text-usuzumi">
                    {item.next_action && (
                      <>
                        <dt>{t.nextAction}</dt>
                        <dd className="text-sumi">{item.next_action}</dd>
                      </>
                    )}
                    <dt>{t.owner}</dt>
                    <dd>{item.owner}</dd>
                    <dt>{t.updated}</dt>
                    <dd>{item.updated_at}</dd>
                  </dl>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <p className="mt-16 text-xs text-usuzumi">{t.dataSource}</p>
    </main>
  );
}
