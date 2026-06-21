import { Bell, Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { viewTitles } from "./nav-items";
import { currentUser } from "../data/mock";
import type { Lang } from "../lib/i18n";

export function Topbar({
  lang,
  onLangToggle,
  activeView,
}: {
  lang: Lang;
  onLangToggle: () => void;
  activeView: string;
}) {
  const title = viewTitles[activeView] ?? { en: activeView, ta: activeView };

  return (
    <header className="flex h-16 flex-shrink-0 items-center gap-4 border-b border-border bg-card px-6">
      <div className="min-w-0 flex-1 leading-tight">
        <h1 className="truncate text-sm font-semibold text-foreground" lang={lang}>
          {lang === "ta" ? title.ta : title.en}
        </h1>
        <div className="mt-0.5 text-[11px] text-muted-foreground">
          {lang === "ta" ? "வியாழன், 19 ஜூன் 2026 · மதுரை மாவட்டம்" : "Thu, 19 Jun 2026 · Madurai District"}
        </div>
      </div>

      {/* Search */}
      <div className="hidden w-52 items-center gap-2 rounded border border-border bg-muted/60 px-2.5 py-1.5 md:flex">
        <Search size={13} className="flex-shrink-0 text-muted-foreground" aria-hidden="true" />
        <input
          className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
          placeholder={lang === "ta" ? "தேடு…" : "Search cards, clippings…"}
          aria-label={lang === "ta" ? "தேடல்" : "Global search"}
        />
      </div>

      {/* Language toggle */}
      <div className="flex h-7 items-center overflow-hidden rounded border border-border text-xs font-mono font-medium" role="group" aria-label="Language">
        <button
          onClick={() => lang !== "ta" && onLangToggle()}
          aria-pressed={lang === "ta"}
          className={`flex h-full items-center px-2.5 transition-colors ${lang === "ta" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          தமிழ்
        </button>
        <button
          onClick={() => lang !== "en" && onLangToggle()}
          aria-pressed={lang === "en"}
          className={`flex h-full items-center border-l border-border px-2.5 transition-colors ${lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          EN
        </button>
      </div>

      <ThemeToggle label={lang === "ta" ? "தீம் மாற்று" : "Toggle theme"} />

      {/* Notifications */}
      <button
        className="relative rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
        aria-label={lang === "ta" ? "அறிவிப்புகள், 2 புதிய" : "Notifications, 2 new"}
      >
        <Bell size={16} aria-hidden="true" />
        <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
      </button>

      {/* Avatar */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {currentUser.initial}
        </div>
        <div className="hidden lg:block">
          <div className="text-xs font-medium text-foreground">{currentUser.name}</div>
          <div className="text-[10px] font-mono text-muted-foreground">{currentUser.shortRoleEn}</div>
        </div>
      </div>
    </header>
  );
}
