import { useState } from "react";
import {
  Smile,
  Meh,
  Frown,
  TrendingUp,
  AlertTriangle,
  Share2,
  ExternalLink,
  Inbox,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn } from "../components/ui/utils";
import { SentimentBadge, PlatformChip, EmptyState, SkeletonRows } from "../components/primitives";
import { sentimentData, channelShareData, socialMentions } from "../data/mock";
import { useSimulatedLoad } from "../lib/useSimulatedLoad";
import type { Lang } from "../lib/i18n";

const DEPTS = ["All", "Transport", "Health", "Agriculture", "Education", "Welfare"];
const TABS = ["feed", "trends", "channels", "digests"] as const;

export function SocialWatch({ lang }: { lang: Lang }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("feed");
  const [dept, setDept] = useState("All");
  const loading = useSimulatedLoad();

  const totals = { positive: 62, neutral: 25, negative: 13, volume: 1240 };
  const feed = socialMentions.filter((m) => dept === "All" || m.dept === dept);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Summary bar — icon-driven, no emoji */}
      <div className="flex-shrink-0 border-b border-border bg-card px-5 py-3">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400">
              <Smile size={16} aria-hidden="true" /> <span className="font-mono font-bold">{totals.positive}%</span>
            </span>
            <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <Meh size={16} aria-hidden="true" /> <span className="font-mono font-bold">{totals.neutral}%</span>
            </span>
            <span className="flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400">
              <Frown size={16} aria-hidden="true" /> <span className="font-mono font-bold">{totals.negative}%</span>
            </span>
          </div>
          <div className="border-l border-border pl-4 font-mono text-xs text-muted-foreground">
            {lang === "ta" ? "அளவு" : "Volume"}: <span className="font-bold text-foreground">{totals.volume.toLocaleString()}</span>
            <TrendingUp size={12} className="ml-1 inline text-emerald-500" aria-hidden="true" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              aria-label={lang === "ta" ? "துறை வடிகட்டி" : "Filter by department"}
              className="rounded border border-border bg-card px-2 py-1.5 text-xs text-foreground outline-none"
            >
              {DEPTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select aria-label="Range" className="rounded border border-border bg-card px-2 py-1.5 text-xs text-foreground outline-none">
              <option>7 days</option><option>30 days</option><option>Today</option>
            </select>
          </div>
        </div>

        {/* Charts */}
        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{lang === "ta" ? "உணர்வு போக்கு" : "Sentiment Trend"}</div>
            <ResponsiveContainer width="100%" height={70}>
              <LineChart data={sentimentData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} />
                <Tooltip contentStyle={{ fontSize: 10, background: "var(--popover)", border: "1px solid var(--border)", color: "var(--popover-foreground)" }} />
                <Line type="monotone" dataKey="positive" stroke="var(--chart-3)" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="negative" stroke="var(--chart-4)" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{lang === "ta" ? "சேனல் பங்கு" : "Share of Voice by Channel"}</div>
            <div className="flex items-center gap-3">
              <ResponsiveContainer width={70} height={70}>
                <PieChart>
                  <Pie data={channelShareData} dataKey="value" cx="50%" cy="50%" innerRadius={22} outerRadius={33} strokeWidth={1}>
                    {channelShareData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1">
                {channelShareData.map((c) => (
                  <div key={c.name} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: c.color }} aria-hidden="true" />
                    {c.name} <span className="ml-1 font-mono text-foreground">{c.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-shrink-0 items-center gap-1 border-b border-border bg-card px-5 py-2" role="tablist" aria-label="Social watch view">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn("rounded px-3 py-1.5 text-xs font-medium capitalize transition-colors active:scale-[0.98]", tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}
          >
            {lang === "ta" ? { feed: "நேரடி ஊட்டம்", trends: "போக்குகள்", channels: "சேனல்கள்", digests: "சுருக்கங்கள்" }[t] : t}
          </button>
        ))}
        <button className="ml-auto flex items-center gap-1.5 rounded border border-red-300 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 active:scale-[0.98] dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          <AlertTriangle size={11} aria-hidden="true" /> {lang === "ta" ? "விழிப்பூட்டல்கள் (7)" : "Alerts (7)"}
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {tab !== "feed" ? (
          <EmptyState
            icon={TrendingUp}
            title={lang === "ta" ? "விரைவில் வருகிறது" : "View coming soon"}
            hint={lang === "ta" ? "இந்த பகுதி தயாரிப்பில் உள்ளது." : `The ${tab} view is being prepared.`}
          />
        ) : loading ? (
          <SkeletonRows rows={5} cols={[1, 4]} />
        ) : feed.length === 0 ? (
          <EmptyState icon={Inbox} title={lang === "ta" ? "குறிப்புகள் இல்லை" : "No mentions"} hint={lang === "ta" ? "தேர்ந்தெடுத்த துறையில் எதுவும் இல்லை." : "Nothing for the selected department."} />
        ) : (
          feed.map((item) => (
            <article key={item.id} className="border-b border-border px-5 py-3.5 transition-colors hover:bg-muted/20">
              <div className="flex items-start gap-3">
                <SentimentBadge sentiment={item.sentiment} score={item.score} />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">{item.channel}</span>
                    <PlatformChip platform={item.platform} />
                    <span className="font-mono text-[11px] text-muted-foreground">{item.time}</span>
                    <span className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-secondary-foreground">{item.dept}</span>
                    {item.lowConfidence && (
                      <span className="flex items-center gap-1 rounded border border-orange-200 bg-orange-100 px-1.5 py-0.5 text-[10px] text-orange-700 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-300">
                        <AlertTriangle size={9} aria-hidden="true" /> {lang === "ta" ? "குறைந்த நம்பகத்தன்மை" : "Low confidence"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed text-foreground">{item.snippet}</p>
                </div>
                <div className="flex flex-shrink-0 gap-1.5">
                  <button className="flex items-center gap-1 rounded border border-border px-2 py-1 text-[10px] transition-colors hover:bg-muted active:scale-95" aria-label="Route to department head">
                    <Share2 size={10} aria-hidden="true" /> {lang === "ta" ? "அனுப்பு" : "Route"}
                  </button>
                  <button className="flex items-center gap-1 rounded border border-border px-2 py-1 text-[10px] transition-colors hover:bg-muted active:scale-95" aria-label="View original post">
                    <ExternalLink size={10} aria-hidden="true" /> {lang === "ta" ? "காண்க" : "View"}
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
