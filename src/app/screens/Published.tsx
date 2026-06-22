import { Inbox, Pencil, AlertTriangle } from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { cn } from "../components/ui/utils";
import { StatusChip, EmptyState, SkeletonRows } from "../components/primitives";
import { listCards } from "../api/endpoints";
import { apiRequest } from "../api/client";
import type { CardListItem } from "../api/types";
import type { Lang } from "../lib/i18n";

type TabKey = "published" | "scheduled" | "draft";

const TABS: { key: TabKey; labelEn: string; labelTa: string }[] = [
  { key: "published", labelEn: "Published", labelTa: "வெளியிடப்பட்டது" },
  { key: "scheduled", labelEn: "Scheduled", labelTa: "திட்டமிடப்பட்டது" },
  { key: "draft", labelEn: "Drafts", labelTa: "வரைவுகள்" },
];

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export function Published({ lang }: { lang: Lang }) {
  const [tab, setTab] = useState<TabKey>("published");
  const qc = useQueryClient();

  const statusParam = tab === "scheduled" ? "published" : tab;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cards", tab],
    queryFn: () => listCards({ status: statusParam, page_size: 50 }),
  });

  const recallMut = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/cards/${id}/recall`, { method: "POST", body: { reason: "Recalled from Published screen" } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cards"] }),
  });

  const list: CardListItem[] = data?.items ?? [];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-shrink-0 items-center gap-1 border-b border-border bg-card px-5 py-3" role="tablist" aria-label="Post status">
        {TABS.map((t) => (
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
            {lang === "ta" ? t.labelTa : t.labelEn}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 grid grid-cols-[2fr_120px_120px_130px] gap-3 border-b border-border bg-muted/50 px-5 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          <span>{lang === "ta" ? "அட்டை" : "Card"}</span>
          <span>{lang === "ta" ? "தொனி" : "Tonality"}</span>
          <span>{lang === "ta" ? "நேரம்" : "Time"}</span>
          <span className="sr-only">Actions</span>
        </div>

        {isLoading ? (
          <SkeletonRows rows={5} cols={[3, 1, 1, 1]} />
        ) : isError ? (
          <EmptyState
            icon={AlertTriangle}
            title={lang === "ta" ? "பிழை ஏற்பட்டது" : "Error loading cards"}
            hint={lang === "ta" ? "மீண்டும் முயல்க." : "Please retry."}
          />
        ) : list.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={lang === "ta" ? "உருப்படிகள் இல்லை" : `No ${tab} cards`}
            hint={lang === "ta" ? "இந்த தாவலில் தற்போது எதுவும் இல்லை." : "Nothing here yet for this tab."}
          />
        ) : (
          list.map((card) => {
            const title = (lang === "ta" ? card.titleTa : card.titleEn) ?? card.titleEn ?? card.titleTa ?? "Untitled";
            return (
              <div key={card.id} className="grid grid-cols-[2fr_120px_120px_130px] items-center gap-3 border-b border-border px-5 py-3 text-xs transition-colors hover:bg-muted/30">
                <div className="min-w-0 truncate font-medium text-foreground">{title}</div>
                <span className="truncate capitalize text-muted-foreground">{card.tonality ?? "—"}</span>
                <span className="font-mono text-muted-foreground">{formatTime(card.updatedAt)}</span>
                <div className="flex items-center gap-1.5">
                  <StatusChip status={card.status} />
                  {card.status === "published" && (
                    <button
                      onClick={() => recallMut.mutate(card.id)}
                      disabled={recallMut.isPending}
                      className="rounded border border-red-300 px-1.5 py-0.5 text-[10px] font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50 active:scale-95 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                      {lang === "ta" ? "திரும்பப்பெறு" : "Recall"}
                    </button>
                  )}
                  {card.status === "draft" && (
                    <button className="flex items-center gap-1 rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-foreground transition-colors hover:bg-muted active:scale-95">
                      <Pencil size={9} aria-hidden="true" /> {lang === "ta" ? "திருத்து" : "Edit"}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
