import { useState } from "react";
import { Search as SearchIcon, FileText, Eye, Newspaper } from "lucide-react";
import { cn } from "../components/ui/utils";
import { EmptyState, SentimentBadge, StatusChip } from "../components/primitives";
import { publishedCards, socialMentions, printClippings } from "../data/mock";
import type { Lang } from "../lib/i18n";

const SCOPES = ["all", "cards", "mentions", "clippings"] as const;

export function GlobalSearch({ lang }: { lang: Lang }) {
  const [q, setQ] = useState("metro");
  const [scope, setScope] = useState<(typeof SCOPES)[number]>("all");
  const query = q.trim().toLowerCase();

  const cardHits = publishedCards.filter((c) => c.title.toLowerCase().includes(query));
  const mentionHits = socialMentions.filter((m) => (m.snippet + m.channel).toLowerCase().includes(query));
  const clipHits = printClippings.filter((c) => (c.headlineEn + c.paper).toLowerCase().includes(query));
  const total = cardHits.length + mentionHits.length + clipHits.length;
  const show = (s: string) => scope === "all" || scope === s;

  return (
    <div className="h-full overflow-y-auto p-5">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex items-center gap-2 rounded border border-border bg-card px-3 py-2.5">
          <SearchIcon size={16} className="text-muted-foreground" aria-hidden="true" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={lang === "ta" ? "அட்டைகள், குறிப்புகள், கட்டுரைகள் முழுவதும் தேடு…" : "Search across cards, mentions, clippings…"}
            aria-label="Global search"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex gap-1" role="tablist" aria-label="Search scope">
          {SCOPES.map((s) => (
            <button key={s} role="tab" aria-selected={scope === s} onClick={() => setScope(s)} className={cn("rounded px-2.5 py-1 text-xs font-medium capitalize transition-colors active:scale-[0.98]", scope === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>
              {s}
            </button>
          ))}
        </div>

        {!query ? (
          <EmptyState icon={SearchIcon} title={lang === "ta" ? "தேடலைத் தொடங்கு" : "Start searching"} hint={lang === "ta" ? "அட்டைகள், சமூக குறிப்புகள் மற்றும் பத்திரிகை கட்டுரைகள் முழுவதும்." : "Searches cards, social mentions and print clippings."} />
        ) : total === 0 ? (
          <EmptyState icon={SearchIcon} title={lang === "ta" ? `"${q}" க்கு முடிவுகள் இல்லை` : `No results for "${q}"`} hint={lang === "ta" ? "வேறு சொற்களை முயற்சிக்கவும்." : "Try a different term or scope."} />
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">{total} {lang === "ta" ? "முடிவுகள்" : "results"}</p>

            {show("cards") && cardHits.length > 0 && (
              <SearchGroup icon={FileText} title={lang === "ta" ? "அட்டைகள்" : "Cards"}>
                {cardHits.map((c) => (
                  <div key={c.id} className="flex items-center justify-between gap-3 border-b border-border px-3 py-2 text-xs last:border-0">
                    <span className="truncate font-medium text-foreground">{c.title}</span>
                    <StatusChip status={c.status} />
                  </div>
                ))}
              </SearchGroup>
            )}

            {show("mentions") && mentionHits.length > 0 && (
              <SearchGroup icon={Eye} title={lang === "ta" ? "சமூக குறிப்புகள்" : "Social mentions"}>
                {mentionHits.map((m) => (
                  <div key={m.id} className="flex items-start gap-2 border-b border-border px-3 py-2 text-xs last:border-0">
                    <SentimentBadge sentiment={m.sentiment} score={m.score} small />
                    <div className="min-w-0">
                      <span className="font-medium text-foreground">{m.channel}</span>
                      <p className="truncate text-muted-foreground">{m.snippet}</p>
                    </div>
                  </div>
                ))}
              </SearchGroup>
            )}

            {show("clippings") && clipHits.length > 0 && (
              <SearchGroup icon={Newspaper} title={lang === "ta" ? "பத்திரிகை கட்டுரைகள்" : "Print clippings"}>
                {clipHits.map((c) => (
                  <div key={c.id} className="flex items-center justify-between gap-3 border-b border-border px-3 py-2 text-xs last:border-0">
                    <div className="min-w-0">
                      <span className="truncate font-medium text-foreground" lang={lang}>{lang === "ta" ? c.headlineTa : c.headlineEn}</span>
                      <div className="font-mono text-[10px] text-muted-foreground">{c.paper} · {c.page} · {c.date}</div>
                    </div>
                    <SentimentBadge sentiment={c.sentiment} small />
                  </div>
                ))}
              </SearchGroup>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SearchGroup({ icon: Icon, title, children }: { icon: typeof FileText; title: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded border border-border bg-card">
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon size={12} aria-hidden="true" /> {title}
      </div>
      {children}
    </section>
  );
}
