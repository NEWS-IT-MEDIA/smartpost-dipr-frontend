import { useState } from "react";
import { AlertTriangle, CheckCircle2, Send, Download } from "lucide-react";
import { cn } from "../components/ui/utils";
import { alertItems } from "../data/mock";
import type { Lang } from "../lib/i18n";

const TABS = ["alerts", "digests"] as const;

export function AlertsDigests({ lang }: { lang: Lang }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("alerts");

  const sev: Record<string, { wrap: string; icon: string }> = {
    crisis: { wrap: "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/40", icon: "text-red-600 dark:text-red-400" },
    warning: { wrap: "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40", icon: "text-amber-600 dark:text-amber-400" },
    info: { wrap: "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40", icon: "text-blue-600 dark:text-blue-400" },
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-shrink-0 items-center gap-1 border-b border-border bg-card px-5 py-3" role="tablist" aria-label="Alerts and digests">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn("rounded px-3 py-1.5 text-xs font-medium capitalize transition-colors active:scale-[0.98]", tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}
          >
            {lang === "ta" ? { alerts: "விழிப்பூட்டல்கள்", digests: "சுருக்கங்கள்" }[t] : t}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-5">
        {tab === "alerts" &&
          alertItems.map((a) => (
            <div key={a.id} className={cn("rounded border p-4", sev[a.severity].wrap)}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={15} className={cn("mt-0.5 flex-shrink-0", sev[a.severity].icon)} aria-hidden="true" />
                  <div>
                    <div className="text-sm font-semibold text-foreground" lang={lang}>{lang === "ta" ? a.titleTa : a.title}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {lang === "ta" ? "அளவு" : "Volume"}: <span className="font-mono font-bold text-foreground">{a.volume}</span> · {a.time} · {lang === "ta" ? "அனுப்பப்பட்டது" : "Routed to"}: {a.routed}
                    </div>
                  </div>
                </div>
                <div className="flex flex-shrink-0 gap-2">
                  {!a.acknowledged ? (
                    <>
                      <button className="rounded border border-border bg-card/60 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-card active:scale-95">
                        {lang === "ta" ? "உறுதிப்படுத்து" : "Acknowledge"}
                      </button>
                      <button className="rounded border border-border bg-card/60 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-card active:scale-95">
                        {lang === "ta" ? "அதிகரி" : "Escalate"}
                      </button>
                    </>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 size={12} aria-hidden="true" /> {lang === "ta" ? "உறுதிப்படுத்தப்பட்டது" : "Acknowledged"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

        {tab === "digests" &&
          ["Daily Digest — 19 Jun 2026", "Weekly Digest — W24 2026"].map((title) => (
            <div key={title} className="rounded border border-border bg-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 rounded border border-border px-2.5 py-1 text-xs transition-colors hover:bg-muted active:scale-95">
                    <Send size={11} aria-hidden="true" /> {lang === "ta" ? "துறை தலைவர்களுக்கு" : "Send to Dept Heads"}
                  </button>
                  <button className="flex items-center gap-1 rounded border border-border px-2.5 py-1 text-xs transition-colors hover:bg-muted active:scale-95">
                    <Download size={11} aria-hidden="true" /> PDF
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {[["Social", "1,240 mentions", "62% positive"], ["Print", "18 govt items", "4 front-page"], ["Cards", "12 published", "3 scheduled"]].map(([cat, val, sub]) => (
                  <div key={cat} className="rounded bg-muted/50 p-2.5 text-center">
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{cat}</div>
                    <div className="mt-1 font-mono text-sm font-bold text-foreground">{val}</div>
                    <div className="text-[10px] text-muted-foreground">{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
