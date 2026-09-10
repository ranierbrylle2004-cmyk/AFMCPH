import { useState } from "react";
import type { Screen, Settings } from "../../types/index";
import { PURPLE, ORANGE, PURPLE_DIM, PURPLE_BORDER, CARD, SURFACE, DEFAULT_SETTINGS } from "../../constants/theme";
import { TopBar, Page } from "../../components/Layout";

export function PricingScreen({ onNav, onBack, settings = DEFAULT_SETTINGS }: { onNav: (s: Screen) => void; onBack: () => void; settings?: Settings }) {
  const [selectedSession, setSelectedSession] = useState<"morning" | "evening" | null>(null);

  const morningHours = `${settings.openTime} – ${settings.morningCutoff}`;
  const eveningHours = `${settings.morningCutoff} – ${settings.closeTime}`;

  const rateCards = [
    {
      id: "morning" as const,
      icon: "🌅",
      label: "Morning Rate",
      hours: morningHours,
      rate: settings.morningRate,
      color: "#c4b5fd",
      colorDim: PURPLE_DIM,
      border: PURPLE_BORDER,
      desc: "Perfect for early birds and weekend warriors.",
    },
    {
      id: "evening" as const,
      icon: "🌆",
      label: "Evening Rate",
      hours: eveningHours,
      rate: settings.eveningRate,
      color: ORANGE,
      colorDim: "rgba(249,115,22,0.15)",
      border: "rgba(249,115,22,0.35)",
      desc: "Prime time courts — ideal for after-work sessions.",
    },
  ];

  const availableCount = settings.courts.filter((c) => c.available).length;

  return (
    <>
      <TopBar title="Court Rates" onBack={onBack} />
      <Page>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mt-6 mb-7">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
                style={{ backgroundColor: "rgba(22,163,74,0.12)", color: "#34d399", borderColor: "rgba(22,163,74,0.3)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                {availableCount} of {settings.courts.length} Courts Open
              </span>
            </div>
            <h1 style={{ fontFamily: "Barlow Condensed, sans-serif", lineHeight: 1.0 }}
              className="text-white font-black text-5xl uppercase tracking-tight mb-2">
              Court <span style={{ color: ORANGE }}>Rates</span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Simple, transparent pricing — no hidden fees. Tap a rate to pre-select it before booking.
            </p>
          </div>

          {/* Rate cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {rateCards.map((card) => {
              const active = selectedSession === card.id;
              return (
                <button key={card.id} onClick={() => setSelectedSession(active ? null : card.id)}
                  className="rounded-2xl p-6 text-left transition-all active:scale-[0.98]"
                  style={{
                    background: active
                      ? `linear-gradient(135deg, ${card.colorDim}, transparent)`
                      : `linear-gradient(135deg, ${card.colorDim.replace("0.18", "0.1").replace("0.15", "0.08")}, transparent)`,
                    border: `1.5px solid ${active ? card.color + "88" : card.border}`,
                    boxShadow: active ? `0 0 24px ${card.colorDim}` : "none",
                  }}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">{card.icon}</span>
                    <div>
                      <p className="text-white font-bold text-sm">{card.label}</p>
                      <p className="text-gray-500 text-xs">{card.hours}</p>
                    </div>
                    {active && (
                      <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: card.colorDim, color: card.color }}>Selected</span>
                    )}
                  </div>
                  <div className="flex items-end gap-1 mb-1">
                    <span style={{ fontFamily: "Barlow Condensed, sans-serif", color: card.color }} className="font-black text-6xl leading-none">
                      ₱{card.rate}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mb-3">per court · per hour</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{card.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Rate comparison table */}
          <div className="rounded-2xl overflow-hidden mb-8" style={{ border: `1px solid rgba(255,255,255,0.07)` }}>
            <div className="px-5 py-3.5 flex items-center justify-between" style={{ backgroundColor: SURFACE }}>
              <span className="text-white font-bold text-sm">Rate Comparison</span>
              <span className="text-xs font-semibold" style={{ color: "#a78bfa" }}>{settings.courts.length} Courts Total</span>
            </div>
            <div style={{ backgroundColor: CARD }}>
              {[
                { label: `Morning (${settings.openTime} – ${settings.morningCutoff})`, rate: `₱${settings.morningRate}/hr`, accent: "#c4b5fd" },
                { label: `Evening (${settings.morningCutoff} – ${settings.closeTime})`, rate: `₱${settings.eveningRate}/hr`, accent: ORANGE },
                { label: "Minimum booking", rate: "1 hour", accent: "#9ca3af" },
                { label: "Paddle rental", rate: `₱${settings.paddleRental}/session`, accent: "#9ca3af" },
              ].map(({ label, rate, accent }, i, arr) => (
                <div key={label} className="flex items-center justify-between px-5 py-3.5"
                  style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <span className="text-gray-400 text-sm">{label}</span>
                  <span className="font-bold text-sm" style={{ color: accent }}>{rate}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Courts */}
          <div className="mb-8">
            <h2 style={{ fontFamily: "Barlow Condensed, sans-serif" }} className="text-white font-black text-2xl uppercase tracking-tight mb-3">
              The Courts
            </h2>
            <div className="flex flex-col gap-2">
              {settings.courts.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-4 py-3.5 rounded-xl transition-all"
                  style={{ backgroundColor: CARD, border: `1px solid rgba(255,255,255,0.05)` }}>
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: c.color === "Purple" ? PURPLE : ORANGE }} />
                    <div>
                      <p className="text-white text-sm font-semibold">{c.name}</p>
                      <p className="text-gray-500 text-xs">{c.color} Surface · PDDLAB Net</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: c.available ? "rgba(22,163,74,0.15)" : "rgba(239,68,68,0.15)", color: c.available ? "#34d399" : "#f87171" }}>
                    {c.available ? "Available" : "Booked"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* What's included */}
          <div className="rounded-2xl p-5 mb-5" style={{ backgroundColor: CARD }}>
            <p className="text-white font-bold text-sm mb-3">Every booking includes</p>
            {[
              "Full court access for the reserved hour",
              "PDDLAB tournament-grade net",
              "Indoor covered arena — weather proof",
              "Comfort rooms on-site",
              "Online 24/7 booking via Respawn",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 py-1.5">
                <span className="text-sm" style={{ color: "#34d399" }}>✓</span>
                <span className="text-gray-400 text-sm">{item}</span>
              </div>
            ))}
          </div>

          {/* Policy */}
          <div className="rounded-2xl p-5 mb-8" style={{ backgroundColor: CARD, border: `1px solid rgba(249,115,22,0.2)` }}>
            <p className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: ORANGE }}>📋 Booking Policies</p>
            {[
              "Minimum 1 hour per court. No split-hour bookings.",
              "Free cancellation within 3 days of booking.",
              "Payment via GCash only — submit receipt for verification.",
              "Proper athletic footwear required. No slippers or sandals.",
              "Pack up 10 minutes before your slot ends.",
            ].map((rule) => (
              <p key={rule} className="text-gray-400 text-xs flex gap-2 mb-1.5 leading-relaxed">
                <span style={{ color: ORANGE }}>›</span>{rule}
              </p>
            ))}
          </div>

          {/* CTA */}
          <button onClick={() => onNav("calendar")}
            className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-95 mb-4"
            style={{ background: `linear-gradient(135deg, ${PURPLE}, ${ORANGE})` }}>
            Book a Court →
          </button>
          <p className="text-center text-gray-600 text-xs mb-8">Questions? Chat with AFMC Support in the Messages tab.</p>
        </div>
      </Page>
    </>
  );
}
