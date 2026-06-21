import { cn } from "../components/ui/utils";
import type { Lang } from "../lib/i18n";

type Slot = { day: number; title: string; dept: string; tone: string };

const SLOTS: Slot[] = [
  { day: 3, title: "Pongal Recap", dept: "Welfare", tone: "amber" },
  { day: 8, title: "Health Camp", dept: "Health", tone: "emerald" },
  { day: 12, title: "Subsidy Update", dept: "Agriculture", tone: "blue" },
  { day: 19, title: "Metro Phase 3", dept: "Transport", tone: "navy" },
  { day: 19, title: "Fisher Relief", dept: "Welfare", tone: "amber" },
  { day: 24, title: "Laptop Scheme", dept: "Education", tone: "emerald" },
  { day: 27, title: "Eco Policy", dept: "Environment", tone: "blue" },
];

const TONE: Record<string, string> = {
  amber: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900",
  emerald: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900",
  blue: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900",
  navy: "bg-primary/15 text-primary border-primary/20",
};

const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_TA = ["ஞா", "தி", "செ", "பு", "வி", "வெ", "ச"];

export function CalendarScreen({ lang }: { lang: Lang }) {
  // June 2026 starts on a Monday → 1 leading blank.
  const cells = [null, ...Array.from({ length: 30 }, (_, i) => i + 1)];
  const today = 19;

  return (
    <div className="h-full overflow-y-auto p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground" lang={lang}>{lang === "ta" ? "ஜூன் 2026" : "June 2026"}</h2>
        <div className="flex flex-wrap gap-2 text-[11px]">
          {[["Welfare", "amber"], ["Health", "emerald"], ["Transport", "navy"], ["Education", "emerald"], ["Agriculture", "blue"], ["Environment", "blue"]].slice(0, 5).map(([d, t]) => (
            <span key={d} className={cn("rounded border px-1.5 py-0.5", TONE[t])}>{d}</span>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded border border-border bg-card">
        <div className="grid grid-cols-7 border-b border-border bg-muted/50">
          {(lang === "ta" ? WEEKDAYS_TA : WEEKDAYS_EN).map((d) => (
            <div key={d} className="px-2 py-1.5 text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, i) => (
            <div key={i} className={cn("min-h-[88px] border-b border-r border-border p-1.5 last:border-r-0", day === null && "bg-muted/20")}>
              {day !== null && (
                <>
                  <div className={cn("mb-1 inline-flex h-5 w-5 items-center justify-center rounded-full font-mono text-[11px]", day === today ? "bg-primary font-bold text-primary-foreground" : "text-muted-foreground")}>{day}</div>
                  <div className="space-y-1">
                    {SLOTS.filter((s) => s.day === day).map((s, j) => (
                      <button key={j} className={cn("block w-full truncate rounded border px-1 py-0.5 text-left text-[9px] font-medium transition-transform hover:scale-[1.02] active:scale-95", TONE[s.tone])} title={`${s.title} · ${s.dept}`}>
                        {s.title}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground" lang={lang}>
        {lang === "ta" ? "துறை வாரியாக நிற வண்ணம். ஒரு இடத்தைக் கிளிக் செய்து அட்டையைத் திறக்கவும்; வெளியீட்டாளர்கள் இழுத்து மறு திட்டமிடலாம்." : "Color-coded by department. Click a slot to open the card; publishers can drag to reschedule."}
      </p>
    </div>
  );
}
