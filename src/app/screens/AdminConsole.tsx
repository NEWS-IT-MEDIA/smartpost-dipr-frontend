import { User, Layers, Globe, Sparkles, FileText } from "lucide-react";
import { auditEntries } from "../data/mock";
import type { Lang } from "../lib/i18n";

export function AdminConsole({ lang }: { lang: Lang }) {
  const sections = [
    { id: "users", label: "Users & Roles", labelTa: "பயனர்கள் & பதவிகள்", Icon: User, count: "142" },
    { id: "templates", label: "Templates", labelTa: "வார்ப்புருக்கள்", Icon: Layers, count: "28" },
    { id: "sources", label: "Sources", labelTa: "மூலங்கள்", Icon: Globe, count: "34" },
    { id: "ai", label: "AI Rules", labelTa: "AI விதிகள்", Icon: Sparkles, count: "12" },
    { id: "audit", label: "Audit Log", labelTa: "தணிக்கை பதிவு", Icon: FileText, count: "9,241" },
  ];

  return (
    <div className="h-full space-y-4 overflow-y-auto p-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {sections.map(({ id, label, labelTa, Icon, count }) => (
          <button key={id} className="group rounded border border-border bg-card p-4 text-left transition-all hover:border-primary/40 hover:shadow-sm active:scale-[0.99]">
            <Icon size={15} className="mb-2 text-primary transition-colors group-hover:text-amber-500" aria-hidden="true" />
            <div className="text-sm font-semibold text-foreground" lang={lang}>{lang === "ta" ? labelTa : label}</div>
            <div className="mt-1 font-mono text-xl font-bold text-muted-foreground">{count}</div>
          </button>
        ))}
      </div>

      <div className="rounded border border-border bg-card p-4">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground" lang={lang}>
          {lang === "ta" ? "சமீபத்திய தணிக்கை பதிவுகள்" : "Recent Audit Entries"}
        </div>
        {auditEntries.map((entry, i) => (
          <div key={i} className="flex items-start gap-3 border-b border-border py-2 text-xs last:border-0">
            <span className="flex-shrink-0 rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-medium text-primary">{entry.action}</span>
            <div className="min-w-0 flex-1">
              <span className="font-medium text-foreground">{entry.user}</span>
              <span className="text-muted-foreground"> · {entry.target}</span>
            </div>
            <span className="flex-shrink-0 font-mono text-muted-foreground">{entry.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
