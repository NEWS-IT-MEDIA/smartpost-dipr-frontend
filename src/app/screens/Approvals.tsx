import { useState } from "react";
import {
  Filter,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  FileText,
  RefreshCw,
  Inbox,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "../components/ui/utils";
import { StatusChip, SLABar, EmptyState, SkeletonRows } from "../components/primitives";
import { listCards, approveCard, returnCard, rejectCard, getCard } from "../api/endpoints";
import type { CardListItem, CardDetail } from "../api/types";
import type { Lang } from "../lib/i18n";

const FILTERS = ["pending_approval", "approved", "rejected"] as const;
type FilterKey = (typeof FILTERS)[number];

const FILTER_LABELS: Record<FilterKey, { en: string; ta: string }> = {
  pending_approval: { en: "Pending", ta: "நிலுவை" },
  approved: { en: "Approved", ta: "அங்கீகரிக்கப்பட்டது" },
  rejected: { en: "Rejected", ta: "நிராகரிக்கப்பட்டது" },
};

function cardAgeLabel(createdAt: string): string {
  const diff = Date.now() - new Date(createdAt).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

function slaPercent(createdAt: string, slaHours = 24): number {
  const elapsedH = (Date.now() - new Date(createdAt).getTime()) / 3_600_000;
  return Math.min(100, Math.round((elapsedH / slaHours) * 100));
}

export function Approvals({ lang }: { lang: Lang }) {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("pending_approval");
  const [comment, setComment] = useState("");
  const [actionError, setActionError] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["cards", filter],
    queryFn: () => listCards({ status: filter, page_size: 50 }),
  });

  const { data: detail, isLoading: detailLoading } = useQuery({
    queryKey: ["card", selected],
    queryFn: () => getCard(selected!),
    enabled: !!selected,
  });

  const onSuccess = () => {
    qc.invalidateQueries({ queryKey: ["cards"] });
    qc.invalidateQueries({ queryKey: ["diprStats"] });
    setSelected(null);
    setComment("");
    setActionError("");
  };

  const approveMut = useMutation({
    mutationFn: (action: "approve" | "approve_with_edits") =>
      approveCard(selected!, { action, comment: comment || undefined }),
    onSuccess,
    onError: (e: Error) => setActionError(e.message),
  });

  const returnMut = useMutation({
    mutationFn: () => returnCard(selected!, comment),
    onSuccess,
    onError: (e: Error) => setActionError(e.message),
  });

  const rejectMut = useMutation({
    mutationFn: () => rejectCard(selected!, comment),
    onSuccess,
    onError: (e: Error) => setActionError(e.message),
  });

  const isMutating = approveMut.isPending || returnMut.isPending || rejectMut.isPending;

  const list: CardListItem[] = data?.items ?? [];
  const selectedItem = list.find((c) => c.id === selected) ?? null;

  return (
    <div className="flex h-full overflow-hidden">
      <div className={cn("flex flex-col border-r border-border", selected ? "w-96 flex-shrink-0" : "flex-1")}>
        {/* Filter bar */}
        <div className="flex flex-shrink-0 items-center gap-3 border-b border-border bg-card px-4 py-3">
          <div className="flex gap-1" role="tablist" aria-label="Approval status filter">
            {FILTERS.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => { setFilter(f); setSelected(null); }}
                className={cn(
                  "rounded px-2.5 py-1 text-xs font-medium capitalize transition-colors active:scale-[0.98]",
                  filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                )}
              >
                {lang === "ta" ? FILTER_LABELS[f].ta : FILTER_LABELS[f].en}
              </button>
            ))}
          </div>
          <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter size={12} aria-hidden="true" /> {list.length} {lang === "ta" ? "உருப்படிகள்" : "items"}
          </span>
          {isError && (
            <button onClick={() => refetch()} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
              <RefreshCw size={11} /> {lang === "ta" ? "மீண்டும்" : "Retry"}
            </button>
          )}
        </div>

        {/* Table header */}
        <div className="grid flex-shrink-0 grid-cols-[1fr_80px_72px_72px] gap-2 border-b border-border bg-muted/50 px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          <span>{lang === "ta" ? "அட்டை" : "Card"}</span>
          <span>{lang === "ta" ? "நிலை" : "Stage"}</span>
          <span>{lang === "ta" ? "வயது" : "Age"}</span>
          <span className="sr-only">Action</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <SkeletonRows rows={4} cols={[3, 1, 1, 1]} />
          ) : isError ? (
            <EmptyState
              icon={AlertTriangle}
              title={lang === "ta" ? "பிழை ஏற்பட்டது" : "Error loading cards"}
              hint={lang === "ta" ? "மீண்டும் முயல்க." : "Please retry."}
            />
          ) : list.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title={lang === "ta" ? "உருப்படிகள் இல்லை" : `No ${FILTER_LABELS[filter].en.toLowerCase()} cards`}
              hint={lang === "ta" ? "இந்த வடிகட்டியில் தற்போது எதுவும் இல்லை." : "Nothing in this queue right now."}
            />
          ) : (
            list.map((item) => {
              const age = cardAgeLabel(item.createdAt);
              const sla = slaPercent(item.createdAt);
              const urgent = sla >= 90;
              const title = (lang === "ta" ? item.titleTa : item.titleEn) ?? item.titleEn ?? item.titleTa ?? "Untitled";
              return (
                <div
                  key={item.id}
                  onClick={() => setSelected(item.id === selected ? null : item.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setSelected(item.id === selected ? null : item.id)}
                  className={cn(
                    "grid cursor-pointer grid-cols-[1fr_80px_72px_72px] items-center gap-2 border-b border-border px-4 py-3 text-xs transition-colors",
                    selected === item.id ? "border-l-2 border-l-primary bg-primary/5" : "hover:bg-muted/40",
                  )}
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium text-foreground">{title}</div>
                    {urgent && (
                      <span className="mt-0.5 flex items-center gap-1 font-mono text-[10px] text-red-600">
                        <AlertTriangle size={9} aria-hidden="true" /> {lang === "ta" ? "SLA மீறப்பட்டது" : "SLA breached"}
                      </span>
                    )}
                  </div>
                  <span className="truncate font-mono text-muted-foreground">Stage {item.currentApprovalStage}</span>
                  <div className="flex flex-col items-start gap-1">
                    <span className={cn("font-mono", urgent ? "text-red-600" : "text-muted-foreground")}>{age}</span>
                    <SLABar pct={sla} urgent={urgent} />
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelected(item.id); }}
                    className="rounded border border-border px-2 py-1 text-center text-xs transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-95"
                  >
                    {lang === "ta" ? "திற" : "Open"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Review drawer */}
      {selectedItem && (
        <div className="flex flex-1 flex-col overflow-hidden bg-background">
          <div className="flex flex-shrink-0 items-center justify-between border-b border-border bg-card px-5 py-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {(lang === "ta" ? selectedItem.titleTa : selectedItem.titleEn) ?? selectedItem.titleEn ?? selectedItem.titleTa ?? "Untitled"}
              </h3>
              <div className="mt-0.5 flex items-center gap-2">
                <StatusChip status={selectedItem.status} />
                <span className="font-mono text-[11px] text-muted-foreground">Stage {selectedItem.currentApprovalStage}</span>
                <span className="font-mono text-[11px] text-muted-foreground">{lang === "ta" ? "வயது" : "Age"}: {cardAgeLabel(selectedItem.createdAt)}</span>
              </div>
            </div>
            <button onClick={() => setSelected(null)} aria-label="Close review panel" className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95">
              <XCircle size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {detailLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse rounded bg-muted" />)}
              </div>
            ) : detail ? (
              <>
                {/* Diff view */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded border border-border bg-card p-3">
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {lang === "ta" ? "மூல உள்ளீடு" : "Original Input"}
                    </div>
                    <p className="text-xs leading-relaxed text-foreground">{detail.bodyText ?? "—"}</p>
                  </div>
                  <div className="rounded border border-primary/30 bg-primary/5 p-3">
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {lang === "ta" ? "AI சுத்திகரிப்பு" : "AI Refined"}
                    </div>
                    <p className="text-xs leading-relaxed text-foreground" lang={lang === "ta" ? "ta" : "en"}>
                      {lang === "ta" ? (detail.aiRefinedTa ?? detail.bodyText ?? "—") : (detail.aiRefinedEn ?? detail.bodyText ?? "—")}
                    </p>
                  </div>
                </div>

                {/* Key facts */}
                {detail.keyFacts.length > 0 && (
                  <div className="rounded border border-border bg-card p-3">
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {lang === "ta" ? "முக்கிய உண்மைகள்" : "Key Facts"}
                    </div>
                    <ul className="list-disc space-y-1 pl-4 text-xs text-foreground">
                      {detail.keyFacts.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  </div>
                )}

                {/* Moderation flags */}
                {detail.moderationFlags.length > 0 && (
                  <div className="rounded border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/40">
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
                      <AlertTriangle size={13} aria-hidden="true" /> {lang === "ta" ? "மதிப்பீட்டு கொடிகள்" : "Moderation Flags"}
                    </div>
                    <div className="space-y-1">
                      {detail.moderationFlags.map((f, i) => (
                        <div key={i} className="text-xs text-amber-800 dark:text-amber-300">
                          <span className="font-bold uppercase">{f.type}</span>: {f.suggestion}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : null}

            {/* Comment box */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-foreground">
                {lang === "ta" ? "கருத்து (திரும்பு / நிராகரிப்புக்கு தேவை)" : "Comment (required for Return / Reject)"}
              </label>
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full resize-none rounded border border-border bg-input px-3 py-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                placeholder={lang === "ta" ? "கருத்தை உள்ளிடவும்…" : "Enter comment…"}
              />
              {actionError && <p className="mt-1 text-[11px] text-red-600">{actionError}</p>}
            </div>
          </div>

          {/* Action bar */}
          {filter === "pending_approval" && (
            <div className="flex flex-shrink-0 flex-wrap items-center gap-2 border-t border-border bg-card px-5 py-3">
              <button
                onClick={() => approveMut.mutate("approve")}
                disabled={isMutating}
                className="flex items-center gap-1.5 rounded bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 active:scale-[0.98]"
              >
                <CheckCircle2 size={13} aria-hidden="true" /> {lang === "ta" ? "அனுமதி" : "Approve"}
              </button>
              <button
                onClick={() => approveMut.mutate("approve_with_edits")}
                disabled={isMutating}
                className="flex items-center gap-1.5 rounded bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 active:scale-[0.98]"
              >
                <FileText size={13} aria-hidden="true" /> {lang === "ta" ? "திருத்தத்துடன் அனுமதி" : "Approve with Edits"}
              </button>
              <button
                onClick={() => returnMut.mutate()}
                disabled={isMutating || !comment.trim()}
                className="flex items-center gap-1.5 rounded border border-amber-400 px-3 py-2 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-50 disabled:opacity-50 active:scale-[0.98] dark:text-amber-400 dark:hover:bg-amber-950/40"
              >
                <RefreshCw size={13} aria-hidden="true" /> {lang === "ta" ? "திரும்பு" : "Return"}
              </button>
              <button
                onClick={() => rejectMut.mutate()}
                disabled={isMutating || !comment.trim()}
                className="flex items-center gap-1.5 rounded border border-red-300 px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50 active:scale-[0.98] dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                <XCircle size={13} aria-hidden="true" /> {lang === "ta" ? "நிராகரி" : "Reject"}
              </button>
            </div>
          )}
        </div>
      )}

      {!selectedItem && !isLoading && list.length > 0 && (
        <div className="hidden flex-1 items-center justify-center text-sm text-muted-foreground lg:flex" lang={lang}>
          {lang === "ta" ? "மறுஆய்விற்கு ஒரு அட்டையைத் திறக்கவும்" : "Select a card to review"}
        </div>
      )}
    </div>
  );
}
