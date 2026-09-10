import { useState } from "react";
import type { Settings } from "../../types/index";
import { ORANGE, CARD, PURPLE, PURPLE_DIM, PURPLE_BORDER, SURFACE, BG } from "../../constants/theme";
import { TopBar, Page } from "../../components/Layout";

export function AdminSettingsScreen({ settings, patchSettings, onBack }: { settings: Settings; patchSettings: (p: Partial<Settings>) => void; onBack: () => void }) {
  type Tab = "pricing" | "payment" | "courts" | "hours" | "venue";
  const [tab, setTab] = useState<Tab>("pricing");
  const [saved, setSaved] = useState<Tab | null>(null);
  const [draft, setDraft] = useState({ ...settings });
  const patch = (key: keyof Settings, val: unknown) => setDraft((d) => ({ ...d, [key]: val }));

  const save = () => {
    patchSettings(draft);
    setSaved(tab);
    setTimeout(() => setSaved(null), 2000);
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "pricing", label: "Pricing", icon: "💰" },
    { id: "payment", label: "Payment", icon: "💳" },
    { id: "courts", label: "Courts", icon: "🎾" },
    { id: "hours", label: "Hours", icon: "🕐" },
    { id: "venue", label: "Venue", icon: "🏟️" },
  ];

  const inputClass = "w-full px-4 py-3 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none transition-all";
  const inputStyle = { backgroundColor: CARD, border: "1.5px solid rgba(255,255,255,0.1)" };
  const labelClass = "text-xs font-semibold uppercase tracking-widest block mb-2";
  const labelStyle = { color: "rgba(167,139,250,0.7)" };

  return (
    <>
      <TopBar title="Admin Settings" onBack={onBack} isAdmin />
      <Page noPad>
        {/* Tab bar */}
        <div className="flex border-b overflow-x-auto scrollbar-hide" style={{ borderColor: "rgba(124,58,237,0.15)" }}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-3.5 text-xs font-bold tracking-wide transition-colors"
              style={{ color: tab === t.id ? ORANGE : "#6b7280", borderBottom: tab === t.id ? `2px solid ${ORANGE}` : "2px solid transparent" }}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        <div className="px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto pb-32">

          {/* PRICING TAB */}
          {tab === "pricing" && (
            <div className="mt-6 flex flex-col gap-5">
              <div className="rounded-2xl p-5" style={{ backgroundColor: CARD, border: "1px solid rgba(124,58,237,0.2)" }}>
                <p style={{ fontFamily: "Barlow Condensed, sans-serif" }} className="text-white font-black text-lg uppercase mb-4">Court Rates</p>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className={labelClass} style={labelStyle}>Morning Rate (₱/hour)</label>
                    <p className="text-gray-500 text-xs mb-2">Applies to {draft.openTime} – {draft.morningCutoff}</p>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₱</span>
                      <input type="number" min={0} step={50} value={draft.morningRate}
                        onChange={(e) => patch("morningRate", Number(e.target.value))}
                        className={inputClass + " pl-8"} style={{ ...inputStyle, borderColor: "rgba(167,139,250,0.3)" }} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass} style={labelStyle}>Evening Rate (₱/hour)</label>
                    <p className="text-gray-500 text-xs mb-2">Applies to {draft.morningCutoff} – {draft.closeTime}</p>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₱</span>
                      <input type="number" min={0} step={50} value={draft.eveningRate}
                        onChange={(e) => patch("eveningRate", Number(e.target.value))}
                        className={inputClass + " pl-8"} style={{ ...inputStyle, borderColor: "rgba(249,115,22,0.3)" }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-5" style={{ backgroundColor: CARD }}>
                <p style={{ fontFamily: "Barlow Condensed, sans-serif" }} className="text-white font-black text-lg uppercase mb-4">Additional Fees</p>
                <div>
                  <label className={labelClass} style={labelStyle}>Paddle Rental (₱/session)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₱</span>
                    <input type="number" min={0} step={10} value={draft.paddleRental}
                      onChange={(e) => patch("paddleRental", Number(e.target.value))}
                      className={inputClass + " pl-8"} style={inputStyle} />
                  </div>
                </div>
              </div>

              {/* Live preview */}
              <div className="rounded-2xl p-4" style={{ background: `linear-gradient(135deg, ${PURPLE_DIM}, rgba(249,115,22,0.1))`, border: `1px solid ${PURPLE_BORDER}` }}>
                <p className="text-xs font-semibold mb-2" style={{ color: "#a78bfa" }}>Rate Preview</p>
                <div className="flex gap-4">
                  <div className="flex-1 text-center">
                    <p style={{ fontFamily: "Barlow Condensed, sans-serif", color: "#c4b5fd" }} className="font-black text-3xl">₱{draft.morningRate}</p>
                    <p className="text-gray-500 text-xs">Morning</p>
                  </div>
                  <div className="w-px" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
                  <div className="flex-1 text-center">
                    <p style={{ fontFamily: "Barlow Condensed, sans-serif", color: ORANGE }} className="font-black text-3xl">₱{draft.eveningRate}</p>
                    <p className="text-gray-500 text-xs">Evening</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAYMENT TAB */}
          {tab === "payment" && (
            <div className="mt-6 flex flex-col gap-5">
              <div className="rounded-2xl p-5" style={{ backgroundColor: CARD, border: "1px solid rgba(124,58,237,0.2)" }}>
                <p style={{ fontFamily: "Barlow Condensed, sans-serif" }} className="text-white font-black text-lg uppercase mb-4">GCash Details</p>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className={labelClass} style={labelStyle}>GCash Mobile Number</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">+63</span>
                      <input type="tel" placeholder="09XXXXXXXXX" maxLength={11} value={draft.gcashNumber}
                        onChange={(e) => patch("gcashNumber", e.target.value.replace(/\D/g, ""))}
                        className={inputClass + " pl-12"} style={inputStyle} />
                    </div>
                    <p className="text-gray-600 text-xs mt-1.5 pl-1">{draft.gcashNumber.length}/11 digits</p>
                  </div>
                  <div>
                    <label className={labelClass} style={labelStyle}>GCash Account Name</label>
                    <input type="text" placeholder="Full account name" value={draft.gcashName}
                      onChange={(e) => patch("gcashName", e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="rounded-2xl p-4 text-center" style={{ background: "linear-gradient(135deg, #0070e0 0%, #00457c 100%)" }}>
                <p className="text-blue-200 text-xs mb-1">Players will send payment to</p>
                <p className="text-white font-bold text-lg tracking-widest">{draft.gcashNumber || "—"}</p>
                <p className="text-blue-200 text-xs mt-0.5">{draft.gcashName.toUpperCase() || "—"}</p>
              </div>

              <div className="px-4 py-3 rounded-xl flex gap-2 items-start" style={{ backgroundColor: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.25)" }}>
                <span style={{ color: ORANGE }}>⚠️</span>
                <p className="text-xs leading-relaxed" style={{ color: ORANGE }}>Changes take effect immediately. Players on the checkout screen will see the updated number.</p>
              </div>
            </div>
          )}

          {/* COURTS TAB */}
          {tab === "courts" && (
            <div className="mt-6 flex flex-col gap-4">
              <p className="text-gray-400 text-sm">Toggle availability and rename courts. Color is set at the surface level.</p>
              {draft.courts.map((court, idx) => (
                <div key={court.id} className="rounded-2xl p-5" style={{ backgroundColor: CARD, border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: court.color === "Purple" ? PURPLE : ORANGE }} />
                      <p style={{ fontFamily: "Barlow Condensed, sans-serif" }} className="text-white font-black text-base uppercase">{court.name}</p>
                    </div>
                    {/* Toggle */}
                    <button onClick={() => {
                      const updated = draft.courts.map((c, i) => i === idx ? { ...c, available: !c.available } : c);
                      patch("courts", updated);
                    }} className="relative w-12 h-6 rounded-full transition-all flex-shrink-0"
                      style={{ backgroundColor: court.available ? "#16a34a" : "#374151" }}>
                      <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                        style={{ left: court.available ? "calc(100% - 22px)" : "2px" }} />
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className={labelClass} style={labelStyle}>Court Name</label>
                      <input type="text" value={court.name}
                        onChange={(e) => {
                          const updated = draft.courts.map((c, i) => i === idx ? { ...c, name: e.target.value } : c);
                          patch("courts", updated);
                        }}
                        className={inputClass} style={inputStyle} />
                    </div>
                    <div>
                      <label className={labelClass} style={labelStyle}>Surface Color</label>
                      <div className="flex gap-2">
                        {["Purple", "Orange"].map((col) => (
                          <button key={col} onClick={() => {
                            const updated = draft.courts.map((c, i) => i === idx ? { ...c, color: col } : c);
                            patch("courts", updated);
                          }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                            style={{ backgroundColor: court.color === col ? (col === "Purple" ? PURPLE_DIM : "rgba(249,115,22,0.15)") : SURFACE, color: court.color === col ? (col === "Purple" ? "#c4b5fd" : ORANGE) : "#9ca3af", border: `1.5px solid ${court.color === col ? (col === "Purple" ? PURPLE_BORDER : "rgba(249,115,22,0.35)") : "rgba(255,255,255,0.08)"}` }}>
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col === "Purple" ? PURPLE : ORANGE }} />
                            {col}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t flex items-center gap-2" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: court.available ? "#22c55e" : "#ef4444" }} />
                    <span className="text-xs font-semibold" style={{ color: court.available ? "#34d399" : "#f87171" }}>
                      {court.available ? "Court is open for booking" : "Court is closed — hidden from booking"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* HOURS TAB */}
          {tab === "hours" && (
            <div className="mt-6 flex flex-col gap-5">
              <div className="rounded-2xl p-5" style={{ backgroundColor: CARD, border: "1px solid rgba(124,58,237,0.2)" }}>
                <p style={{ fontFamily: "Barlow Condensed, sans-serif" }} className="text-white font-black text-lg uppercase mb-4">Operating Hours</p>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Opening Time", key: "openTime" as keyof Settings, placeholder: "e.g. 6:00 AM" },
                    { label: "Closing Time", key: "closeTime" as keyof Settings, placeholder: "e.g. 9:00 PM" },
                    { label: "Morning/Evening Cutoff", key: "morningCutoff" as keyof Settings, placeholder: "e.g. 12:00 PM" },
                  ].map(({ label, key, placeholder }) => (
                    <div key={String(key)}>
                      <label className={labelClass} style={labelStyle}>{label}</label>
                      <input type="text" placeholder={placeholder} value={draft[key] as string}
                        onChange={(e) => patch(key, e.target.value)}
                        className={inputClass} style={inputStyle} />
                    </div>
                  ))}
                </div>
              </div>
              {/* Schedule preview */}
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="px-4 py-3" style={{ backgroundColor: SURFACE }}>
                  <p className="text-white font-bold text-sm">Schedule Preview</p>
                </div>
                <div style={{ backgroundColor: CARD }}>
                  {[
                    { label: "Morning Session", time: `${draft.openTime} – ${draft.morningCutoff}`, rate: draft.morningRate, color: "#c4b5fd" },
                    { label: "Evening Session", time: `${draft.morningCutoff} – ${draft.closeTime}`, rate: draft.eveningRate, color: ORANGE },
                  ].map(({ label, time, rate, color }) => (
                    <div key={label} className="flex items-center justify-between px-4 py-3.5 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                      <div>
                        <p className="text-white text-sm font-semibold">{label}</p>
                        <p className="text-gray-500 text-xs">{time}</p>
                      </div>
                      <p style={{ fontFamily: "Barlow Condensed, sans-serif", color }} className="font-black text-xl">₱{rate}/hr</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VENUE TAB */}
          {tab === "venue" && (
            <div className="mt-6 flex flex-col gap-5">
              <div className="rounded-2xl p-5" style={{ backgroundColor: CARD, border: "1px solid rgba(124,58,237,0.2)" }}>
                <p style={{ fontFamily: "Barlow Condensed, sans-serif" }} className="text-white font-black text-lg uppercase mb-4">Venue Info</p>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className={labelClass} style={labelStyle}>Venue Name</label>
                    <input type="text" value={draft.venueName} onChange={(e) => patch("venueName", e.target.value)} className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className={labelClass} style={labelStyle}>Tagline / Slogan</label>
                    <input type="text" value={draft.venueTagline} onChange={(e) => patch("venueTagline", e.target.value)} className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className={labelClass} style={labelStyle}>Location / Address</label>
                    <input type="text" value={draft.venueLocation} onChange={(e) => patch("venueLocation", e.target.value)} className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className={labelClass} style={labelStyle}>Description</label>
                    <textarea rows={4} value={draft.venueDesc} onChange={(e) => patch("venueDesc", e.target.value)}
                      className={inputClass + " resize-none"} style={inputStyle} />
                  </div>
                </div>
              </div>
              {/* Preview card */}
              <div className="rounded-2xl p-4" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(249,115,22,0.1) 100%)", border: "1px solid rgba(124,58,237,0.25)" }}>
                <p style={{ fontFamily: "Barlow Condensed, sans-serif", color: ORANGE }} className="font-black text-xl uppercase tracking-wider mb-1">{draft.venueTagline || "—"}</p>
                <p className="text-white font-bold text-sm mb-1">{draft.venueName || "—"}</p>
                <p className="text-gray-400 text-xs">{draft.venueLocation || "—"}</p>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Save bar */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-60 px-4 py-4 z-50" style={{ backgroundColor: `${BG}f7`, backdropFilter: "blur(14px)", borderTop: "1px solid rgba(124,58,237,0.15)" }}>
          <button onClick={save}
            className="w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-95"
            style={{ background: saved === tab ? "rgba(22,163,74,0.8)" : `linear-gradient(135deg, ${PURPLE}, ${ORANGE})`, color: "white" }}>
            {saved === tab ? "✓ Changes Saved!" : `Save ${tabs.find((t) => t.id === tab)?.label} Settings`}
          </button>
        </div>
      </Page>
    </>
  );
}

export default AdminSettingsScreen;
