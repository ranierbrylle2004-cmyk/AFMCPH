import { useState } from "react";
import type { Booking, BookingStatus } from "../../types/index";
import { ORANGE, CARD, PURPLE, PURPLE_DIM, PURPLE_BORDER, SURFACE, bookingColors } from "../../constants/theme";
import { TopBar, Page } from "../../components/Layout";

export function AdminBookingsScreen({ onBack, bookings, setBookings }: { onBack: () => void; bookings: Booking[]; setBookings: React.Dispatch<React.SetStateAction<Booking[]>> }) {
  const [filter, setFilter] = useState<BookingStatus | "All">("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const updateStatus = (id: string, status: BookingStatus) =>
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));

  const filtered = filter === "All" ? bookings : bookings.filter((b) => b.status === filter);
  const statuses: (BookingStatus | "All")[] = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

  const pendingCount = bookings.filter((b) => b.status === "Pending").length;

  return (
    <>
      <TopBar title="Booking Requests" onBack={onBack} isAdmin />
      <Page>
        <div className="max-w-3xl mx-auto">
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2 mt-5">
            {([
              { s: "Pending" as BookingStatus, e: "⏳", c: ORANGE },
              { s: "Confirmed" as BookingStatus, e: "✅", c: "#34d399" },
              { s: "Completed" as BookingStatus, e: "🏅", c: "#a78bfa" },
              { s: "Cancelled" as BookingStatus, e: "✕", c: "#f87171" },
            ]).map(({ s, e, c }) => (
              <button key={s} onClick={() => setFilter(s)}
                className="rounded-2xl p-3 text-center transition-all active:scale-95"
                style={{ backgroundColor: filter === s ? "rgba(255,255,255,0.06)" : CARD, border: `1.5px solid ${filter === s ? "rgba(255,255,255,0.15)" : "transparent"}` }}>
                <p className="text-lg">{e}</p>
                <p style={{ fontFamily: "Barlow Condensed, sans-serif", color: c }} className="font-black text-xl">{bookings.filter((b) => b.status === s).length}</p>
                <p className="text-gray-500 text-[10px]">{s}</p>
              </button>
            ))}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide pb-1">
            {statuses.map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all"
                style={{ backgroundColor: filter === s ? PURPLE : SURFACE, color: filter === s ? "white" : "#9ca3af", border: `1.5px solid ${filter === s ? PURPLE : "rgba(255,255,255,0.08)"}` }}>
                {s}{s === "Pending" && pendingCount > 0 ? ` (${pendingCount})` : ""}
              </button>
            ))}
          </div>

          {/* Booking cards */}
          <div className="flex flex-col gap-3 mt-4 pb-8">
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">🎾</p>
                <p className="text-gray-400 text-sm">No {filter === "All" ? "" : filter.toLowerCase()} bookings.</p>
              </div>
            )}
            {filtered.map((b) => {
              const { bg, text } = bookingColors[b.status];
              const isExpanded = selectedId === b.id;
              const isPending = b.status === "Pending";
              return (
                <div key={b.id} className="rounded-2xl overflow-hidden transition-all"
                  style={{ backgroundColor: CARD, border: `1.5px solid ${isPending ? "rgba(249,115,22,0.3)" : "rgba(255,255,255,0.06)"}` }}>
                  {/* Card header */}
                  <button type="button" onClick={() => setSelectedId(isExpanded ? null : b.id)}
                    className="w-full flex items-start gap-3 px-4 pt-4 pb-3 text-left">
                    <span className="text-2xl mt-0.5 flex-shrink-0">{b.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-white font-semibold text-sm">{b.player}</p>
                        <span className="flex-shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: bg, color: text }}>{b.status}</span>
                      </div>
                      <p className="text-gray-400 text-xs">{b.court}</p>
                      <p className="text-gray-500 text-xs">{b.date} · {b.time}</p>
                    </div>
                    <svg className="flex-shrink-0 mt-1 transition-transform" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                      width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 6l4 4 4-4" stroke="#6b7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 mb-4">
                        {[
                          { l: "Booking ID", v: b.id },
                          { l: "Sport", v: `🎾 ${b.sport}` },
                          { l: "Court", v: b.court },
                          { l: "Date", v: b.date },
                          { l: "Time", v: b.time },
                          { l: "Amount", v: b.price },
                        ].map(({ l, v }) => (
                          <div key={l}>
                            <p className="text-gray-500 text-[10px] uppercase tracking-widest">{l}</p>
                            <p className="text-white text-xs font-semibold mt-0.5">{v}</p>
                          </div>
                        ))}
                      </div>

                      {/* GCash receipt placeholder */}
                      {isPending && (
                        <div className="mb-4 rounded-xl p-3 flex items-center gap-3"
                          style={{ backgroundColor: "rgba(0,112,224,0.1)", border: "1px solid rgba(0,112,224,0.25)" }}>
                          <span className="text-xl">💙</span>
                          <div className="flex-1">
                            <p className="text-blue-300 text-xs font-semibold">GCash Receipt Submitted</p>
                            <p className="text-blue-400/60 text-[10px]">Tap to review payment screenshot</p>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-blue-300" style={{ backgroundColor: "rgba(0,112,224,0.2)" }}>View</span>
                        </div>
                      )}

                      {/* Action buttons */}
                      {isPending && (
                        <div className="flex gap-2">
                          <button type="button"
                            onClick={() => { updateStatus(b.id, "Cancelled"); setSelectedId(null); }}
                            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
                            style={{ backgroundColor: "rgba(239,68,68,0.12)", color: "#f87171", border: "1.5px solid rgba(239,68,68,0.3)" }}>
                            ✕ Reject
                          </button>
                          <button type="button"
                            onClick={() => { updateStatus(b.id, "Confirmed"); setSelectedId(null); }}
                            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
                            style={{ backgroundColor: "rgba(22,163,74,0.15)", color: "#34d399", border: "1.5px solid rgba(22,163,74,0.35)" }}>
                            ✓ Accept
                          </button>
                        </div>
                      )}
                      {b.status === "Confirmed" && (
                        <div className="flex gap-2">
                          <button type="button"
                            onClick={() => { updateStatus(b.id, "Cancelled"); setSelectedId(null); }}
                            className="flex-1 py-3 rounded-xl text-xs font-semibold transition-all active:scale-95"
                            style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" }}>
                            Cancel Booking
                          </button>
                          <button type="button"
                            onClick={() => { updateStatus(b.id, "Completed"); setSelectedId(null); }}
                            className="flex-1 py-3 rounded-xl text-xs font-semibold transition-all active:scale-95"
                            style={{ backgroundColor: PURPLE_DIM, color: "#c4b5fd", border: `1px solid ${PURPLE_BORDER}` }}>
                            Mark Completed
                          </button>
                        </div>
                      )}
                      {(b.status === "Completed" || b.status === "Cancelled") && (
                        <p className="text-center text-gray-600 text-xs py-1">No further actions available.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Page>
    </>
  );
}
