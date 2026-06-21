import { useState } from "react";
import { Inbox, RotateCcw, Pencil, AlertTriangle } from "lucide-react";
import { cn } from "../components/ui/utils";
import { StatusChip, PlatformChip, EmptyState, SkeletonRows } from "../components/primitives";
import { publishedCards, type PostStatus } from "../data/mock";
import { useSimulatedLoad } from "../lib/useSimulatedLoad";
import type { Lang } from "../lib/i18n";

const TABS: { key: PostStatus | "drafts"; status: PostStatus }[] = [
  { key: "published", status: "published" },
  { key: "scheduled", status: "scheduled" },
  { key: "failed", status: "failed" },
  { key: "drafts", status: "draft" },
];

export function Published({ lang }: { lang: Lang }) {
  const [tab, setTab] = useState<PostStatus | "drafts">("published");
  const loading = useSimulatedLoad();

  const active = TABS.find((t) => t.key === tab)!;
  const list = publishedCards.filter((c) => c.status === active.status);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-shrink-0 items-center gap-1 border-b border-border bg-card px-5 py-3" role="tablist" aria-label="Post status">
        {TABS.map((t) => {
          const count = publishedCards.filter((c) => c.status === t.status).length;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium capitalize transition-colors active:scale-[0.98]",
                tab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
              )}
            >
              {t.key}
              <span className={cn("rounded-full px-1.5 text-[10px] font-mono", tab === t.key ? "bg-white/20" : "bg-muted-foreground/15")}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 grid grid-cols-[2fr_180px_120px_90px_90px_90px_130px] gap-3 border-b border-border bg-muted/50 px-5 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          <span>{lang === "ta" ? "அட்டை" : "Card"}</span>
          <span>{lang === "ta" ? "தளங்கள்" : "Platforms"}</span>
          <span>{lang === "ta" ? "நேரம்" : "Time"}</span>
          <span>{lang === "ta" ? "சென்றடைவு" : "Reach"}</span>
          <span>{lang === "ta" ? "விருப்பம்" : "Likes"}</span>
          <span>{lang === "ta" ? "பகிர்வு" : "Shares"}</span>
          <span className="sr-only">Actions</span>
        </div>

        {loading ? (
          <SkeletonRows rows={4} cols={[3, 2, 1, 1]} />
        ) : list.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={lang === "ta" ? "உருப்படிகள் இல்லை" : `No ${tab} posts`}
            hint={lang === "ta" ? "இந்த தாவலில் தற்போது எதுவும் இல்லை." : "Nothing here yet for this tab."}
          />
        ) : (
          list.map((card) => (
            <div key={card.id} className="grid grid-cols-[2fr_180px_120px_90px_90px_90px_130px] items-center gap-3 border-b border-border px-5 py-3 text-xs transition-colors hover:bg-muted/30">
              <div className="truncate font-medium text-foreground">{card.title}</div>
              <div className="flex flex-wrap gap-1">
                {card.platforms.map((p) => <PlatformChip key={p} platform={p} status={card.status} />)}
              </div>
              <span className="font-mono text-muted-foreground">{card.time}</span>
              <span className="font-mono text-foreground">{card.reach}</span>
              <span className="font-mono text-foreground">{card.likes}</span>
              <span className="font-mono text-foreground">{card.shares}</span>
              <div className="flex items-center gap-1.5">
                <StatusChip status={card.status} />
                {card.status === "published" && (
                  <button className="rounded border border-red-300 px-1.5 py-0.5 text-[10px] font-medium text-red-700 transition-colors hover:bg-red-50 active:scale-95 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40">
                    {lang === "ta" ? "திரும்பப்பெறு" : "Recall"}
                  </button>
                )}
                {card.status === "failed" && (
                  <button className="flex items-center gap-1 rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-foreground transition-colors hover:bg-muted active:scale-95">
                    <RotateCcw size={9} aria-hidden="true" /> {lang === "ta" ? "மீண்டும்" : "Retry"}
                  </button>
                )}
                {card.status === "draft" && (
                  <button className="flex items-center gap-1 rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-foreground transition-colors hover:bg-muted active:scale-95">
                    <Pencil size={9} aria-hidden="true" /> {lang === "ta" ? "திருத்து" : "Edit"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        {/* Failed-tab inline error banner */}
        {!loading && tab === "failed" && list.length > 0 && (
          <div className="m-5 flex items-start gap-2 rounded border border-red-200 bg-red-50 p-3 text-xs text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            <AlertTriangle size={13} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
            <span>
              {lang === "ta"
                ? "சில இடுகைகள் தளத்தின் API தோல்வியால் தோல்வியடைந்தன. அனுமதிகளை சரிபார்த்து மீண்டும் முயற்சிக்கவும்."
                : "Some posts failed due to a platform API error. Check credentials and retry."}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
