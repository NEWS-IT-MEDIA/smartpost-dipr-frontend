import { useState } from "react";
import { AlertTriangle, Newspaper, Share2, Download, ExternalLink, Search } from "lucide-react";
import { cn } from "../components/ui/utils";
import { SentimentBadge, ProminenceMeter, EmptyState } from "../components/primitives";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { printClippings } from "../data/mock";
import type { Lang } from "../lib/i18n";

const TABS = ["clippings", "digest", "archive"] as const;
const TAXONOMY = ["Clarification", "Action", "Information", "Political", "Editorial"];

export function PrintWatch({ lang }: { lang: Lang }) {
  const [selected, setSelected] = useState(1);
  const [tab, setTab] = useState<(typeof TABS)[number]>("clippings");
  const [taxonomy, setTaxonomy] = useState<string>(printClippings[0].type);
  const clip = printClippings.find((c) => c.id === selected)!;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Summary */}
      <div className="flex flex-shrink-0 flex-wrap items-center gap-5 border-b border-border bg-card px-5 py-3">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <span className="font-medium text-foreground" lang={lang}>{lang === "ta" ? "இன்று: 18 அரசு உருப்படிகள்" : "Today: 18 govt items"}</span>
          <span className="font-medium text-blue-700 dark:text-blue-400" lang={lang}>{lang === "ta" ? "முன் பக்கம்: 4" : "Front-page: 4"}</span>
          <span className="flex items-center gap-1 font-medium text-red-600 dark:text-red-400" lang={lang}>
            <AlertTriangle size={12} aria-hidden="true" /> {lang === "ta" ? "எதிர்மறை: 2" : "Negative: 2"}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <select aria-label="Paper" className="rounded border border-border bg-card px-2 py-1.5 text-xs text-foreground outline-none">
            <option>All Papers</option><option>Daily Thanthi</option><option>Dinamalar</option><option>The Hindu</option>
          </select>
          <select aria-label="Edition" className="rounded border border-border bg-card px-2 py-1.5 text-xs text-foreground outline-none">
            <option>Chennai</option><option>Madurai</option><option>Coimbatore</option>
          </select>
          <input type="date" defaultValue="2026-06-19" aria-label="Date" className="rounded border border-border bg-card px-2 py-1.5 text-xs text-foreground outline-none" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-shrink-0 items-center gap-1 border-b border-border bg-card px-5 py-2" role="tablist" aria-label="Print watch view">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn("rounded px-3 py-1.5 text-xs font-medium capitalize transition-colors active:scale-[0.98]", tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}
          >
            {lang === "ta" ? { clippings: "கட்டுரைகள்", digest: "சுருக்கம்", archive: "காப்பகம்" }[t] : t}
          </button>
        ))}
      </div>

      {tab === "archive" ? (
        <EmptyState icon={Search} title={lang === "ta" ? "காப்பக தேடல்" : "Archive search"} hint={lang === "ta" ? "தேதி, பத்திரிகை, துறை மூலம் முழு உரை தேடல்." : "Full-text search by date, paper, edition, department."} />
      ) : tab === "digest" ? (
        <EmptyState icon={Newspaper} title={lang === "ta" ? "தினசரி சுருக்கம்" : "Daily digest"} hint={lang === "ta" ? "வரிசைப்படுத்தப்பட்ட சுருக்கம் தயாரிப்பில் உள்ளது." : "Taxonomy-grouped digest is being prepared."} />
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Clipping list */}
          <div className="w-80 flex-shrink-0 overflow-y-auto border-r border-border">
            {printClippings.map((c) => (
              <button
                key={c.id}
                onClick={() => { setSelected(c.id); setTaxonomy(c.type); }}
                aria-current={selected === c.id ? "true" : undefined}
                className={cn("w-full border-b border-border px-4 py-3 text-left transition-colors", selected === c.id ? "border-l-2 border-l-primary bg-primary/5" : "hover:bg-muted/30")}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-mono text-[10px] font-semibold text-muted-foreground">{c.paper} · {c.page}</span>
                  <SentimentBadge sentiment={c.sentiment} small />
                </div>
                <div className="mb-1.5 text-xs font-medium leading-snug text-foreground" lang={lang}>{lang === "ta" ? c.headlineTa : c.headlineEn}</div>
                <div className="flex items-center gap-2">
                  <ProminenceMeter value={c.prominence} />
                  <span className="text-[10px] text-muted-foreground">{c.edition}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Viewer */}
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {/* Clipping image (seeded placeholder, real <img> with fallback) */}
            <div className="overflow-hidden rounded border border-border bg-muted">
              <ImageWithFallback
                src={`https://picsum.photos/seed/dipr-clip-${clip.id}/900/360?grayscale`}
                alt={`Newspaper clipping from ${clip.paper}, ${clip.edition} edition, ${clip.page} — ${clip.headlineEn}`}
                className="h-44 w-full object-cover"
              />
              <div className="flex items-center justify-between bg-card px-3 py-1.5 font-mono text-[10px] text-muted-foreground">
                <span>{clip.paper} · {clip.edition} · {clip.page}</span>
                <span>{clip.date}</span>
              </div>
            </div>

            {/* OCR */}
            <div className="space-y-3 rounded border border-border bg-card p-4">
              <div>
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{lang === "ta" ? "தலைப்பு" : "Headline"}</div>
                <div className="text-sm font-semibold text-foreground" lang={lang}>{lang === "ta" ? clip.headlineTa : clip.headlineEn}</div>
                <div className="mt-0.5 text-xs text-muted-foreground" lang={lang === "ta" ? "en" : "ta"}>{lang === "ta" ? clip.headlineEn : clip.headlineTa}</div>
              </div>
              <div className="rounded bg-muted/40 p-3 font-mono text-xs leading-relaxed text-foreground">
                {lang === "ta"
                  ? `${clip.paper} இலிருந்து பிரித்தெடுக்கப்பட்ட OCR உரை. OCR செயலாக்கத்திற்குப் பிறகு முழு கட்டுரையும் இங்கே தோன்றும். அரசு தொடர்பான உள்ளடக்கம் தானாக துறைக்கு குறியிடப்படுகிறது: `
                  : `OCR text extracted from ${clip.paper}. The full article body appears here after OCR processing. Government-related content is highlighted and auto-tagged to department: `}
                <strong>{clip.dept}</strong>.
              </div>
            </div>

            {/* Metadata + analysis */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-2 rounded border border-border bg-card p-3">
                <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{lang === "ta" ? "மெட்டாடேட்டா" : "Metadata"}</div>
                {[["Paper", clip.paper], ["Edition", clip.edition], ["Page", clip.page], ["Date", clip.date], ["Dept", clip.dept]].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-medium text-foreground">{v}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 rounded border border-border bg-card p-3">
                <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{lang === "ta" ? "பகுப்பாய்வு" : "Analysis"}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{lang === "ta" ? "உணர்வு" : "Sentiment"}</span>
                  <SentimentBadge sentiment={clip.sentiment} small />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{lang === "ta" ? "முக்கியத்துவம்" : "Prominence"}</span>
                  <ProminenceMeter value={clip.prominence} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{lang === "ta" ? "வகைப்பாடு" : "Taxonomy"}</span>
                  <select
                    value={taxonomy}
                    onChange={(e) => setTaxonomy(e.target.value)}
                    aria-label="Taxonomy classification"
                    className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px] text-foreground outline-none"
                  >
                    {TAXONOMY.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <button className="flex items-center gap-1.5 rounded bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98]">
                <Share2 size={13} aria-hidden="true" /> {lang === "ta" ? "துறை தலைவருக்கு அனுப்பு" : "Route to Dept Head"}
              </button>
              <button className="flex items-center gap-1.5 rounded border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted active:scale-[0.98]">
                <Download size={13} aria-hidden="true" /> {lang === "ta" ? "காப்பகம்" : "Archive"}
              </button>
              <button className="flex items-center gap-1.5 rounded border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted active:scale-[0.98]">
                <ExternalLink size={13} aria-hidden="true" /> {lang === "ta" ? "முழு கட்டுரை" : "Full Article"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
