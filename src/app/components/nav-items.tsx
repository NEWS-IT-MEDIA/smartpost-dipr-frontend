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
};

export const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", labelTa: "டாஷ்போர்டு", Icon: LayoutDashboard },
  { id: "create", label: "Create News Card", labelTa: "செய்தி அட்டை உருவாக்கு", Icon: FilePlus2 },
  { id: "approvals", label: "Approvals", labelTa: "அங்கீகாரங்கள்", Icon: CheckSquare, badge: 3 },
  { id: "published", label: "Published / Scheduled", labelTa: "வெளியிடப்பட்டது", Icon: Send },
  { id: "social", label: "Social Watch", labelTa: "சமூக கண்காணிப்பு", Icon: Eye, badge: 7 },
  { id: "print", label: "Print Watch", labelTa: "பத்திரிகை கண்காணிப்பு", Icon: Newspaper },
  { id: "calendar", label: "Calendar", labelTa: "நாட்காட்டி", Icon: CalendarDays },
  { id: "alerts", label: "Alerts & Digests", labelTa: "விழிப்பூட்டல்கள்", Icon: Bell, badge: 2 },
  { id: "search", label: "Search", labelTa: "தேடல்", Icon: Search },
];

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
