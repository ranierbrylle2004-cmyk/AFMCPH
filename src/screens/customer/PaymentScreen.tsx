import { useState, useRef } from "react";
import type { Screen, Settings, Booking } from "../../types/index";
import { PURPLE, ORANGE, PURPLE_DIM, CARD, DEFAULT_SETTINGS, BG, generateId } from "../../constants/theme";
import { TopBar, Page } from "../../components/Layout";
import { IcoUpload } from "../../components/Icons";

export function PaymentScreen({ onNav, onBack, settings = DEFAULT_SETTINGS, booking, onBookingComplete }: { onNav: (s: Screen) => void; onBack: () => void; settings?: Settings; booking: { court: string; date: string; time: string; price: string } | null; onBookingComplete: (booking: Booking) => void }) {
  const [mobile, setMobile] = useState("");
  const [txRef, setTxRef] = useState("");
  const [file, setFile] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const valid = mobile.length === 11 && txRef.length === 13 && file;
  return (
    <>
      <TopBar title="GCash Payment" onBack={onBack} />
      <Page>
        <div className="max-w-xl mx-auto">
          {!booking && (
            <div className="mt-5 rounded-2xl p-5 text-center" style={{ backgroundColor: CARD }}>
              <p className="text-gray-400 text-sm">No booking details available. Please select a time slot first.</p>
              <button onClick={() => onNav("calendar")} className="mt-4 px-6 py-3 rounded-xl text-white font-semibold" style={{ backgroundColor: PURPLE }}>Go to Calendar</button>
            </div>
          )}
          {booking && (
            <>
          <div className="mt-5 flex items-center gap-3 p-4 rounded-2xl" style={{ background: "linear-gradient(135deg, #0070e0 0%, #00457c 100%)" }}>
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">💙</div>
            <div><p className="text-white font-bold text-base">GCash Payment</p><p className="text-blue-200 text-xs">Secure & Instant Verification</p></div>
            <div className="ml-auto text-right"><p className="text-white/60 text-xs">Amount</p><p style={{ fontFamily: "Barlow Condensed, sans-serif", color: "#c4b5fd" }} className="font-black text-2xl">{booking?.price ?? "—"}</p></div>
          </div>
          <div className="mt-4 p-4 rounded-2xl text-center" style={{ backgroundColor: CARD }}>
            <p className="text-gray-400 text-xs mb-2">Send payment to AFMC Pickle Hub</p>
            <p className="text-white font-bold text-xl tracking-widest">{settings.gcashNumber.slice(0, 4)} ••• ••{settings.gcashNumber.slice(-2)}</p>
            <p className="text-xs font-semibold mt-1" style={{ color: PURPLE }}>{settings.gcashName.toUpperCase()}</p>
          </div>
          <div className="mt-5 flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "rgba(167,139,250,0.7)" }}>GCash Mobile Number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">+63</span>
                <input type="tel" placeholder="9XX XXX XXXX" maxLength={11} value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-white text-sm placeholder-gray-600 focus:outline-none transition-all"
                  style={{ backgroundColor: CARD, border: `1.5px solid ${mobile.length === 11 ? "rgba(22,163,74,0.5)" : "rgba(255,255,255,0.1)"}` }} />
                {mobile.length === 11 && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400">✓</span>}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "rgba(167,139,250,0.7)" }}>Transaction Reference Number</label>
              <input type="text" placeholder="13-digit reference" maxLength={13} value={txRef} onChange={(e) => setTxRef(e.target.value.replace(/\D/g, ""))}
                className="w-full px-4 py-3.5 rounded-2xl text-white text-sm placeholder-gray-600 focus:outline-none transition-all"
                style={{ backgroundColor: CARD, border: `1.5px solid ${txRef.length === 13 ? "rgba(22,163,74,0.5)" : "rgba(255,255,255,0.1)"}` }} />
              <p className="text-gray-600 text-xs mt-1.5 pl-1">{txRef.length}/13 digits</p>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "rgba(167,139,250,0.7)" }}>Upload GCash Receipt Screenshot</label>
              <button onClick={() => fileRef.current?.click()} className="w-full py-8 rounded-2xl flex flex-col items-center gap-3 transition-all active:scale-[0.98]"
                style={{ backgroundColor: file ? PURPLE_DIM : CARD, border: `1.5px dashed ${file ? PURPLE : "rgba(255,255,255,0.12)"}` }}>
                <IcoUpload />
                {file ? (<><p className="font-semibold text-sm" style={{ color: "#c4b5fd" }}>{file}</p><p className="text-gray-500 text-xs">Tap to change</p></>)
                  : (<><p className="text-white font-semibold text-sm">Tap to Upload Receipt</p><p className="text-gray-500 text-xs">JPG, PNG, or PDF · max 5 MB</p></>)}
              </button>
              <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f.name); }} />
            </div>
          </div>
          <p className="text-gray-600 text-xs text-center mt-5">🔒 Encrypted. Used only for AFMC booking verification.</p>
          <button disabled={!valid || !booking} onClick={() => { if (valid && booking) { const newBooking: Booking = { id: generateId(), court: booking.court, sport: "Pickleball", date: booking.date, time: booking.time, status: "Pending", createdAt: new Date(), price: booking.price, player: "Current User", avatar: "👤" }; onBookingComplete(newBooking); onNav("dashboard"); } }}
            className="w-full mt-5 py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-95 disabled:opacity-35"
            style={{ background: valid && booking ? `linear-gradient(135deg, ${PURPLE}, ${ORANGE})` : "#374151" }}>
            {!booking ? "No Booking Selected" : valid ? "Submit Payment ✓" : "Complete All Fields"}
          </button>
            </>
          )}
        </div>
      </Page>
    </>
  );
}
