import { useState, useEffect, useRef } from "react";
import type { Screen, Settings } from "../../types/index";
import { PURPLE, ORANGE, ORANGE_DIM, PURPLE_DIM, PURPLE_BORDER, CARD, DEFAULT_SETTINGS, isMorningSlot } from "../../constants/theme";
import { TopBar, Page } from "../../components/Layout";
import { IcoClock } from "../../components/Icons";

export function CheckoutScreen({ onNav, onBack, settings = DEFAULT_SETTINGS, booking }: { onNav: (s: Screen) => void; onBack: () => void; settings?: Settings; booking: { court: string; date: string; time: string; price: string } | null }) {
  const LOCK = 7 * 60;
  const [secs, setSecs] = useState(LOCK);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => { ref.current = setInterval(() => setSecs((s) => s <= 1 ? (clearInterval(ref.current!), 0) : s - 1), 1000); return () => clearInterval(ref.current!); }, []);
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const pct = (secs / LOCK) * 100;
  const expired = secs === 0;
  return (
    <>
      <TopBar title="Confirm Booking" onBack={onBack} />
      <Page>
        <div className="max-w-xl mx-auto">
          <div className="mt-5 rounded-2xl overflow-hidden" style={{ backgroundColor: expired ? "rgba(239,68,68,0.1)" : ORANGE_DIM, border: `1px solid ${expired ? "rgba(239,68,68,0.3)" : "rgba(249,115,22,0.3)"}` }}>
            <div className="px-4 pt-4 pb-3 flex items-center gap-3">
              <IcoClock />
              <p className="text-xs font-semibold flex-1" style={{ color: expired ? "#f87171" : ORANGE }}>{expired ? "Slot lock expired — please rebook" : "Slot locked — complete payment before time runs out"}</p>
              <span style={{ fontFamily: "Barlow Condensed, sans-serif", color: expired ? "#f87171" : ORANGE }} className="text-2xl font-black tabular-nums">{mm}:{ss}</span>
            </div>
            <div className="h-1 w-full" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}><div className="h-1 transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: expired ? "#ef4444" : pct > 30 ? ORANGE : "#ef4444" }} /></div>
          </div>
          <div className="mt-5 rounded-2xl p-5" style={{ backgroundColor: CARD }}>
            <div className="flex items-center justify-between mb-4">
              <span style={{ fontFamily: "Barlow Condensed, sans-serif" }} className="text-white font-black text-xl uppercase">Booking Summary</span>
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: PURPLE_DIM, color: "#c4b5fd" }}>🎾 Pickleball</span>
            </div>
            {!booking ? (
              <p className="text-gray-500 text-sm text-center py-4">No booking details available</p>
            ) : (
              <>
            {[{ l: "Venue", v: "AFMC Pickle Hub" }, { l: "Court", v: booking.court }, { l: "Date", v: booking.date }, { l: "Time", v: booking.time }].map(({ l, v }) => (
              <div key={l} className="flex justify-between items-start py-2.5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <span className="text-gray-400 text-sm">{l}</span>
                <span className="text-white text-sm font-medium text-right">{v}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4">
              <span className="text-white font-semibold">Total</span>
              <div className="text-right">
                <span style={{ fontFamily: "Barlow Condensed, sans-serif", color: "#c4b5fd" }} className="font-black text-2xl">{booking.price}</span>
                {booking.time && <p className="text-gray-500 text-xs">{isMorningSlot(booking.time) ? "Morning rate" : "Evening rate"}</p>}
              </div>
            </div>
            </>
            )}
          </div>
          <div className="mt-4 px-4 py-3 rounded-xl flex gap-2.5 items-start" style={{ backgroundColor: PURPLE_DIM, border: `1px solid ${PURPLE_BORDER}` }}>
            <span className="mt-0.5" style={{ color: "#a78bfa" }}>ℹ️</span>
            <p className="text-gray-400 text-xs leading-relaxed">Free cancellation within <span className="text-white font-semibold">3 days</span> of booking. GCash payment required to confirm your slot.</p>
          </div>
          <button disabled={expired || !booking} onClick={() => !expired && booking && onNav("payment")}
            className="w-full mt-5 py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-95 disabled:opacity-40"
            style={{ background: expired || !booking ? "#374151" : `linear-gradient(135deg, ${PURPLE}, ${ORANGE})` }}>
            {expired ? "Session Expired" : !booking ? "No Booking Selected" : "Proceed to GCash Payment →"}
          </button>
          <button onClick={onBack} className="w-full py-3 text-gray-500 text-sm font-medium">Choose a different slot</button>
        </div>
      </Page>
    </>
  );
}
