import { LogOut, Mail, Shield, MapPin, Building2 } from "lucide-react";
import { currentUser } from "../data/mock";
import type { Lang } from "../lib/i18n";

export function Profile({ lang, onLogout }: { lang: Lang; onLogout: () => void }) {
  const rows = [
    { Icon: Mail, label: lang === "ta" ? "மின்னஞ்சல்" : "Official email", value: currentUser.email },
    { Icon: Shield, label: lang === "ta" ? "பதவி" : "Role", value: lang === "ta" ? currentUser.roleTa : currentUser.roleEn },
    { Icon: MapPin, label: lang === "ta" ? "மாவட்டம்" : "District", value: "Madurai" },
    { Icon: Building2, label: lang === "ta" ? "துறை" : "Department", value: "DIPR" },
  ];

  const perms = [
    { label: lang === "ta" ? "உள்ளடக்கம் சமர்ப்பி" : "Submit content", on: true },
    { label: lang === "ta" ? "AI சுத்திகரிப்பு" : "Use AI refine/design", on: true },
    { label: lang === "ta" ? "அங்கீகரி (நிலை 1/2)" : "Approve (stage 1/2)", on: false },
    { label: lang === "ta" ? "இறுதி அங்கீகாரம்" : "Final approve / publish", on: false },
    { label: lang === "ta" ? "சமூக கண்காணிப்பு (மாவட்டம்)" : "View Social Watch (own district)", on: true },
  ];

  return (
    <div className="h-full overflow-y-auto p-5">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex items-center gap-4 rounded border border-border bg-card p-5">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">{currentUser.initial}</div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-foreground">{currentUser.name}</h2>
            <p className="text-sm text-muted-foreground" lang={lang}>{lang === "ta" ? currentUser.roleTa : currentUser.roleEn}</p>
          </div>
          <button onClick={onLogout} className="flex items-center gap-1.5 rounded border border-red-300 px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 active:scale-[0.98] dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40">
            <LogOut size={13} aria-hidden="true" /> {lang === "ta" ? "வெளியேறு" : "Log out"}
          </button>
        </div>

        <div className="rounded border border-border bg-card p-5">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{lang === "ta" ? "கணக்கு விவரங்கள்" : "Account details"}</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {rows.map(({ Icon, label, value }) => (
              <div key={label} className="flex items-start gap-2.5">
                <Icon size={15} className="mt-0.5 text-primary" aria-hidden="true" />
                <div className="min-w-0">
                  <div className="text-[11px] text-muted-foreground">{label}</div>
                  <div className="truncate text-sm font-medium text-foreground">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded border border-border bg-card p-5">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{lang === "ta" ? "அனுமதிகள்" : "Permissions"}</h3>
          <ul className="space-y-2">
            {perms.map((p) => (
              <li key={p.label} className="flex items-center justify-between text-sm">
                <span className="text-foreground" lang={lang}>{p.label}</span>
                <span className={p.on ? "font-medium text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>{p.on ? (lang === "ta" ? "உண்டு" : "Granted") : (lang === "ta" ? "இல்லை" : "Not granted")}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
