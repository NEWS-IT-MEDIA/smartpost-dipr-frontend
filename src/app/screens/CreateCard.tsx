import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  Check,
  Layers,
  Image as ImageIcon,
  Hash,
  AtSign,
  Calendar as CalendarIcon,
  Send,
  CheckCircle2,
  X,
} from "lucide-react";
import { cn } from "../components/ui/utils";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import type { Lang } from "../lib/i18n";

const STEPS = ["Input", "AI Refine", "Design", "Review", "Publish"];
const STEPS_TA = ["உள்ளீடு", "AI சுத்தம்", "வடிவமைப்பு", "மறுஆய்வு", "வெளியிடு"];

const PLATFORM_SIZES = [
  { key: "FB", label: "Facebook", size: "1200×630", ratio: "1.91 / 1" },
  { key: "IG", label: "Instagram", size: "1080×1080", ratio: "1 / 1" },
  { key: "IGS", label: "IG Story", size: "1080×1920", ratio: "9 / 16" },
  { key: "X", label: "X", size: "1600×900", ratio: "16 / 9" },
  { key: "WA", label: "WhatsApp", size: "1080×1080", ratio: "1 / 1" },
  { key: "YT", label: "YouTube", size: "1280×720", ratio: "16 / 9" },
];

const TEMPLATES = ["Scheme Launch", "Statistics", "Quote Card", "Event", "Alert"];

export function CreateCard({ lang }: { lang: Lang }) {
  const [step, setStep] = useState(1);
  const [tonality, setTonality] = useState("announcement");
  const [platSize, setPlatSize] = useState("FB");
  const [template, setTemplate] = useState("Scheme Launch");
  const [cardLang, setCardLang] = useState<"ta" | "en">("ta");
  const [hashtags, setHashtags] = useState(["#TNDIPR", "#MetroPhase3", "#ChennaiMetro"]);
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ FB: true, IG: true, X: true, WhatsApp: false, YT: false });

  const removeHashtag = (h: string) => setHashtags((hs) => hs.filter((x) => x !== h));

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Stepper */}
      <div className="flex flex-shrink-0 items-center gap-0 border-b border-border bg-card px-5 py-3" role="navigation" aria-label="Wizard steps">
        {STEPS.map((s, i) => {
          const n = i + 1;
          const done = n < step;
          const active = n === step;
          return (
            <div key={s} className="flex items-center">
              <button
                onClick={() => n < step && setStep(n)}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium transition-colors",
                  active ? "bg-primary text-primary-foreground" : done ? "cursor-pointer text-primary hover:bg-primary/10" : "cursor-default text-muted-foreground",
                )}
              >
                <span className={cn("flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border text-[10px] font-bold", active ? "border-primary-foreground bg-card text-primary" : done ? "border-primary/20 bg-primary/20 text-primary" : "border-current bg-transparent")}>
                  {done ? <Check size={11} aria-hidden="true" /> : n}
                </span>
                <span className="hidden sm:inline" lang={lang}>{lang === "ta" ? STEPS_TA[i] : s}</span>
              </button>
              {i < STEPS.length - 1 && <div className="mx-1 h-px w-6 bg-border" aria-hidden="true" />}
            </div>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {/* STEP 1 — INPUT */}
        {step === 1 && (
          <div className="max-w-3xl space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { label: "Tamil Title", labelTa: "தலைப்பு (தமிழ்)", val: "மெட்ரோ விரிவாக்கம் — 3ஆம் கட்டம்", l: "ta" },
                { label: "English Title", labelTa: "Title (English)", val: "Metro Expansion — Phase 3 Launch", l: "en" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="mb-1.5 block text-xs font-semibold text-foreground" lang={lang}>{lang === "ta" ? f.labelTa : f.label}</label>
                  <input defaultValue={f.val} lang={f.l} className="w-full rounded border border-border bg-input-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              ))}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-foreground" lang={lang}>{lang === "ta" ? "விவரம்" : "Body Text"}</label>
              <textarea rows={4} defaultValue="The Tamil Nadu government today announced the launch of Phase 3 of the Chennai Metro Rail expansion project, covering 26 new stations across 45 km…" className="w-full resize-none rounded border border-border bg-input-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { label: "G.O. / Source Ref.", labelTa: "ஆதார எண்", val: "G.O. (Ms) No. 142 / 2026", type: "text" },
                { label: "Event Date", labelTa: "நிகழ்வு தேதி", val: "2026-06-19", type: "date" },
                { label: "Location", labelTa: "இடம்", val: "Chennai, Tamil Nadu", type: "text" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="mb-1.5 block text-xs font-semibold text-foreground" lang={lang}>{lang === "ta" ? f.labelTa : f.label}</label>
                  <input type={f.type} defaultValue={f.val} className="w-full rounded border border-border bg-input-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              ))}
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-foreground" lang={lang}>{lang === "ta" ? "தொனி" : "Tonality"}</label>
              <div className="flex flex-wrap gap-2">
                {["Formal", "Announcement", "Achievement", "Welfare-Scheme", "Condolence", "Alert"].map((tn) => (
                  <button
                    key={tn}
                    onClick={() => setTonality(tn.toLowerCase())}
                    aria-pressed={tonality === tn.toLowerCase()}
                    className={cn("rounded border px-3 py-1.5 text-xs font-medium transition-colors active:scale-[0.98]", tonality === tn.toLowerCase() ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary/50")}
                  >
                    {lang === "ta" ? ({ Formal: "முறையான", Announcement: "அறிவிப்பு", Achievement: "சாதனை", "Welfare-Scheme": "நல திட்டம்", Condolence: "இரங்கல்", Alert: "எச்சரிக்கை" } as Record<string, string>)[tn] : tn}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button className="rounded border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted active:scale-[0.98]">
                {lang === "ta" ? "வரைவு சேமி" : "Save Draft"}
              </button>
              <button onClick={() => setStep(2)} className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98]">
                <Sparkles size={13} aria-hidden="true" /> {lang === "ta" ? "AI மூலம் சுத்தப்படுத்து" : "Refine with AI"} <ArrowRight size={13} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — AI REFINE */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground" lang={lang}>
                <Sparkles size={14} className="text-amber-500" aria-hidden="true" /> {lang === "ta" ? "AI சுத்திகரிப்பு & மதிப்பீடு" : "AI Refinement & Moderation"}
              </h3>
              <button className="flex items-center gap-1.5 rounded border border-border px-2.5 py-1.5 text-xs transition-colors hover:bg-muted active:scale-95">
                <RefreshCw size={11} aria-hidden="true" /> {lang === "ta" ? "மீண்டும்" : "Regenerate"}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {[
                { label: lang === "ta" ? "மூல உள்ளீடு" : "Original Input", content: "Metro Expansion Phase 3 Launch. The government announced 26 new stations across 45 km. This will benefit commuters across Chennai suburbs.", grounded: [true, false, true], l: "en" },
                { label: lang === "ta" ? "AI சுத்தம் — தமிழ்" : "AI Refined — Tamil", content: "தமிழ்நாடு அரசு இன்று சென்னை மெட்ரோ ரயில் விரிவாக்கம் கட்டம் 3-ஐ அறிவித்தது. 45 கிலோமீட்டர் நீளத்தில் 26 புதிய நிலையங்கள் அமைக்கப்படும். சென்னை புறநகர் பயணிகளுக்கு பெரும் நன்மை கிட்டும்.", grounded: [true, true, true], l: "ta" },
                { label: lang === "ta" ? "AI சுத்தம் — ஆங்கிலம்" : "AI Refined — English", content: "The Tamil Nadu Government today formally announced the launch of Phase 3 of the Chennai Metro Rail Expansion Project, comprising 26 new stations spanning 45 km, significantly enhancing suburban connectivity.", grounded: [true, true, false], l: "en" },
              ].map((col) => {
                const parts = col.content.split(". ").filter(Boolean);
                return (
                  <div key={col.label} className="rounded border border-border bg-card p-3">
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{col.label}</div>
                    <div className="space-y-1 text-xs leading-relaxed text-foreground" lang={col.l}>
                      {parts.map((sent, i) => (
                        <span key={i} className={cn("inline rounded px-0.5", col.grounded[i] ? "bg-emerald-100/60 dark:bg-emerald-900/40" : "bg-amber-100/60 dark:bg-amber-900/40")}>
                          {sent}{i < parts.length - 1 ? ". " : ""}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <span className="flex items-center gap-1 text-[9px] text-emerald-700 dark:text-emerald-400"><span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />{lang === "ta" ? "சரிபார்க்கப்பட்டது" : "Grounded"}</span>
                      <span className="flex items-center gap-1 text-[9px] text-amber-700 dark:text-amber-400"><span className="h-2 w-2 rounded-full bg-amber-400" aria-hidden="true" />{lang === "ta" ? "சரிபார்க்கப்படாதது" : "Unverified"}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/40">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
                <AlertTriangle size={13} aria-hidden="true" /> {lang === "ta" ? "மதிப்பீட்டு கொடிகள்" : "Moderation Flags"}
              </div>
              <div className="space-y-2">
                {[
                  { type: "Factual Gap", msg: "Phase 3 timeline not mentioned in source document — verify completion date.", fixed: false },
                  { type: "Honorific", msg: "Chief Minister's honorific missing in Tamil version — expected 'மாண்புமிகு'.", fixed: true },
                ].map((flag) => (
                  <div key={flag.type} className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-400">{flag.type}</span>
                      <p className="mt-0.5 text-xs text-amber-800 dark:text-amber-300">{flag.msg}</p>
                    </div>
                    <div className="flex flex-shrink-0 gap-1.5">
                      <button className={cn("rounded border px-2 py-0.5 text-[10px] font-medium active:scale-95", flag.fixed ? "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300" : "border-amber-300 bg-card text-amber-700 hover:bg-amber-100 dark:text-amber-300")}>
                        {flag.fixed ? (lang === "ta" ? "சரிசெய்யப்பட்டது" : "Fixed") : (lang === "ta" ? "சரிசெய்" : "Accept Fix")}
                      </button>
                      {!flag.fixed && <button className="rounded border border-border px-2 py-0.5 text-[10px] text-muted-foreground hover:bg-muted active:scale-95">{lang === "ta" ? "புறக்கணி" : "Ignore"}</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <StepNav lang={lang} onBack={() => setStep(1)} onNext={() => setStep(3)} nextLabel={lang === "ta" ? "வடிவமைப்பு" : "Proceed to Design"} />
          </div>
        )}

        {/* STEP 3 — DESIGN STUDIO */}
        {step === 3 && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[180px_1fr_220px]">
            {/* Template gallery */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground"><Layers size={13} className="text-primary" aria-hidden="true" /> {lang === "ta" ? "வார்ப்புருக்கள்" : "Templates"}</div>
              {TEMPLATES.map((t) => (
                <button key={t} onClick={() => setTemplate(t)} aria-pressed={template === t} className={cn("w-full rounded border px-2.5 py-2 text-left text-xs font-medium transition-colors active:scale-[0.99]", template === t ? "border-primary bg-primary/5 text-primary" : "border-border bg-card text-foreground hover:border-primary/40")}>
                  {t}
                </button>
              ))}
            </div>

            {/* Live canvas */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {PLATFORM_SIZES.map((p) => (
                  <button key={p.key} onClick={() => setPlatSize(p.key)} aria-pressed={platSize === p.key} className={cn("rounded px-2.5 py-1 text-[11px] font-medium transition-colors active:scale-95", platSize === p.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}>
                    {p.label}
                  </button>
                ))}
                <div className="ml-auto flex items-center gap-1 overflow-hidden rounded border border-border text-[11px] font-mono">
                  <button onClick={() => setCardLang("ta")} aria-pressed={cardLang === "ta"} className={cn("px-2 py-1", cardLang === "ta" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>தமிழ்</button>
                  <button onClick={() => setCardLang("en")} aria-pressed={cardLang === "en"} className={cn("border-l border-border px-2 py-1", cardLang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>EN</button>
                </div>
              </div>

              {(() => {
                const p = PLATFORM_SIZES.find((x) => x.key === platSize)!;
                return (
                  <div className="rounded border border-border bg-muted/40 p-4">
                    <div className="relative mx-auto overflow-hidden rounded shadow-sm" style={{ aspectRatio: p.ratio, maxWidth: 480, width: "100%" }}>
                      <ImageWithFallback src={`https://picsum.photos/seed/dipr-metro-${platSize}/960/540`} alt="Card background preview" className="absolute inset-0 h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a35]/90 via-[#0f1a35]/30 to-transparent" />
                      <div className="absolute left-0 top-0 flex items-center gap-1.5 p-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-amber-400 text-[9px] font-bold text-zinc-900">TN</span>
                        <span className="font-mono text-[9px] font-semibold uppercase tracking-wide text-white/90">DIPR</span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="mb-1 inline-block rounded-sm bg-amber-400 px-1.5 py-0.5 text-[8px] font-bold uppercase text-zinc-900">{template}</div>
                        <div className="text-base font-bold leading-tight text-white" lang={cardLang}>
                          {cardLang === "ta" ? "மெட்ரோ விரிவாக்கம் — 3ஆம் கட்டம்" : "Metro Expansion — Phase 3"}
                        </div>
                        <div className="mt-1 text-[10px] text-white/80" lang={cardLang}>
                          {cardLang === "ta" ? "45 கி.மீ · 26 புதிய நிலையங்கள்" : "45 km · 26 new stations"}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-center font-mono text-[10px] text-muted-foreground">{p.label} · {p.size}px</div>
                  </div>
                );
              })()}
            </div>

            {/* Element editor */}
            <div className="space-y-3 rounded border border-border bg-card p-3">
              <div className="text-xs font-semibold text-foreground">{lang === "ta" ? "உறுப்பு திருத்தி" : "Element Editor"}</div>
              {[
                { label: lang === "ta" ? "தலைப்பு அளவு" : "Headline size", el: <input type="range" min={12} max={32} defaultValue={20} className="w-full accent-[var(--primary)]" aria-label="Headline size" /> },
                { label: lang === "ta" ? "உரை வண்ணம்" : "Text color", el: <div className="flex gap-1.5">{["#ffffff", "#f59e0b", "#1a3a6b"].map((c) => <button key={c} className="h-5 w-5 rounded-full border border-border" style={{ background: c }} aria-label={`Color ${c}`} />)}</div> },
              ].map((row) => (
                <div key={row.label} className="space-y-1">
                  <label className="text-[11px] text-muted-foreground">{row.label}</label>
                  {row.el}
                </div>
              ))}
              <button className="flex w-full items-center justify-center gap-1.5 rounded border border-border py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted active:scale-[0.98]">
                <ImageIcon size={12} aria-hidden="true" /> {lang === "ta" ? "படத்தை மாற்று" : "Swap image"}
              </button>
            </div>

            <div className="lg:col-span-3">
              <StepNav lang={lang} onBack={() => setStep(2)} onNext={() => setStep(4)} nextLabel={lang === "ta" ? "மறுஆய்வு" : "Review"} />
            </div>
          </div>
        )}

        {/* STEP 4 — REVIEW */}
        {step === 4 && (
          <div className="max-w-4xl space-y-5">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">{lang === "ta" ? "அனைத்து தள அட்டைகள்" : "All Platform Cards"}</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {PLATFORM_SIZES.slice(0, 6).map((p) => (
                  <div key={p.key} className="overflow-hidden rounded border border-border bg-card">
                    <div className="relative" style={{ aspectRatio: p.ratio }}>
                      <ImageWithFallback src={`https://picsum.photos/seed/dipr-rev-${p.key}/480/270`} alt={`${p.label} card preview`} className="absolute inset-0 h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a35]/85 to-transparent" />
                      <div className="absolute bottom-1.5 left-2 text-[10px] font-bold text-white">Metro Phase 3</div>
                    </div>
                    <div className="px-2 py-1 font-mono text-[9px] text-muted-foreground">{p.label} · {p.size}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded border border-border bg-card p-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">{lang === "ta" ? "அங்கீகார சங்கிலி" : "Approval Chain"}</h3>
              <ol className="flex flex-wrap items-center gap-2 text-xs">
                {["District PRO", "Dept PRO / Head", "DIPR HQ Approver", "Joint Director"].map((r, i, arr) => (
                  <li key={r} className="flex items-center gap-2">
                    <span className="rounded border border-border bg-muted/50 px-2.5 py-1 font-medium text-foreground">{i + 1}. {r}</span>
                    {i < arr.length - 1 && <ArrowRight size={12} className="text-muted-foreground" aria-hidden="true" />}
                  </li>
                ))}
              </ol>
            </div>

            <StepNav lang={lang} onBack={() => setStep(3)} onNext={() => setStep(5)} nextLabel={lang === "ta" ? "வெளியிடு அமைப்பு" : "Publish Setup"} />
          </div>
        )}

        {/* STEP 5 — PUBLISH */}
        {step === 5 && (
          <div className="max-w-3xl space-y-5">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">{lang === "ta" ? "தளங்கள்" : "Target Platforms"}</h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(enabled).map((p) => (
                  <button key={p} onClick={() => setEnabled((e) => ({ ...e, [p]: !e[p] }))} aria-pressed={enabled[p]} className={cn("flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-medium transition-colors active:scale-[0.98]", enabled[p] ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground")}>
                    {enabled[p] && <Check size={12} aria-hidden="true" />} {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-foreground">{lang === "ta" ? "தலைப்பு (Facebook)" : "Caption (Facebook)"}</label>
              <textarea rows={3} defaultValue="Tamil Nadu launches Phase 3 of Chennai Metro — 26 new stations across 45 km, bringing world-class connectivity to the suburbs." className="w-full resize-none rounded border border-border bg-input-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-foreground"><Hash size={12} className="text-primary" aria-hidden="true" /> {lang === "ta" ? "ஹாஷ்டேக்குகள்" : "Hashtags"}</div>
                <div className="flex flex-wrap gap-1.5">
                  {hashtags.map((h) => (
                    <span key={h} className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                      {h}
                      <button onClick={() => removeHashtag(h)} aria-label={`Remove ${h}`} className="hover:text-primary/70"><X size={10} aria-hidden="true" /></button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-foreground"><AtSign size={12} className="text-primary" aria-hidden="true" /> {lang === "ta" ? "குறிப்புகள்" : "Mentions"}</div>
                <div className="flex flex-wrap gap-1.5">
                  {["@CMOTamilnadu", "@CMRL_Official"].map((m) => (
                    <span key={m} className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">{m}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded border border-border bg-card p-3">
              <div className="mb-2 text-xs font-semibold text-foreground">{lang === "ta" ? "WhatsApp குழுக்கள்" : "WhatsApp Groups / Channels"}</div>
              <div className="space-y-1.5">
                {["DIPR District PROs (38)", "Press Corps — Chennai", "Department Heads Channel"].map((g) => (
                  <label key={g} className="flex items-center gap-2 text-xs text-foreground">
                    <input type="checkbox" className="accent-[var(--primary)]" /> {g}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs">
                <CalendarIcon size={13} className="text-muted-foreground" aria-hidden="true" />
                <span className="font-medium text-foreground">{lang === "ta" ? "திட்டமிடு" : "Schedule"}:</span>
                <input type="datetime-local" defaultValue="2026-06-19T17:00" aria-label="Schedule time" className="rounded border border-border bg-input-background px-2 py-1 text-xs text-foreground outline-none" />
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-3 pt-2">
              <button onClick={() => setStep(4)} className="rounded border border-border px-3 py-2 text-xs transition-colors hover:bg-muted active:scale-[0.98]">{lang === "ta" ? "பின்" : "Back"}</button>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 rounded border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted active:scale-[0.98]">
                  <CalendarIcon size={13} aria-hidden="true" /> {lang === "ta" ? "திட்டமிடு" : "Schedule"}
                </button>
                <button className="flex items-center gap-1.5 rounded bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 active:scale-[0.98]">
                  <Send size={13} aria-hidden="true" /> {lang === "ta" ? "இப்போது வெளியிடு" : "Publish Now"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepNav({ lang, onBack, onNext, nextLabel }: { lang: Lang; onBack: () => void; onNext: () => void; nextLabel: string }) {
  return (
    <div className="flex justify-between pt-2">
      <button onClick={onBack} className="rounded border border-border px-3 py-2 text-xs transition-colors hover:bg-muted active:scale-[0.98]">{lang === "ta" ? "பின்" : "Back"}</button>
      <button onClick={onNext} className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98]">
        {nextLabel} <ArrowRight size={13} aria-hidden="true" />
      </button>
    </div>
  );
}
