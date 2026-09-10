import { useState } from "react";
import { BG, CARD, ORANGE, ORANGE_DIM, PURPLE, PURPLE_BORDER, PURPLE_DIM } from "../../constants/theme";
import { AFMCLogo } from "../../components/Layout";

export function LoginScreen({ onLogin, onRegister }: { onLogin: (asAdmin: boolean) => void; onRegister: () => void }) {
  type Role = "player" | "admin" | null;
  const [role, setRole] = useState<Role>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const ADMIN_PASS = "admin2026";

  const handleSubmit = () => {
    if (email.trim().length < 3 || !password) { setError("Please fill in all fields."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (role === "admin") {
        if (password !== ADMIN_PASS) { setError("Incorrect admin password."); return; }
        onLogin(true);
      } else {
        onLogin(false);
      }
    }, 900);
  };

  const roleCards: { id: Role; icon: string; title: string; sub: string; color: string; dimBg: string; border: string }[] = [
    { id: "player", icon: "🎾", title: "I'm a Player", sub: "Book courts, chat & join the community", color: "#c4b5fd", dimBg: PURPLE_DIM, border: PURPLE_BORDER },
    { id: "admin", icon: "🛡️", title: "Admin Access", sub: "Manage courts, newsfeed & settings", color: ORANGE, dimBg: ORANGE_DIM, border: "rgba(249,115,22,0.35)" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10 relative overflow-hidden"
      style={{ backgroundColor: BG }}>
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, ${PURPLE} 0%, transparent 70%)`, filter: "blur(48px)" }} />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full opacity-10 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, ${ORANGE} 0%, transparent 70%)`, filter: "blur(60px)" }} />

      <div className="relative w-full max-w-sm">
        {/* Branding */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-white text-2xl mb-4"
            style={{ background: `linear-gradient(135deg, ${PURPLE} 0%, ${ORANGE} 100%)`, fontFamily: "Barlow Condensed, sans-serif" }}>
            AF
          </div>
          <h1 style={{ fontFamily: "Barlow Condensed, sans-serif" }}
            className="text-white font-black text-4xl uppercase tracking-widest leading-none mb-1">
            AFMC
          </h1>
          <p className="text-sm font-semibold tracking-widest" style={{ color: ORANGE }}>PICKLE HUB</p>
          <p className="text-xs mt-2 italic" style={{ color: "rgba(167,139,250,0.6)" }}>Serve. Rally. Believe.</p>
        </div>

        {/* Step 1 — Role selection */}
        {!role && (
          <div>
            <p className="text-center text-gray-400 text-sm mb-5">Choose how you want to sign in</p>
            <div className="flex flex-col gap-3">
              {roleCards.map((c) => (
                <button key={c.id} onClick={() => setRole(c.id)}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all active:scale-[0.98] hover:scale-[1.01]"
                  style={{ backgroundColor: CARD, border: `1.5px solid rgba(255,255,255,0.07)` }}>
                  <span className="text-3xl">{c.icon}</span>
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm">{c.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5 leading-snug">{c.sub}</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4l4 4-4 4" stroke={c.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              ))}
            </div>
            <p className="text-center text-gray-600 text-xs mt-8">
              By continuing you agree to AFMC's terms of service.
            </p>
          </div>
        )}

        {/* Step 2 — Login form */}
        {role && (
          <div>
            {/* Role badge + back */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => { setRole(null); setError(""); setEmail(""); setPassword(""); }}
                className="flex items-center gap-1.5 text-gray-400 text-xs hover:text-white transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back
              </button>
              <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: role === "admin" ? ORANGE_DIM : PURPLE_DIM,
                  color: role === "admin" ? ORANGE : "#c4b5fd",
                }}>
                {role === "admin" ? "🛡️ Admin Login" : "🎾 Player Login"}
              </span>
            </div>

            {/* Admin warning */}
            {role === "admin" && (
              <div className="mb-5 px-4 py-3 rounded-xl flex gap-2.5 items-start"
                style={{ backgroundColor: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.25)" }}>
                <span className="mt-0.5 text-sm" style={{ color: ORANGE }}>⚠️</span>
                <p className="text-xs leading-relaxed" style={{ color: ORANGE }}>
                  Admin access is restricted. Contact AFMC management if you need credentials.
                </p>
              </div>
            )}

            <p className="text-white font-bold text-xl mb-6" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
              {role === "admin" ? "Admin Sign In" : "Welcome Back"}
            </p>

            <div className="flex flex-col gap-4">
              {/* Email */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-2"
                  style={{ color: "rgba(167,139,250,0.7)" }}>
                  {role === "admin" ? "Admin Username" : "Username"}
                </label>
                <input
                  type="text"
                  placeholder={role === "admin" ? "Enter admin username" : "Enter your username"}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value.replace(/\s/g, "")); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full px-4 py-3.5 rounded-2xl text-white text-sm placeholder-gray-600 focus:outline-none transition-all"
                  style={{
                    backgroundColor: CARD,
                    border: `1.5px solid ${email.length >= 3 ? "rgba(22,163,74,0.5)" : "rgba(255,255,255,0.1)"}`,
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-2"
                  style={{ color: "rgba(167,139,250,0.7)" }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder={role === "admin" ? "Enter admin password" : "Enter your password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    className="w-full px-4 py-3.5 pr-12 rounded-2xl text-white text-sm placeholder-gray-600 focus:outline-none transition-all"
                    style={{
                      backgroundColor: CARD,
                      border: `1.5px solid ${error ? "rgba(239,68,68,0.5)" : password.length >= 6 ? "rgba(22,163,74,0.5)" : "rgba(255,255,255,0.1)"}`,
                    }}
                  />
                  <button onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors text-xs font-semibold">
                    {showPw ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="px-4 py-2.5 rounded-xl flex gap-2 items-center"
                  style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
                  <span className="text-sm">⚠️</span>
                  <p className="text-xs" style={{ color: "#f87171" }}>{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-1 py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                style={{ background: role === "admin" ? `linear-gradient(135deg, #92400e, ${ORANGE})` : `linear-gradient(135deg, ${PURPLE}, ${ORANGE})` }}>
                {loading
                  ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Signing in…</>
                  : role === "admin" ? "Access Admin Panel →" : "Sign In →"}
              </button>

              {role === "player" && (
                <div className="text-center space-y-2 mt-1">
                  <button type="button" onClick={() => setForgotSent(true)}
                    className="text-xs font-semibold hover:opacity-80 transition-opacity" style={{ color: "#a78bfa" }}>
                    {forgotSent ? "✓ Reset link sent!" : "Forgot password?"}
                  </button>
                  <p className="text-gray-600 text-xs">Don't have an account? <button onClick={onRegister} className="font-semibold" style={{ color: "#c4b5fd" }}>Create one</button></p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}