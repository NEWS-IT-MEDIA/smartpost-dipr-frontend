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
import { cn } from "../components/ui/utils";
import { StatusChip, SLABar, EmptyState, SkeletonRows } from "../components/primitives";
import { approvals } from "../data/mock";
import { useSimulatedLoad } from "../lib/useSimulatedLoad";
import type { Lang } from "../lib/i18n";

const FILTERS = ["pending", "approved", "rejected"] as const;
type FilterKey = (typeof FILTERS)[number];

export function Approvals({ lang }: { lang: Lang }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterKey>("pending");
  const loading = useSimulatedLoad();

  const list = approvals.filter((a) => a.status === filter);
  const selectedItem = list.find((a) => a.id === selected) ?? null;

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
                {f}
              </button>
            ))}
          </div>
          <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter size={12} aria-hidden="true" /> {list.length} {lang === "ta" ? "உருப்படிகள்" : "items"}
          </span>
        </div>

        {/* Table header */}
        <div className="grid flex-shrink-0 grid-cols-[1fr_80px_80px_72px_72px] gap-2 border-b border-border bg-muted/50 px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          <span>{lang === "ta" ? "அட்டை" : "Card"}</span>
          <span>{lang === "ta" ? "துறை" : "Dept"}</span>
          <span>{lang === "ta" ? "நிலை" : "Stage"}</span>
          <span>{lang === "ta" ? "வயது" : "Age"}</span>
          <span className="sr-only">Action</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <SkeletonRows rows={4} cols={[3, 1, 1, 1]} />
          ) : list.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title={lang === "ta" ? "உருப்படிகள் இல்லை" : `No ${filter} cards`}
              hint={lang === "ta" ? "இந்த வடிகட்டியில் தற்போது எதுவும் இல்லை." : "Nothing in this queue right now."}
            />
          ) : (
            list.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelected(item.id === selected ? null : item.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSelected(item.id === selected ? null : item.id)}
                className={cn(
                  "grid cursor-pointer grid-cols-[1fr_80px_80px_72px_72px] items-center gap-2 border-b border-border px-4 py-3 text-xs transition-colors",
                  selected === item.id ? "border-l-2 border-l-primary bg-primary/5" : "hover:bg-muted/40",
                )}
              >
                <div className="min-w-0">
                  <div className="truncate font-medium text-foreground" lang={lang}>{lang === "ta" ? item.titleTa : item.title}</div>
                  {item.urgent && (
                    <span className="mt-0.5 flex items-center gap-1 font-mono text-[10px] text-red-600">
                      <AlertTriangle size={9} aria-hidden="true" /> {lang === "ta" ? "SLA மீறப்பட்டது" : "SLA breached"}
                    </span>
                  )}
                </div>
                <span className="truncate text-muted-foreground">{item.dept}</span>
                <span className="truncate font-mono text-muted-foreground">{item.stage}</span>
                <div className="flex flex-col items-start gap-1">
                  <span className={cn("font-mono", item.urgent ? "text-red-600" : "text-muted-foreground")}>{item.age}</span>
                  <SLABar pct={item.sla} urgent={item.urgent} />
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelected(item.id); }}
                  className="rounded border border-border px-2 py-1 text-center text-xs transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-95"
                >
                  {lang === "ta" ? "திற" : "Open"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Review drawer */}
      {selectedItem && (
        <div className="flex flex-1 flex-col overflow-hidden bg-background">
          <div className="flex flex-shrink-0 items-center justify-between border-b border-border bg-card px-5 py-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground" lang={lang}>{lang === "ta" ? selectedItem.titleTa : selectedItem.title}</h3>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground">{selectedItem.dept}</span>
                <StatusChip status={selectedItem.status} />
                <span className="font-mono text-[11px] text-muted-foreground">{lang === "ta" ? "வயது" : "Age"}: {selectedItem.age}</span>
              </div>
            </div>
            <button onClick={() => setSelected(null)} aria-label="Close review panel" className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95">
              <XCircle size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {/* Diff view */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: lang === "ta" ? "மூல உள்ளீடு" : "Original Input", body: "Metro expansion phase 3 announced. 26 stations, 45 km. Benefits Chennai commuters.", primary: false },
                { label: lang === "ta" ? "AI சுத்திகரிப்பு" : "AI Refined", body: "The Tamil Nadu Government today formally announced the launch of Metro Rail Phase 3 expansion, comprising 26 new stations spanning 45 km, significantly enhancing suburban connectivity across Chennai.", primary: true },
              ].map((col) => (
                <div key={col.label} className={cn("rounded border p-3", col.primary ? "border-primary/30 bg-primary/5" : "border-border bg-card")}>
                  <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{col.label}</div>
                  <p className="text-xs leading-relaxed text-foreground">{col.body}</p>
                </div>
              ))}
            </div>

            {/* Version history */}
            <div className="rounded border border-border bg-card p-3">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{lang === "ta" ? "பதிப்பு வரலாறு" : "Version History"}</div>
              {[
                { v: "v3", author: "AI Engine", time: "2h ago", note: "Auto-refined + honorific fix" },
                { v: "v2", author: "Ravi Kumar", time: "3h ago", note: "Added source reference G.O. 142" },
                { v: "v1", author: "Ravi Kumar", time: "5h ago", note: "Initial submission" },
              ].map((v) => (
                <div key={v.v} className="flex items-start gap-2.5 border-b border-border py-1.5 last:border-0">
                  <span className="flex-shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">{v.v}</span>
                  <div className="flex-1 text-xs">
                    <span className="font-medium text-foreground">{v.author}</span>
                    <span className="text-muted-foreground"> · {v.time}</span>
                    <div className="text-muted-foreground">{v.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action bar */}
          <div className="flex flex-shrink-0 flex-wrap items-center gap-2 border-t border-border bg-card px-5 py-3">
            <button className="flex items-center gap-1.5 rounded bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 active:scale-[0.98]">
              <CheckCircle2 size={13} aria-hidden="true" /> {lang === "ta" ? "அனுமதி" : "Approve"}
            </button>
            <button className="flex items-center gap-1.5 rounded bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 active:scale-[0.98]">
              <FileText size={13} aria-hidden="true" /> {lang === "ta" ? "திருத்தத்துடன் அனுமதி" : "Approve with Edits"}
            </button>
            <button className="flex items-center gap-1.5 rounded border border-amber-400 px-3 py-2 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-50 active:scale-[0.98] dark:text-amber-400 dark:hover:bg-amber-950/40">
              <RefreshCw size={13} aria-hidden="true" /> {lang === "ta" ? "திருப்பு" : "Return"}
            </button>
            <button className="flex items-center gap-1.5 rounded border border-red-300 px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 active:scale-[0.98] dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40">
              <XCircle size={13} aria-hidden="true" /> {lang === "ta" ? "நிராகரி" : "Reject"}
            </button>
          </div>
        </div>
      )}

      {!selectedItem && !loading && list.length > 0 && (
        <div className="hidden flex-1 items-center justify-center text-sm text-muted-foreground lg:flex" lang={lang}>
          {lang === "ta" ? "மறுஆய்விற்கு ஒரு அட்டையைத் திறக்கவும்" : "Select a card to review"}
        </div>
      )}
    </div>
  );
}
