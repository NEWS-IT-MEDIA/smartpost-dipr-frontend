import { useState } from "react";
import { Construction } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { EmptyState } from "./components/primitives";
import { Dashboard } from "./screens/Dashboard";
import { CreateCard } from "./screens/CreateCard";
import { Approvals } from "./screens/Approvals";
import { Published } from "./screens/Published";
import { SocialWatch } from "./screens/SocialWatch";
import { PrintWatch } from "./screens/PrintWatch";
import { AlertsDigests } from "./screens/AlertsDigests";
import { AdminConsole } from "./screens/AdminConsole";
import { CalendarScreen } from "./screens/Calendar";
import { GlobalSearch } from "./screens/GlobalSearch";
import { Profile } from "./screens/Profile";
import { Login } from "./screens/Login";
import { useAuth } from "./api/AuthContext";
import type { Lang } from "./lib/i18n";

export default function App() {
  const { isAuthed, signOut } = useAuth();
  const [activeView, setActiveView] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [lang, setLang] = useState<Lang>("en");

  const toggleLang = () => setLang((l) => (l === "en" ? "ta" : "en"));

  if (!isAuthed) {
    return <Login lang={lang} onLang={toggleLang} />;
  }

  const renderView = () => {
    switch (activeView) {
      case "dashboard": return <Dashboard lang={lang} onNav={setActiveView} />;
      case "create": return <CreateCard lang={lang} />;
      case "approvals": return <Approvals lang={lang} />;
      case "published": return <Published lang={lang} />;
      case "social": return <SocialWatch lang={lang} />;
      case "print": return <PrintWatch lang={lang} />;
      case "calendar": return <CalendarScreen lang={lang} />;
      case "alerts": return <AlertsDigests lang={lang} />;
      case "search": return <GlobalSearch lang={lang} />;
      case "admin": return <AdminConsole lang={lang} />;
      case "profile": return <Profile lang={lang} onLogout={signOut} />;
      default:
        return (
          <EmptyState
            icon={Construction}
            title={lang === "ta" ? "விரைவில் வருகிறது" : "Coming soon"}
            hint={lang === "ta" ? "இந்த பகுதி தயாரிப்பில் உள்ளது." : "This section is being prepared."}
          />
        );
    }
  };

  return (
    <div className="flex w-full overflow-hidden bg-background text-foreground" style={{ height: "100dvh", minHeight: "100dvh" }}>
      <Sidebar
        active={activeView}
        onNav={setActiveView}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        lang={lang}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar lang={lang} onLangToggle={toggleLang} activeView={activeView} />
        <main className="flex-1 overflow-hidden">{renderView()}</main>
      </div>
    </div>
  );
}
