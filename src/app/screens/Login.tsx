import { useState } from "react";
import { ShieldCheck, ArrowRight, Lock, User, Loader2 } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { useAuth } from "../api/AuthContext";
import { ApiError } from "../api/client";
import type { Lang } from "../lib/i18n";

export function Login({ lang, onLang }: { lang: Lang; onLang: () => void }) {
  const { signIn } = useAuth();
  const [otp, setOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Backend auth is email+password (no OTP yet). The OTP step is kept as a
  // UI placeholder for the planned 2FA (Stage 2); real auth fires on password.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (otp) return; // OTP step is pass-through until real 2FA exists
    setBusy(true);
    try {
      await signIn(email.trim(), password);
      // success: AuthProvider flips isAuthed → App renders the shell
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Sign-in failed. Check your connection.";
      setError(lang === "ta" ? "உள்நுழைவு தோல்வி. விவரங்களைச் சரிபார்க்கவும்." : msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-[100dvh] grid-cols-1 lg:grid-cols-2">
      {/* Left — emblem / brand panel (always dark navy) */}
      <div className="relative hidden flex-col justify-between overflow-hidden p-10 lg:flex" style={{ background: "var(--sidebar)" }}>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded bg-amber-400 text-sm font-bold text-zinc-900">TN</span>
          <div>
            <div className="text-sm font-semibold text-white">DIPR</div>
            <div className="text-[11px] text-white/60">Government of Tamil Nadu</div>
          </div>
        </div>
        <div className="max-w-md">
          <h1 className="text-2xl font-semibold leading-snug text-white" lang="ta">தகவல் மற்றும் மக்கள் தொடர்பு துறை</h1>
          <p className="mt-2 text-base text-white/70">Department of Information &amp; Public Relations — Communications Platform</p>
          <p className="mt-6 text-xs text-white/50">Authorised personnel only. All activity is logged and audited.</p>
        </div>
        <div className="text-[11px] text-white/40">Secured access · 2-factor authentication required</div>
      </div>

      {/* Right — login card */}
      <div className="flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 lg:hidden">
              <span className="flex h-8 w-8 items-center justify-center rounded bg-amber-400 text-xs font-bold text-zinc-900">TN</span>
              <span className="text-sm font-semibold text-foreground">DIPR</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={onLang} className="rounded border border-border px-2 py-1 text-xs font-mono text-muted-foreground hover:text-foreground" aria-label="Toggle language">
                {lang === "ta" ? "EN" : "தமிழ்"}
              </button>
              <ThemeToggle label="Toggle theme" />
            </div>
          </div>

          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground" lang={lang}>
            <ShieldCheck size={18} className="text-primary" aria-hidden="true" /> {lang === "ta" ? "உள்நுழைவு" : "Sign in"}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground" lang={lang}>{lang === "ta" ? "உங்கள் அதிகாரப்பூர்வ விவரங்களைப் பயன்படுத்தவும்." : "Use your official DIPR credentials."}</p>

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-foreground" lang={lang}>{lang === "ta" ? "பணியாளர் ஐடி / மின்னஞ்சல்" : "Employee ID / Email"}</label>
              <div className="flex items-center gap-2 rounded border border-border bg-input-background px-3 py-2 focus-within:ring-2 focus-within:ring-primary/30">
                <User size={14} className="text-muted-foreground" aria-hidden="true" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@dipr.tn.gov.in"
                  autoComplete="username"
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  aria-label="Employee ID or email"
                />
              </div>
            </div>

            {!otp ? (
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground" lang={lang}>{lang === "ta" ? "கடவுச்சொல்" : "Password"}</label>
                <div className="flex items-center gap-2 rounded border border-border bg-input-background px-3 py-2 focus-within:ring-2 focus-within:ring-primary/30">
                  <Lock size={14} className="text-muted-foreground" aria-hidden="true" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="w-full bg-transparent text-sm text-foreground outline-none"
                    aria-label="Password"
                  />
                </div>
                <button type="button" className="mt-1.5 text-[11px] text-primary hover:underline" lang={lang}>{lang === "ta" ? "கடவுச்சொல் மறந்துவிட்டதா?" : "Forgot password?"}</button>
              </div>
            ) : (
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground" lang={lang}>{lang === "ta" ? "OTP குறியீடு" : "One-time code (OTP)"}</label>
                <div className="flex gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <input key={i} maxLength={1} inputMode="numeric" defaultValue={i < 2 ? String(i + 4) : ""} className="h-10 w-full rounded border border-border bg-input-background text-center font-mono text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" aria-label={`OTP digit ${i + 1}`} />
                  ))}
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground" lang={lang}>{lang === "ta" ? "பதிவு செய்யப்பட்ட எண்ணுக்கு குறியீடு அனுப்பப்பட்டது." : "Code sent to your registered number."}</p>
              </div>
            )}

            {error && (
              <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy || (!otp && (!email || !password))}
              className="flex w-full items-center justify-center gap-2 rounded bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? (
                <Loader2 size={15} className="animate-spin" aria-hidden="true" />
              ) : (
                <>
                  {otp ? (lang === "ta" ? "சரிபார்த்து உள்நுழை" : "Verify & sign in") : (lang === "ta" ? "உள்நுழை" : "Sign in")}
                  <ArrowRight size={15} aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] text-muted-foreground">© 2026 Government of Tamil Nadu · DIPR</p>
        </div>
      </div>
    </div>
  );
}
