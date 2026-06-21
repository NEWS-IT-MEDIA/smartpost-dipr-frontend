import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Newspaper,
  ArrowRight,
  ArrowUp,
  Plus,
  CheckSquare,
  BarChart2,
  Zap,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "../components/ui/utils";
import { sentimentData, currentUser } from "../data/mock";
import type { Lang } from "../lib/i18n";

export function Dashboard({ lang, onNav }: { lang: Lang; onNav: (id: string) => void }) {
  const kpis = [
    { label: lang === "ta" ? "நிலுவை அட்டைகள்" : "Cards Pending", value: "4", sub: lang === "ta" ? "2 தாமதம்" : "2 overdue", Icon: Clock, tone: "amber", to: "approvals" },
    { label: lang === "ta" ? "இன்று வெளியிடப்பட்டது" : "Published Today", value: "12", sub: lang === "ta" ? "நேற்றை விட 3 அதிகம்" : "3 more than yesterday", Icon: CheckCircle2, tone: "emerald", to: "published", up: true },
    { label: lang === "ta" ? "எதிர்மறை குறிப்புகள்" : "Neg. Mentions", value: "3", sub: lang === "ta" ? "1 சிகர விழிப்பூட்டல்" : "1 spike alert", Icon: AlertTriangle, tone: "red", to: "social" },
    { label: lang === "ta" ? "பத்திரிகை உருப்படிகள்" : "Print Items Today", value: "18", sub: lang === "ta" ? "4 முன் பக்கம்" : "4 front-page", Icon: Newspaper, tone: "blue", to: "print" },
  ];

  const toneMap: Record<string, string> = {
    amber: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-400",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-400",
    red: "text-red-600 bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900 dark:text-red-400",
    blue: "text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900 dark:text-blue-400",
  };

  const tasks = [
    { text: lang === "ta" ? '"இலவச பேருந்து திட்டம்" — திருத்தம் தேவை' : '"Free Bus Scheme" card — revision needed', type: "revision" },
    { text: lang === "ta" ? "3 உருப்படிகள் உங்கள் அங்கீகாரத்திற்கு" : "3 items awaiting your approval", type: "approval" },
    { text: lang === "ta" ? "விவசாயி மானியம் — SLA மீறப்பட்டது 1நா" : "Farmer Subsidy card — SLA breached 1d", type: "urgent" },
  ];

  const alerts = [
    { text: lang === "ta" ? "எதிர்மறை சிகரம்: போக்குவரத்து துறை (Polimer, X)" : "Negative spike: Transport dept (Polimer, X)", type: "crisis" },
    { text: lang === "ta" ? "திட்டம் தட்டுப்படுகிறது: சுகாதார திட்டம் (+240%)" : "Scheme trending: Health scheme (+240% vol.)", type: "info" },
  ];

  return (
    <div className="h-full space-y-5 overflow-y-auto p-5">
      {/* Greeting */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground" lang={lang}>
            {lang === "ta" ? "காலை வணக்கம், ரவி" : "Good morning, Ravi"}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground" lang={lang}>
            {lang === "ta" ? `${currentUser.roleTa} · வியாழன், 19 ஜூன் 2026` : `${currentUser.roleEn} · Thursday, 19 Jun 2026`}
          </p>
        </div>
        <button
          onClick={() => onNav("create")}
          className="flex items-center gap-2 rounded bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98]"
        >
          <Plus size={13} aria-hidden="true" />
          {lang === "ta" ? "அட்டை உருவாக்கு" : "Create News Card"}
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map(({ label, value, sub, Icon, tone, to, up }) => (
          <button
            key={label}
            onClick={() => onNav(to)}
            className={cn("group rounded border p-3 text-left transition-all hover:shadow-sm active:scale-[0.99]", toneMap[tone])}
          >
            <div className="mb-2 flex items-center justify-between">
              <Icon size={16} strokeWidth={2} aria-hidden="true" />
              <ArrowRight size={12} className="opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
            </div>
            <div className="font-mono text-xl font-bold">{value}</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground" lang={lang}>{label}</div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground" lang={lang}>
              {up && <ArrowUp size={9} className="text-emerald-500" aria-hidden="true" />}
              {sub}
            </div>
          </button>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* My tasks */}
        <section className="rounded border border-border bg-card p-4">
          <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-foreground" lang={lang}>
            <CheckSquare size={13} className="text-primary" aria-hidden="true" />
            {lang === "ta" ? "என் பணிகள்" : "My Tasks"}
          </h3>
          <ul className="space-y-2">
            {tasks.map((task, i) => (
              <li key={i} className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span
                  className={cn("mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full", task.type === "urgent" ? "bg-red-500" : task.type === "revision" ? "bg-amber-400" : "bg-blue-500")}
                  aria-hidden="true"
                />
                <span className="text-xs text-foreground" lang={lang}>{task.text}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => onNav("approvals")}
            className="mt-3 flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
            lang={lang}
          >
            {lang === "ta" ? "அனைத்தும் காண்க" : "View all tasks"} <ArrowRight size={10} aria-hidden="true" />
          </button>
        </section>

        {/* Sentiment chart */}
        <section className="rounded border border-border bg-card p-4">
          <h3 className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-foreground" lang={lang}>
            <BarChart2 size={13} className="text-primary" aria-hidden="true" />
            {lang === "ta" ? "உணர்வு நிலை (7 நாட்கள்)" : "Sentiment Trend (7 days)"}
          </h3>
          <div className="mb-2 flex gap-3">
            {[["Pos", "var(--chart-3)"], ["Neu", "var(--chart-5)"], ["Neg", "var(--chart-4)"]].map(([l, c]) => (
              <span key={l} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ background: c }} aria-hidden="true" />
                {l}
              </span>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={110}>
            <AreaChart data={sentimentData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} />
              <Tooltip contentStyle={{ fontSize: 11, padding: "4px 8px", background: "var(--popover)", border: "1px solid var(--border)", color: "var(--popover-foreground)" }} />
              <Area type="monotone" dataKey="positive" stackId="1" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.12} strokeWidth={1.5} />
              <Area type="monotone" dataKey="neutral" stackId="1" stroke="var(--chart-5)" fill="var(--chart-5)" fillOpacity={0.12} strokeWidth={1.5} />
              <Area type="monotone" dataKey="negative" stackId="1" stroke="var(--chart-4)" fill="var(--chart-4)" fillOpacity={0.12} strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </section>

        {/* Alerts + Print digest */}
        <div className="space-y-3">
          <section className="rounded border border-border bg-card p-4">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-foreground" lang={lang}>
              <Zap size={13} className="text-amber-500" aria-hidden="true" />
              {lang === "ta" ? "நேரடி விழிப்பூட்டல்கள்" : "Live Alerts"}
            </h3>
            <div className="space-y-2">
              {alerts.map((a, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-start gap-2 rounded p-2 text-xs",
                    a.type === "crisis"
                      ? "border border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                      : "border border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300",
                  )}
                  lang={lang}
                >
                  {a.type === "crisis" ? <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" aria-hidden="true" /> : <TrendingUp size={12} className="mt-0.5 flex-shrink-0" aria-hidden="true" />}
                  {a.text}
                </div>
              ))}
            </div>
          </section>
          <section className="rounded border border-border bg-card p-4">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-foreground" lang={lang}>
              <Newspaper size={13} className="text-primary" aria-hidden="true" />
              {lang === "ta" ? "இன்றைய பத்திரிகை சுருக்கம்" : "Today's Print Digest"}
            </h3>
            {[
              ["Clarification", 2, "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950/40 dark:border-orange-900 dark:text-orange-400"],
              ["Action", 5, "text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-400"],
              ["Information", 8, "text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-400"],
              ["Political", 3, "text-slate-600 bg-slate-100 border-slate-200 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300"],
            ].map(([label, count, cls]) => (
              <div key={label as string} className="flex items-center justify-between py-1">
                <span className={cn("rounded border px-1.5 py-0.5 text-[10px] font-medium", cls as string)}>{label as string}</span>
                <span className="font-mono text-xs font-medium text-foreground">{count as number}</span>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
