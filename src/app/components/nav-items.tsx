import {
  LayoutDashboard,
  FilePlus2,
  CheckSquare,
  Send,
  Eye,
  Newspaper,
  CalendarDays,
  Bell,
  Search,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  id: string;
  label: string;
  labelTa: string;
  Icon: LucideIcon;
  badge?: number;
  /** roles that may see this item — empty array means everyone */
  roles: string[];
};

export const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    labelTa: "டாஷ்போர்டு",
    Icon: LayoutDashboard,
    roles: [],
  },
  {
    id: "create",
    label: "Create News Card",
    labelTa: "செய்தி அட்டை உருவாக்கு",
    Icon: FilePlus2,
    roles: ["creator", "admin"],
  },
  {
    id: "approvals",
    label: "Approvals",
    labelTa: "அங்கீகாரங்கள்",
    Icon: CheckSquare,
    badge: 3,
    roles: ["editor", "admin"],
  },
  {
    id: "published",
    label: "Published / Scheduled",
    labelTa: "வெளியிடப்பட்டது",
    Icon: Send,
    roles: [],
  },
  {
    id: "social",
    label: "Social Watch",
    labelTa: "சமூக கண்காணிப்பு",
    Icon: Eye,
    badge: 7,
    roles: ["editor", "analyst", "admin"],
  },
  {
    id: "print",
    label: "Print Watch",
    labelTa: "பத்திரிகை கண்காணிப்பு",
    Icon: Newspaper,
    roles: ["editor", "admin"],
  },
  {
    id: "calendar",
    label: "Calendar",
    labelTa: "நாட்காட்டி",
    Icon: CalendarDays,
    roles: [],
  },
  {
    id: "alerts",
    label: "Alerts & Digests",
    labelTa: "விழிப்பூட்டல்கள்",
    Icon: Bell,
    badge: 2,
    roles: ["editor", "admin"],
  },
  {
    id: "search",
    label: "Search",
    labelTa: "தேடல்",
    Icon: Search,
    roles: [],
  },
];

export function getVisibleNavItems(role?: string | null): NavItem[] {
  if (!role) return navItems;
  return navItems.filter((item) => item.roles.length === 0 || item.roles.includes(role));
}

export const viewTitles: Record<string, { en: string; ta: string }> = {
  dashboard: { en: "Dashboard", ta: "டாஷ்போர்டு" },
  create: { en: "Create News Card", ta: "செய்தி அட்டை உருவாக்கு" },
  approvals: { en: "Approvals Queue", ta: "அங்கீகார வரிசை" },
  published: { en: "Published / Scheduled", ta: "வெளியிடப்பட்டது" },
  social: { en: "News Media Social Watch", ta: "சமூக ஊடக கண்காணிப்பு" },
  print: { en: "Print Media Watch", ta: "அச்சு ஊடக கண்காணிப்பு" },
  calendar: { en: "Content Calendar", ta: "உள்ளடக்க நாட்காட்டி" },
  alerts: { en: "Alerts & Digests", ta: "விழிப்பூட்டல்கள் மற்றும் சுருக்கங்கள்" },
  search: { en: "Global Search", ta: "உலகளாவிய தேடல்" },
  admin: { en: "Admin Console", ta: "நிர்வாக கன்சோல்" },
  profile: { en: "Profile", ta: "சுயவிவரம்" },
};
