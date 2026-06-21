import { ChevronLeft, ChevronRight, Settings, User } from "lucide-react";
import { cn } from "./ui/utils";
import { navItems } from "./nav-items";
import { currentUser } from "../data/mock";
import type { Lang } from "../lib/i18n";

export function Sidebar({
  active,
  onNav,
  collapsed,
  onToggle,
  lang,
}: {
  active: string;
  onNav: (id: string) => void;
  collapsed: boolean;
  onToggle: () => void;
  lang: Lang;
}) {
  return (
    <aside
      className={cn("flex h-full flex-col transition-all duration-200", collapsed ? "w-14" : "w-56")}
      style={{ background: "var(--sidebar)", borderRight: "1px solid var(--sidebar-border)" }}
    >
      {/* Header */}
      <div
        className={cn("border-b px-2 py-3", collapsed ? "flex flex-col items-center gap-2" : "flex items-center gap-2 px-3 py-4")}
        style={{ borderColor: "var(--sidebar-border)" }}
      >
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-sm bg-amber-400">
          <span className="text-[10px] font-bold leading-none text-zinc-900">TN</span>
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold leading-tight text-white">DIPR</div>
            <div className="truncate text-[10px] leading-tight" style={{ color: "var(--sidebar-foreground)" }}>
              {lang === "ta" ? "தகவல் தொடர்பு தளம்" : "Communications Platform"}
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex items-center justify-center rounded text-white/70 transition-colors hover:bg-white/10 hover:text-white active:scale-95",
            collapsed ? "h-7 w-9 bg-white/[0.06]" : "ml-auto flex-shrink-0 p-0.5",
          )}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav aria-label="Main navigation" className="flex-1 overflow-y-auto py-2">
        {navItems.map(({ id, label, labelTa, Icon, badge }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              aria-current={isActive ? "page" : undefined}
              title={collapsed ? (lang === "ta" ? labelTa : label) : undefined}
              className={cn(
                "group relative flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] transition-colors active:scale-[0.99]",
                isActive ? "bg-amber-400/15 font-medium" : "hover:bg-white/[0.07] hover:text-white",
              )}
              style={{ color: isActive ? "#f5ab2e" : "var(--sidebar-foreground)" }}
            >
              <Icon size={16} strokeWidth={2} className="flex-shrink-0" aria-hidden="true" />
              {!collapsed && <span className="flex-1 truncate">{lang === "ta" ? labelTa : label}</span>}
              {!collapsed && badge != null && (
                <span className="min-w-[18px] flex-shrink-0 rounded-full bg-amber-400 px-1.5 py-0.5 text-center text-[10px] font-bold leading-none text-zinc-900">
                  {badge}
                </span>
              )}
              {collapsed && badge != null && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-amber-400" aria-hidden="true" />
              )}
            </button>
          );
        })}

        <div className="mx-3 my-2 border-t" style={{ borderColor: "var(--sidebar-border)" }} />

        <button
          onClick={() => onNav("admin")}
          aria-current={active === "admin" ? "page" : undefined}
          className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] transition-colors hover:bg-white/[0.07] hover:text-white active:scale-[0.99]"
          style={{ color: active === "admin" ? "#f5ab2e" : "var(--sidebar-foreground)" }}
        >
          <Settings size={16} className="flex-shrink-0" aria-hidden="true" />
          {!collapsed && <span className="truncate">{lang === "ta" ? "நிர்வாகம்" : "Admin"}</span>}
        </button>
        <button
          onClick={() => onNav("profile")}
          aria-current={active === "profile" ? "page" : undefined}
          className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] transition-colors hover:bg-white/[0.07] hover:text-white active:scale-[0.99]"
          style={{ color: active === "profile" ? "#f5ab2e" : "var(--sidebar-foreground)" }}
        >
          <User size={16} className="flex-shrink-0" aria-hidden="true" />
          {!collapsed && <span className="truncate">{lang === "ta" ? "சுயவிவரம்" : "Profile / Logout"}</span>}
        </button>
      </nav>

      {/* Footer user */}
      {!collapsed && (
        <div className="border-t px-3 py-3" style={{ borderColor: "var(--sidebar-border)" }}>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-zinc-900">
              {currentUser.initial}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-medium text-white">{currentUser.name}</div>
              <div className="truncate text-[10px]" style={{ color: "var(--sidebar-foreground)" }}>
                {lang === "ta" ? currentUser.roleTa : currentUser.roleEn}
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
