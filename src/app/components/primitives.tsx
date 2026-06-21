import {
  Smile,
  Meh,
  Frown,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "./ui/utils";
import type { Sentiment } from "../data/mock";

/* ── Sentiment badge ──────────────────────────────────────────────────────
 * Icon + colored dot + accessible label. No emoji (skill §2 anti-emoji). */
const SENTIMENT_CFG: Record<
  Sentiment,
  { wrap: string; dot: string; icon: LucideIcon; label: string }
> = {
  positive: { wrap: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900", dot: "bg-emerald-500", icon: Smile, label: "Positive" },
  neutral: { wrap: "bg-muted text-muted-foreground border-border", dot: "bg-slate-400", icon: Meh, label: "Neutral" },
  negative: { wrap: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900", dot: "bg-red-500", icon: Frown, label: "Negative" },
};

export function SentimentBadge({
  sentiment,
  score,
  small,
}: {
  sentiment: Sentiment;
  score?: number;
  small?: boolean;
}) {
  const cfg = SENTIMENT_CFG[sentiment] ?? SENTIMENT_CFG.neutral;
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border font-mono font-medium",
        small ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs",
        cfg.wrap,
      )}
    >
      <span className={cn("rounded-full", small ? "w-1 h-1" : "w-1.5 h-1.5", cfg.dot)} />
      <Icon size={small ? 10 : 12} strokeWidth={2} aria-hidden="true" />
      <span className="sr-only">{cfg.label}{score !== undefined ? `, confidence ${score.toFixed(2)}` : ""}</span>
      <span aria-hidden="true">{score !== undefined ? score.toFixed(2) : cfg.label}</span>
    </span>
  );
}

/* ── Status chip ─────────────────────────────────────────────────────────── */
const STATUS_CFG: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900",
  scheduled: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900",
  failed: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-900",
  draft: "bg-muted text-muted-foreground border-border",
  pending: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900",
  approved: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900",
  rejected: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-900",
  recalled: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900",
};

export function StatusChip({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium", STATUS_CFG[status] ?? STATUS_CFG.draft)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

/* ── Platform chip ───────────────────────────────────────────────────────── */
const PLATFORM_BG: Record<string, string> = {
  FB: "bg-blue-600", IG: "bg-pink-500", X: "bg-zinc-900",
  YT: "bg-red-600", WhatsApp: "bg-emerald-600",
};
const PLATFORM_NAME: Record<string, string> = {
  FB: "Facebook", IG: "Instagram", X: "X (Twitter)", YT: "YouTube", WhatsApp: "WhatsApp",
};

export function PlatformChip({ platform, status }: { platform: string; status?: string }) {
  const dot = status === "failed" ? "bg-red-300" : status === "scheduled" ? "bg-amber-300" : "bg-emerald-300";
  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-mono font-medium text-white", PLATFORM_BG[platform] ?? "bg-slate-500")}
      title={`${PLATFORM_NAME[platform] ?? platform}${status ? ` — ${status}` : ""}`}
    >
      {platform}
      {status && <span className={cn("w-1.5 h-1.5 rounded-full", dot)} aria-hidden="true" />}
    </span>
  );
}

/* ── Prominence meter (5-dot) ────────────────────────────────────────────── */
export function ProminenceMeter({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`Prominence ${value} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={cn("w-2 h-2 rounded-full", i <= value ? "bg-amber-400" : "bg-muted")} aria-hidden="true" />
      ))}
    </span>
  );
}

/* ── SLA bar ─────────────────────────────────────────────────────────────── */
export function SLABar({ pct, urgent }: { pct: number; urgent: boolean }) {
  const color = urgent || pct > 90 ? "bg-red-500" : pct > 60 ? "bg-amber-400" : "bg-emerald-400";
  return (
    <div className="w-16 h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={Math.min(pct, 100)} aria-valuemin={0} aria-valuemax={100} aria-label="SLA elapsed">
      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${Math.min(pct, 100)}%` }} />
    </div>
  );
}

/* ── Empty state (skill §3 Rule 5) ───────────────────────────────────────── */
export function EmptyState({
  icon: Icon,
  title,
  hint,
  action,
}: {
  icon: LucideIcon;
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      {hint && <p className="mt-1 max-w-xs text-xs text-muted-foreground">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ── Skeleton row (loading) ──────────────────────────────────────────────── */
export function SkeletonRows({ rows = 5, cols = [2, 1, 1] }: { rows?: number; cols?: number[] }) {
  return (
    <div className="divide-y divide-border" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-3 px-5 py-3.5">
          {cols.map((flex, c) => (
            <div key={c} className="h-3 animate-pulse rounded bg-muted" style={{ flex }} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* Inline AlertTriangle re-export for callers that show urgency text. */
export { AlertTriangle };
