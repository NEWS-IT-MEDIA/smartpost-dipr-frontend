import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Newspaper,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Plus,
  CheckSquare,
  BarChart2,
  Zap,
  TrendingUp,
  RefreshCw,
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
import { useQuery } from "@tanstack/react-query";
import { cn } from "../components/ui/utils";
import { diprStats } from "../api/endpoints";
import { useAuth } from "../api/AuthContext";
import type { Lang } from "../lib/i18n";
import type { SentimentDay, TaskItem, AlertItem } from "../api/types";

const EMPTY_SENTIMENT: SentimentDay[] = [
  { day: "Mon", positive: 0, neutral: 0, negative: 0 },
  { day: "Tue", positive: 0, neutral: 0, negative: 0 },
  { day: "Wed", positive: 0, neutral: 0, negative: 0 },
  { day: "Thu", positive: 0, neutral: 0, negative: 0 },
  { day: "Fri", positive: 0, neutral: 0, negative: 0 },
  { day: "Sat", positive: 0, neutral: 0, negative: 0 },
  { day: "Sun", positive: 0, neutral: 0, negative: 0 },
];

export function Dashboard({ lang, onNav }: { lang: Lang; onNav: (id: string) => void }) {
  const { user } = useAuth();
  const { data: stats, isLoading, isError, refetch } = useQuery({
    queryKey: ["diprStats"],
    queryFn: diprStats,
    refetchInterval: 60_000,
  });

  const firstName = user?.firstName ?? "there";
  const greeting = lang === "ta" ? `காலை வணக்கம், ${firstName}` : `Good morning, ${firstName}`;
  const roleLabel = user?.roleDisplay ?? (user?.role === "admin" ? "Administrator" : user?.role ?? "");

  const pending = stats?.cards_pending ?? 0;
  const overdue = stats?.cards_overdue ?? 0;
  const publishedToday = stats?.published_today ?? 0;
  const delta = stats?.published_today_delta ?? 0;
  const negMentions = stats?.negative_mentions_today ?? 0;
  const spikeAlerts = stats?.negative_spike_alerts ?? 0;
  const printToday = stats?.print_items_today ?? 0;
  const frontPage = stats?.print_front_page_today ?? 0;

  const kpis = [
    {
      label: lang === "ta" ? "நிலுவை அட்டைகள்" : "Cards Pending",
      value: isLoading ? "—" : String(pending),
      sub: isLoading ? "" : overdue > 0 ? (lang === "ta" ? `${overdue} தாமதம்` : `${overdue} overdue`) : (lang === "ta" ? "SLA சரி" : "Within SLA"),
      Icon: Clock, tone: "amber", to: "approvals",
    },
    {
      label: lang === "ta" ? "இன்று வெளியிடப்பட்டது" : "Published Today",
      value: isLoading ? "—" : String(publishedToday),
      sub: isLoading ? "" : delta !== 0 ? (lang === "ta" ? `நேற்றை விட ${Math.abs(delta)} ${delta > 0 ? "அதிகம்" : "குறைவு"}` : `${Math.abs(delta)} ${delta > 0 ? "more" : "fewer"} than yesterday`) : (lang === "ta" ? "நேற்று போல் உள்ளது" : "Same as yesterday"),
      Icon: CheckCircle2, tone: "emerald", to: "published", up: delta > 0, down: delta < 0,
    },
    {
      label: lang === "ta" ? "எதிர்மறை குறிப்புகள்" : "Neg. Mentions",
      value: isLoading ? "—" : String(negMentions),
      sub: isLoading ? "" : spikeAlerts > 0 ? (lang === "ta" ? `${spikeAlerts} சிகர விழிப்பூட்டல்` : `${spikeAlerts} spike alert${spikeAlerts > 1 ? "s" : ""}`) : (lang === "ta" ? "சிகர இல்லை" : "No spikes"),
      Icon: AlertTriangle, tone: "red", to: "social",
    },
    {
      label: lang === "ta" ? "பத்திரிகை உருப்படிகள்" : "Print Items Today",
      value: isLoading ? "—" : String(printToday),
      sub: isLoading ? "" : frontPage > 0 ? (lang === "ta" ? `${frontPage} முன் பக்கம்` : `${frontPage} front-page`) : (lang === "ta" ? "முன் பக்கம் இல்லை" : "No front-page"),
      Icon: Newspaper, tone: "blue", to: "print",
    },
  ];

  const toneMap: Record<string, string> = {
    amber: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-400",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-400",
    red: "text-red-600 bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900 dark:text-red-400",
    blue: "text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900 dark:text-blue-400",
  };

  const tasks: TaskItem[] = stats?.my_tasks ?? [];
  const liveAlerts: AlertItem[] = stats?.live_alerts ?? [];
  const sentiment7d: SentimentDay[] = stats?.sentiment_7d?.length ? stats.sentiment_7d : EMPTY_SENTIMENT;
  const printDigest = stats?.print_digest_preview ?? {};

  const digestTones: Record<string, string> = {
    Clarification: "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950/40 dark:border-orange-900 dark:text-orange-400",
    Action: "text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-400",
    Information: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-400",
    Political: "text-slate-600 bg-slate-100 border-slate-200 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300",
    Editorial: "text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:border-purple-900 dark:text-purple-400",
    Article: "text-zinc-600 bg-zinc-100 border-zinc-200 dark:bg-zinc-800/60 dark:border-zinc-700 dark:text-zinc-300",
  };

  return (
    <div className="h-full space-y-5 overflow-y-auto p-5">
      {/* Greeting */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground" lang={lang}>
            {greeting}
          </h2>
          <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground" lang={lang}>
            <span>{roleLabel}</span>
            {isError && (
              <button onClick={() => refetch()} className="flex items-center gap-1 text-red-500 hover:text-red-700">
                <RefreshCw size={11} /> {lang === "ta" ? "மீண்டும் முயல்க" : "Retry"}
              </button>
            )}
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
        {kpis.map(({ label, value, sub, Icon, tone, to, up, down }) => (
          <button
            key={label}
            onClick={() => onNav(to)}
            className={cn("group rounded border p-3 text-left transition-all hover:shadow-sm active:scale-[0.99]", toneMap[tone])}
          >
            <div className="mb-2 flex items-center justify-between">
              <Icon size={16} strokeWidth={2} aria-hidden="true" />
              <ArrowRight size={12} className="opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
            </div>
            <div className={cn("font-mono text-xl font-bold", isLoading && "animate-pulse opacity-50")}>{value}</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground" lang={lang}>{label}</div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground" lang={lang}>
              {up && <ArrowUp size={9} className="text-emerald-500" aria-hidden="true" />}
              {down && <ArrowDown size={9} className="text-red-500" aria-hidden="true" />}
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
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => <div key={i} className="h-8 animate-pulse rounded bg-muted" />)}
            </div>
          ) : tasks.length === 0 ? (
            <p className="text-xs text-muted-foreground" lang={lang}>
              {lang === "ta" ? "பணிகள் இல்லை" : "No pending tasks"}
            </p>
          ) : (
            <ul className="space-y-2">
              {tasks.map((task, i) => (
                <li key={i} className="flex items-start gap-2 rounded bg-muted/50 p-2">
                  <span
                    className={cn("mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full",
                      task.type === "urgent" ? "bg-red-500" : task.type === "revision" ? "bg-amber-400" : "bg-blue-500")}
                    aria-hidden="true"
                  />
                  <span className="text-xs text-foreground">{task.text}</span>
                </li>
              ))}
            </ul>
          )}
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
            <AreaChart data={sentiment7d} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
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
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2].map((i) => <div key={i} className="h-8 animate-pulse rounded bg-muted" />)}
              </div>
            ) : liveAlerts.length === 0 ? (
              <p className="text-xs text-muted-foreground" lang={lang}>
                {lang === "ta" ? "விழிப்பூட்டல்கள் இல்லை" : "No active alerts"}
              </p>
            ) : (
              <div className="space-y-2">
                {liveAlerts.slice(0, 3).map((a) => (
                  <div
                    key={a.id}
                    className={cn(
                      "flex items-start gap-2 rounded p-2 text-xs",
                      a.type === "negative_spike"
                        ? "border border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                        : "border border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300",
                    )}
                  >
                    {a.type === "negative_spike"
                      ? <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
                      : <TrendingUp size={12} className="mt-0.5 flex-shrink-0" aria-hidden="true" />}
                    <span>
                      {a.keyword && <strong>{a.keyword}</strong>}
                      {a.platform && ` (${a.platform})`}
                      {a.spike_pct != null && ` +${a.spike_pct}%`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section className="rounded border border-border bg-card p-4">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-foreground" lang={lang}>
              <Newspaper size={13} className="text-primary" aria-hidden="true" />
              {lang === "ta" ? "இன்றைய பத்திரிகை சுருக்கம்" : "Today's Print Digest"}
            </h3>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => <div key={i} className="flex items-center justify-between py-1"><div className="h-5 w-24 animate-pulse rounded bg-muted" /><div className="h-4 w-6 animate-pulse rounded bg-muted" /></div>)}
              </div>
            ) : Object.keys(printDigest).length === 0 ? (
              <p className="text-xs text-muted-foreground" lang={lang}>
                {lang === "ta" ? "இன்று கட்டுரைகள் இல்லை" : "No clippings today"}
              </p>
            ) : (
              Object.entries(printDigest).map(([label, count]) => (
                <div key={label} className="flex items-center justify-between py-1">
                  <span className={cn("rounded border px-1.5 py-0.5 text-[10px] font-medium", digestTones[label] ?? digestTones.Article)}>{label}</span>
                  <span className="font-mono text-xs font-medium text-foreground">{count}</span>
                </div>
              ))
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
