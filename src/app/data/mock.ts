/* Mock data for the DIPR Communications Platform UI prototype.
 * Realistic TN-specific names, schemes, papers and channels.
 * All figures are illustrative sample data, not live metrics. */

export type Sentiment = "positive" | "neutral" | "negative";
export type PostStatus = "published" | "scheduled" | "failed" | "draft" | "recalled";

export const sentimentData = [
  { day: "Mon", positive: 62, neutral: 24, negative: 14 },
  { day: "Tue", positive: 58, neutral: 28, negative: 14 },
  { day: "Wed", positive: 71, neutral: 19, negative: 10 },
  { day: "Thu", positive: 55, neutral: 27, negative: 18 },
  { day: "Fri", positive: 49, neutral: 28, negative: 23 },
  { day: "Sat", positive: 64, neutral: 22, negative: 14 },
  { day: "Sun", positive: 68, neutral: 21, negative: 11 },
];

export const volumeData = [
  { time: "6am", count: 12 },
  { time: "8am", count: 45 },
  { time: "10am", count: 89 },
  { time: "12pm", count: 134 },
  { time: "2pm", count: 98 },
  { time: "4pm", count: 76 },
  { time: "6pm", count: 112 },
  { time: "8pm", count: 67 },
];

export const printProminenceData = [
  { paper: "Daily Thanthi", items: 8 },
  { paper: "Dinamalar", items: 6 },
  { paper: "The Hindu", items: 5 },
  { paper: "Dinakaran", items: 4 },
  { paper: "TOI", items: 3 },
];

/* Single-accent-safe channel palette: navy / amber / teal / slate. No purple. */
export const channelShareData = [
  { name: "Sun News", value: 28, color: "var(--chart-2)" },
  { name: "Polimer", value: 22, color: "var(--chart-1)" },
  { name: "Thanthi TV", value: 18, color: "var(--chart-3)" },
  { name: "News18 Tamil", value: 16, color: "var(--chart-5)" },
  { name: "Others", value: 16, color: "var(--muted)" },
];

export type Approval = {
  id: number;
  title: string;
  titleTa: string;
  dept: string;
  stage: string;
  age: string;
  sla: number;
  urgent: boolean;
  status: "pending" | "approved" | "rejected";
};

export const approvals: Approval[] = [
  { id: 1, title: "Free Bus Scheme — Women Beneficiaries Q2", titleTa: "இலவச பேருந்து திட்டம் — மகளிர் Q2", dept: "Transport", stage: "HQ Review", age: "2h", sla: 70, urgent: false, status: "pending" },
  { id: 2, title: "CMCHIS Hospital Opening — Madurai", titleTa: "சிஎம்சிஐஎஸ் மருத்துவமனை திறப்பு", dept: "Health", stage: "Dept → HQ", age: "20m", sla: 15, urgent: false, status: "pending" },
  { id: 3, title: "Farmer Subsidy Disbursement — Kharif 2025", titleTa: "விவசாயி மானியம் — காரிஃப் 2025", dept: "Agriculture", stage: "Stage 1", age: "1d 3h", sla: 110, urgent: true, status: "pending" },
  { id: 4, title: "Metro Expansion Phase 3 Announcement", titleTa: "மெட்ரோ விரிவாக்கம் கட்டம் 3", dept: "Transport", stage: "Stage 1", age: "4h", sla: 40, urgent: false, status: "pending" },
  { id: 5, title: "Pongal Gift Hamper Distribution Recap", titleTa: "பொங்கல் பரிசு தொகுப்பு விநியோகம்", dept: "Welfare", stage: "Approved", age: "2d", sla: 100, urgent: false, status: "approved" },
  { id: 6, title: "Coastal Cleanup Drive — Misattributed Quote", titleTa: "கடலோர சுத்தம் — தவறான மேற்கோள்", dept: "Environment", stage: "Rejected", age: "3d", sla: 100, urgent: false, status: "rejected" },
];

export type SocialMention = {
  id: number;
  sentiment: Sentiment;
  score: number;
  channel: string;
  platform: string;
  time: string;
  dept: string;
  snippet: string;
  lowConfidence: boolean;
};

export const socialMentions: SocialMention[] = [
  { id: 1, sentiment: "negative", score: 0.82, channel: "Polimer News", platform: "X", time: "2h ago", dept: "Transport", snippet: "Traffic chaos continues on Chennai-Bangalore highway despite CM's promise of expansion work by December...", lowConfidence: false },
  { id: 2, sentiment: "positive", score: 0.91, channel: "Sun News", platform: "FB", time: "3h ago", dept: "Health", snippet: "Tamil Nadu's new mobile health units reach 500 villages, benefiting over 2 lakh families in rural areas.", lowConfidence: false },
  { id: 3, sentiment: "neutral", score: 0.67, channel: "Thanthi TV", platform: "YT", time: "5h ago", dept: "Agriculture", snippet: "Farmers' protest regarding delay in subsidy disbursement; government officials say payment processed.", lowConfidence: true },
  { id: 4, sentiment: "negative", score: 0.78, channel: "News18 Tamil", platform: "X", time: "1h ago", dept: "Education", snippet: "Teachers' union demands salary revision; Education dept clarification awaited on revised pay scale.", lowConfidence: false },
  { id: 5, sentiment: "positive", score: 0.95, channel: "Kalaignar TV", platform: "FB", time: "30m ago", dept: "Welfare", snippet: "Chief Minister inaugurates 1,000-unit housing scheme for SC/ST beneficiaries in Villupuram.", lowConfidence: false },
];

export type PrintClipping = {
  id: number;
  paper: string;
  edition: string;
  page: string;
  headlineTa: string;
  headlineEn: string;
  dept: string;
  sentiment: Sentiment;
  prominence: number;
  type: string;
  date: string;
};

export const printClippings: PrintClipping[] = [
  { id: 1, paper: "Daily Thanthi", edition: "Chennai", page: "P1", headlineTa: "மெட்ரோ விரிவாக்கம் — புதிய நிலையங்கள்", headlineEn: "Metro Expansion — New Stations Announced", dept: "Transport", sentiment: "positive", prominence: 5, type: "Action", date: "19 Jun 2026" },
  { id: 2, paper: "Dinamalar", edition: "Madurai", page: "P3", headlineTa: "மருத்துவமனை திறப்பு விழா", headlineEn: "Hospital Inauguration Ceremony", dept: "Health", sentiment: "positive", prominence: 4, type: "Information", date: "19 Jun 2026" },
  { id: 3, paper: "The Hindu", edition: "Chennai", page: "P2", headlineTa: "விவசாயி மானியம் தாமதம்", headlineEn: "Farmer Subsidy Delay Sparks Concern", dept: "Agriculture", sentiment: "negative", prominence: 4, type: "Clarification", date: "19 Jun 2026" },
  { id: 4, paper: "Dinamani", edition: "Coimbatore", page: "P7", headlineTa: "இலவச மடிக்கணினி திட்டம்", headlineEn: "Free Laptop Scheme Distribution Update", dept: "Education", sentiment: "positive", prominence: 3, type: "Action", date: "19 Jun 2026" },
  { id: 5, paper: "TOI", edition: "Chennai", page: "P4", headlineTa: "சுற்றுச்சூழல் கொள்கை", headlineEn: "TN Environmental Policy Gets Centre Approval", dept: "Environment", sentiment: "positive", prominence: 3, type: "Information", date: "19 Jun 2026" },
];

export type PublishedCard = {
  id: number;
  title: string;
  platforms: string[];
  status: PostStatus;
  time: string;
  reach: string;
  likes: string;
  shares: string;
};

export const publishedCards: PublishedCard[] = [
  { id: 1, title: "Women Empowerment Scheme Launch", platforms: ["FB", "IG", "X"], status: "published", time: "Today 10:32", reach: "2.4L", likes: "8.2K", shares: "1.1K" },
  { id: 2, title: "Fishermen Relief Fund Q2 Distribution", platforms: ["FB", "WhatsApp"], status: "published", time: "Today 08:15", reach: "1.8L", likes: "5.6K", shares: "920" },
  { id: 3, title: "Metro Phase 3 Announcement Card", platforms: ["FB", "IG", "X", "YT"], status: "scheduled", time: "Today 17:00", reach: "—", likes: "—", shares: "—" },
  { id: 4, title: "School Uniform Scheme — Kancheepuram", platforms: ["FB", "WhatsApp"], status: "failed", time: "Today 09:00", reach: "—", likes: "—", shares: "—" },
  { id: 5, title: "Free Eye Camp — Tiruchirappalli Draft", platforms: ["FB", "IG"], status: "draft", time: "—", reach: "—", likes: "—", shares: "—" },
];

export type AlertItem = {
  id: number;
  title: string;
  titleTa: string;
  severity: "crisis" | "warning" | "info";
  time: string;
  volume: string;
  routed: string;
  acknowledged: boolean;
};

export const alertItems: AlertItem[] = [
  { id: 1, title: "Negative Spike — Transport Dept", titleTa: "எதிர்மறை சிகரம் — போக்குவரத்து துறை", severity: "crisis", time: "2h ago", volume: "+340%", routed: "Dept Head, DIPR Desk", acknowledged: false },
  { id: 2, title: "Trending Scheme — CMCHIS Health", titleTa: "தட்டுப்பட்டது — CMCHIS சுகாதார திட்டம்", severity: "info", time: "4h ago", volume: "+240%", routed: "DIPR HQ", acknowledged: true },
  { id: 3, title: "Negative Coverage — Farmer Subsidy Delay", titleTa: "எதிர்மறை கவரேஜ் — விவசாயி மானியம்", severity: "warning", time: "6h ago", volume: "+180%", routed: "Agriculture Dept Head", acknowledged: false },
];

export const auditEntries = [
  { action: "Card Approved", user: "S. Meenakshi (HQ Approver)", target: "Free Bus Scheme Q2", time: "2 min ago" },
  { action: "User Created", user: "Admin", target: "priya.dist12@dipr.tn.gov.in · District PRO", time: "18 min ago" },
  { action: "Post Recalled", user: "K. Anand (HQ)", target: "Metro card — Instagram", time: "1h ago" },
  { action: "Template Uploaded", user: "Admin", target: "Welfare-Scheme FB 1200×630 v2", time: "3h ago" },
];

/* Current signed-in user (prototype). */
export const currentUser = {
  name: "Ravi Kumar",
  initial: "R",
  roleEn: "Madurai District PRO",
  roleTa: "மதுரை மாவட்ட மக்கள் தொடர்பு அலுவலர்",
  shortRoleEn: "District PRO",
  email: "ravi.madurai@dipr.tn.gov.in",
};
