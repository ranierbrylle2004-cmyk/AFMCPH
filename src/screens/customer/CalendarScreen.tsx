import { useState } from "react";
import type { Screen, Settings, SlotStatus } from "../../types/index";
import { PURPLE, ORANGE, PURPLE_DIM, PURPLE_BORDER, CARD, SURFACE, BG, DEFAULT_SETTINGS, WEEK_DAYS, WEEK_DATES, slotColor, slotLabel, isMorningSlot } from "../../constants/theme";
import { TopBar, Page } from "../../components/Layout";

import afmcCourt1 from "@/imports/788780245_122100397719458370_3038049992003171720_n.jpg";

const TIME_SLOTS = [
  { time: "6:00 AM", status: "available" }, { time: "7:00 AM", status: "available" },
  { time: "8:00 AM", status: "available" }, { time: "9:00 AM", status: "available" },
  { time: "10:00 AM", status: "available" }, { time: "11:00 AM", status: "available" },
  { time: "12:00 PM", status: "available" }, { time: "1:00 PM", status: "available" },
  { time: "2:00 PM", status: "available" }, { time: "3:00 PM", status: "available" },
  { time: "4:00 PM", status: "available" }, { time: "5:00 PM", status: "available" },
  { time: "6:00 PM", status: "available" }, { time: "7:00 PM", status: "available" },
  { time: "8:00 PM", status: "available" },
];

export function CalendarScreen({ onNav, onBack, settings = DEFAULT_SETTINGS }: { onNav: (s: Screen) => void; onBack: () => void; settings?: Settings }) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedCourt, setSelectedCourt] = useState(() => settings.courts.find((c) => c.available)?.name ?? settings.courts[0]?.name ?? "Court 1");
  return (
    <>
      <TopBar title="Book a Slot" onBack={onBack} />
      <Page noPad>
        <div className="relative h-44 md:h-60 overflow-hidden">
          <img src={afmcCourt1} alt="AFMC pickleball court" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(13,13,20,0.2), rgba(13,13,20,0.88))" }} />
          <div className="absolute bottom-4 left-4 md:left-8">
            <p className="text-white font-black text-lg" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>AFMC Pickle Hub</p>
            <p className="text-gray-400 text-sm">Ampayon, Butuan City · 🎾 Pickleball</p>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
          <div>
            {/* Court selector */}
            <div className="mt-5">
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "rgba(167,139,250,0.7)" }}>Select Court</p>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {settings.courts.filter(c => c.available).map((c) => (
                  <button key={c.id} onClick={() => setSelectedCourt(c.name)}
                    className="flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{ backgroundColor: selectedCourt === c.name ? PURPLE : SURFACE, color: selectedCourt === c.name ? "white" : "#9ca3af", border: `1.5px solid ${selectedCourt === c.name ? PURPLE : "rgba(255,255,255,0.08)"}` }}>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Week picker */}
            <div className="mt-5">
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "rgba(167,139,250,0.7)" }}>August 2026</p>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {WEEK_DAYS.map((d, i) => (
                  <button key={d} onClick={() => { setSelectedDay(i); setSelectedSlot(null); }}
                    className="flex-shrink-0 flex flex-col items-center gap-1 w-12 md:w-14 py-2.5 rounded-2xl transition-all"
                    style={{ backgroundColor: selectedDay === i ? PURPLE : SURFACE, color: selectedDay === i ? "white" : "#9ca3af" }}>
                    <span className="text-[10px] font-semibold tracking-widest">{d}</span>
                    <span className="font-bold text-base">{WEEK_DATES[i]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-5">
              {(["available", "reserved", "booked", "closed"] as SlotStatus[]).map((s) => (
                <div key={s} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: slotColor[s] }} />
                  <span className="text-gray-500 text-xs">{slotLabel[s]}</span>
                </div>
              ))}
            </div>

            {/* Slots */}
            <p className="text-white font-semibold text-sm mt-5 mb-2">Select a Time Slot</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 pb-28 lg:pb-6">
              {TIME_SLOTS.map((slot) => {
                const isAvail = slot.status === "available";
                const isSelected = selectedSlot === slot.time;
                return (
                  <button key={slot.time} disabled={!isAvail} onClick={() => isAvail && setSelectedSlot(slot.time)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${isAvail ? "active:scale-[0.98] cursor-pointer" : "cursor-default"}`}
                    style={{ backgroundColor: isSelected ? PURPLE_DIM : CARD, border: `1.5px solid ${isSelected ? PURPLE : isAvail ? "rgba(22,163,74,0.3)" : "rgba(255,255,255,0.05)"}` }}>
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: slotColor[slot.status] }} />
                      <span className="text-white font-medium text-sm">{slot.time}</span>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: isSelected ? "#c4b5fd" : slotColor[slot.status] }}>
                      {isSelected ? "Selected ✓" : slotLabel[slot.status]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop summary */}
          <div className="hidden lg:block mt-5">
            <div className="sticky top-20 rounded-2xl p-5" style={{ backgroundColor: CARD, border: `1px solid ${PURPLE_BORDER}` }}>
              <p style={{ fontFamily: "Barlow Condensed, sans-serif" }} className="text-white font-black text-xl uppercase mb-4">Summary</p>
              {[{ l: "Venue", v: "AFMC Pickle Hub" }, { l: "Court", v: selectedCourt }, { l: "Date", v: `Aug ${WEEK_DATES[selectedDay]}, 2026` }, { l: "Time", v: selectedSlot ?? "—" }].map(({ l, v }) => (
                <div key={l} className="flex justify-between text-sm py-2.5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <span className="text-gray-400">{l}</span>
                  <span className="text-white font-medium">{v}</span>
                </div>
              ))}
              <div className="flex justify-between items-center mt-4">
                <span className="text-white font-semibold">Total</span>
                <span style={{ fontFamily: "Barlow Condensed, sans-serif", color: selectedSlot && isMorningSlot(selectedSlot) ? "#c4b5fd" : ORANGE }} className="font-black text-2xl">
                  {selectedSlot ? `₱${isMorningSlot(selectedSlot) ? settings.morningRate : settings.eveningRate}` : "—"}
                </span>
              </div>
              {selectedSlot && (
                <p className="text-xs mt-1 text-right" style={{ color: isMorningSlot(selectedSlot) ? "#9ca3af" : "#9ca3af" }}>
                  {isMorningSlot(selectedSlot) ? "Morning rate" : "Evening rate"}
                </p>
              )}
              <button disabled={!selectedSlot} onClick={() => selectedSlot && onNav("checkout")}
                className="w-full mt-4 py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-95 disabled:opacity-40"
                style={{ background: selectedSlot ? `linear-gradient(135deg, ${PURPLE}, ${ORANGE})` : "#374151" }}>
                {selectedSlot ? "Lock This Slot →" : "Pick a Time Slot"}
              </button>
            </div>
          </div>
        </div>
      </Page>

      {selectedSlot && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 px-5 py-4 z-40" style={{ backgroundColor: `${BG}f7`, backdropFilter: "blur(12px)", borderTop: `1px solid rgba(124,58,237,0.15)` }}>
          <div className="flex items-center justify-between mb-3">
            <div><p className="text-gray-400 text-xs">{selectedCourt} · Aug {WEEK_DATES[selectedDay]}</p><p className="text-white font-bold text-sm">{selectedSlot}</p></div>
            <p style={{ fontFamily: "Barlow Condensed, sans-serif", color: selectedSlot && isMorningSlot(selectedSlot) ? "#c4b5fd" : ORANGE }} className="font-black text-xl">
              ₱{selectedSlot && isMorningSlot(selectedSlot) ? settings.morningRate : settings.eveningRate}
            </p>
          </div>
          <button onClick={() => onNav("checkout")} className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-95"
            style={{ background: `linear-gradient(135deg, ${PURPLE}, ${ORANGE})` }}>Lock This Slot →</button>
        </div>
      )}
    </>
  );
}
