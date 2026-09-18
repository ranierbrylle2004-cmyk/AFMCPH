import { useState } from "react";
import { BG, CARD, ORANGE, PURPLE, PURPLE_BORDER, PURPLE_DIM } from "../../constants/theme";
import { AFMCLogo } from "../../components/Layout";
import { api } from "../../utils/api";

export function RegisterScreen({ onLogin, onBack, setCurrentUser }: { onLogin: (user?: any) => void; onBack: () => void; setCurrentUser?: (user: any) => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [skillLevel, setSkillLevel] = useState<string>("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const SKILL_LEVELS = [
    { id: "beginner", label: "Beginner", sub: "New to pickleball" },
    { id: "intermediate", label: "Intermediate", sub: "2.5 – 3.5 level" },
    { id: "advanced", label: "Advanced", sub: "4.0+ competitive" },
  ];

  const usernameValid = /^[a-zA-Z0-9_]{3,}$/.test(email);
  const pwMatch = password === confirm && password.length >= 8;

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "First name required";
    if (!lastName.trim()) e.lastName = "Last name required";
    if (!usernameValid) e.email = "Username must be at least 3 characters (letters, numbers, _)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!skillLevel) e.skill = "Pick your skill level";
    if (password.length < 8) e.password = "Password must be at least 8 characters";
    if (!pwMatch) e.confirm = "Passwords don't match";
    if (!agreeTerms) e.terms = "You must agree to continue";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validateStep1()) setStep(2); };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    
    try {
      const result = await api.register({
        email,
        password,
        firstName,
        lastName,
        skillLevel,
      });
      
      setLoading(false);
      
      if (result.error) {
        setErrors({ email: result.error });
        return;
      }
      
      if (setCurrentUser) {
        setCurrentUser(result);
      }
      
      setDone(true);
    } catch (error) {
      setLoading(false);
      setErrors({ email: "Registration failed. Please try again." });
    }
  };

  const inputBase = "w-full px-4 py-3.5 rounded-2xl text-white text-sm placeholder-gray-600 focus:outline-none transition-all";
  const inputStyle = (valid?: boolean, err?: string) => ({
    backgroundColor: CARD,
    border: `1.5px solid ${err ? "rgba(239,68,68,0.5)" : valid ? "rgba(22,163,74,0.5)" : "rgba(255,255,255,0.1)"}`,
  });

  if (done) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10 relative overflow-hidden"
      style={{ backgroundColor: BG }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, ${PURPLE} 0%, transparent 70%)`, filter: "blur(48px)" }} />
      <div className="relative w-full max-w-sm text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6"
          style={{ background: `linear-gradient(135deg, rgba(22,163,74,0.25), rgba(22,163,74,0.1))`, border: "2px solid rgba(22,163,74,0.5)" }}>
          ✓
        </div>
        <h2 style={{ fontFamily: "Barlow Condensed, sans-serif" }}
          className="text-white font-black text-4xl uppercase tracking-tight mb-2">
          You're In!
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-2">
          Welcome to AFMC Pickle Hub, <span className="text-white font-semibold">{firstName}</span>!
        </p>
        <p className="text-gray-500 text-xs leading-relaxed mb-8">
          Your account has been created. You can now book courts, join the community feed, and message other players.
        </p>
        <div className="rounded-2xl p-4 mb-8 text-left" style={{ backgroundColor: CARD, border: `1px solid ${PURPLE_BORDER}` }}>
          {[
            { l: "Name", v: `${firstName} ${lastName}` },
            { l: "Username", v: `@${email}` },
            { l: "Skill Level", v: SKILL_LEVELS.find((s) => s.id === skillLevel)?.label ?? skillLevel },
          ].map(({ l, v }) => (
            <div key={l} className="flex justify-between py-2 border-b text-sm" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <span className="text-gray-400">{l}</span>
              <span className="text-white font-medium">{v}</span>
            </div>
          ))}
        </div>
        <button onClick={onLogin}
          className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-95"
          style={{ background: `linear-gradient(135deg, ${PURPLE}, ${ORANGE})` }}>
          Go to Home →
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-5 py-10 relative overflow-hidden"
      style={{ backgroundColor: BG }}>
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] rounded-full opacity-15 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, ${PURPLE} 0%, transparent 70%)`, filter: "blur(48px)" }} />

      <div className="relative w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={step === 2 ? () => setStep(1) : onBack}
            className="flex items-center gap-1.5 text-gray-400 text-xs hover:text-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {step === 2 ? "Back" : "Sign In"}
          </button>
          <div className="flex items-center gap-1.5">
            <AFMCLogo size={24} />
            <span style={{ fontFamily: "Barlow Condensed, sans-serif", color: ORANGE }} className="font-black text-sm tracking-widest">AFMC</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-7">
          {([1, 2] as const).map((n) => (
            <div key={n} className="h-1 flex-1 rounded-full transition-all duration-500"
              style={{ backgroundColor: step >= n ? PURPLE : "rgba(255,255,255,0.1)" }} />
          ))}
        </div>

        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "rgba(167,139,250,0.6)" }}>
          Step {step} of 2
        </p>
        <h1 style={{ fontFamily: "Barlow Condensed, sans-serif" }}
          className="text-white font-black text-3xl uppercase tracking-tight mb-1">
          {step === 1 ? "Create Account" : "Set Your Level"}
        </h1>
        <p className="text-gray-500 text-sm mb-7">
          {step === 1 ? "Join the AFMC Pickle Hub community." : "Almost done — just a few more details."}
        </p>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "rgba(167,139,250,0.7)" }}>First Name</label>
                <input type="text" placeholder="Juan" value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); setErrors((p) => ({ ...p, firstName: "" })); }}
                  className={inputBase} style={inputStyle(firstName.trim().length > 0, errors.firstName)} />
                {errors.firstName && <p className="text-red-400 text-[10px] mt-1 pl-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "rgba(167,139,250,0.7)" }}>Last Name</label>
                <input type="text" placeholder="Dela Cruz" value={lastName}
                  onChange={(e) => { setLastName(e.target.value); setErrors((p) => ({ ...p, lastName: "" })); }}
                  className={inputBase} style={inputStyle(lastName.trim().length > 0, errors.lastName)} />
                {errors.lastName && <p className="text-red-400 text-[10px] mt-1 pl-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "rgba(167,139,250,0.7)" }}>Username</label>
              <input type="text" placeholder="e.g. juan_pb" value={email}
                onChange={(e) => { setEmail(e.target.value.replace(/\s/g, "")); setErrors((p) => ({ ...p, email: "" })); }}
                className={inputBase} style={inputStyle(usernameValid, errors.email)} />
              {errors.email
                ? <p className="text-red-400 text-[10px] mt-1 pl-1">{errors.email}</p>
                : <p className="text-gray-600 text-[10px] mt-1 pl-1">Letters, numbers, and underscores only</p>}
            </div>

            <button onClick={handleNext}
              className="w-full mt-1 py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-95"
              style={{ background: `linear-gradient(135deg, ${PURPLE}, ${ORANGE})` }}>
              Continue →
            </button>

            <p className="text-center text-gray-600 text-xs">
              Already have an account?{" "}
              <button onClick={onBack} className="font-semibold" style={{ color: "#c4b5fd" }}>Sign in</button>
            </p>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            {/* Skill level selector */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "rgba(167,139,250,0.7)" }}>Skill Level</label>
              <div className="flex flex-col gap-2">
                {SKILL_LEVELS.map((s) => {
                  const active = skillLevel === s.id;
                  return (
                    <button key={s.id} onClick={() => { setSkillLevel(s.id); setErrors((p) => ({ ...p, skill: "" })); }}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all"
                      style={{
                        backgroundColor: active ? PURPLE_DIM : CARD,
                        border: `1.5px solid ${active ? PURPLE : "rgba(255,255,255,0.07)"}`,
                      }}>
                      <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={{ borderColor: active ? PURPLE : "#4b5563" }}>
                        {active && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PURPLE }} />}
                      </span>
                      <div className="flex-1">
                        <p className="text-white text-sm font-semibold">{s.label}</p>
                        <p className="text-gray-500 text-xs">{s.sub}</p>
                      </div>
                      {active && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: PURPLE_DIM, color: "#c4b5fd" }}>Selected</span>}
                    </button>
                  );
                })}
              </div>
              {errors.skill && <p className="text-red-400 text-[10px] mt-1 pl-1">{errors.skill}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "rgba(167,139,250,0.7)" }}>Create Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} placeholder="Min. 8 characters" value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "", confirm: "" })); }}
                  className={inputBase + " pr-16"} style={inputStyle(password.length >= 8, errors.password)} />
                <button onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-xs font-semibold transition-colors">
                  {showPw ? "HIDE" : "SHOW"}
                </button>
              </div>
              {/* Strength bar */}
              {password.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3].map((n) => {
                    const strength = password.length < 8 ? 1 : password.match(/[A-Z]/) && password.match(/\d/) ? 3 : 2;
                    return <div key={n} className="h-1 flex-1 rounded-full transition-all"
                      style={{ backgroundColor: n <= strength ? (strength === 3 ? "#16a34a" : strength === 2 ? ORANGE : "#ef4444") : "rgba(255,255,255,0.1)" }} />;
                  })}
                  <span className="text-[10px] ml-1" style={{ color: password.length < 8 ? "#f87171" : password.match(/[A-Z]/) && password.match(/\d/) ? "#34d399" : ORANGE }}>
                    {password.length < 8 ? "Weak" : password.match(/[A-Z]/) && password.match(/\d/) ? "Strong" : "Fair"}
                  </span>
                </div>
              )}
              {errors.password && <p className="text-red-400 text-[10px] mt-1 pl-1">{errors.password}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "rgba(167,139,250,0.7)" }}>Confirm Password</label>
              <input type={showPw ? "text" : "password"} placeholder="Repeat your password" value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setErrors((p) => ({ ...p, confirm: "" })); }}
                className={inputBase} style={inputStyle(confirm.length > 0 && pwMatch, errors.confirm)} />
              {errors.confirm && <p className="text-red-400 text-[10px] mt-1 pl-1">{errors.confirm}</p>}
            </div>

            {/* Terms */}
            <button onClick={() => { setAgreeTerms(!agreeTerms); setErrors((p) => ({ ...p, terms: "" })); }}
              className="flex items-start gap-3 text-left">
              <span className="mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all"
                style={{ backgroundColor: agreeTerms ? PURPLE : "transparent", borderColor: agreeTerms ? PURPLE : errors.terms ? "#ef4444" : "#4b5563" }}>
                {agreeTerms && <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </span>
              <p className="text-gray-400 text-xs leading-relaxed">
                I agree to AFMC Pickle Hub's <span className="font-semibold" style={{ color: "#c4b5fd" }}>Terms of Service</span> and{" "}
                <span className="font-semibold" style={{ color: "#c4b5fd" }}>Privacy Policy</span>
              </p>
            </button>
            {errors.terms && <p className="text-red-400 text-[10px] -mt-2 pl-8">{errors.terms}</p>}

            <button onClick={handleSubmit} disabled={loading}
              className="w-full mt-1 py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg, ${PURPLE}, ${ORANGE})` }}>
              {loading
                ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Creating account…</>
                : "Create My Account →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}