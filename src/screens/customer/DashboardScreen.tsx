import { useState } from "react";
import type { Booking, BookingStatus } from "../../types/index";
import { PURPLE, ORANGE, PURPLE_DIM, PURPLE_BORDER, CARD, SURFACE, bookingColors, daysBetween } from "../../constants/theme";
import { TopBar, Page } from "../../components/Layout";

function BookingCard({ b, onCancel }: { b: Booking; onCancel: (id: string) => void }) {
  const { bg, text } = bookingColors[b.status];
  const canCancel = (b.status === "Confirmed" || b.status === "Pending") && daysBetween(b.createdAt, new Date()) <= 3;
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-2xl p-4" style={{ backgroundColor: CARD }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-3">
          <p className="text-white font-semibold text-sm truncate">{b.court}</p>
          <p className="text-gray-500 text-xs mt-0.5">{b.date} · {b.time}</p>
        </div>
        <span className="flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: bg, color: text }}>{b.status}</span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: PURPLE_DIM, color: "#c4b5fd" }}>🎾 {b.sport}</span>
        <span className="text-gray-600 text-xs">·</span>
        <span className="text-xs font-bold" style={{ color: ORANGE }}>{b.price}</span>
        <span className="text-gray-600 text-xs">·</span>
        <span className="text-gray-500 text-xs font-mono">{b.id}</span>
      </div>
      <div className="border-t pt-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <button onClick={() => setExpanded((v) => !v)}
          className="w-full py-2 rounded-xl text-xs font-semibold transition-colors hover:bg-white/5 mb-2"
          style={{ color: "#a78bfa", border: `1px solid ${PURPLE_BORDER}` }}>
          {expanded ? "Hide Details ↑" : "View Details ↓"}
        </button>
        {expanded && (
          <div className="rounded-xl p-3 mb-2" style={{ backgroundColor: SURFACE }}>
            {[
              { l: "Booking ID", v: b.id },
              { l: "Sport", v: b.sport },
              { l: "Court", v: b.court },
              { l: "Date", v: b.date },
              { l: "Time", v: b.time },
              { l: "Price", v: b.price },
              { l: "Status", v: b.status },
            ].map(({ l, v }) => (
              <div key={l} className="flex justify-between py-1.5 border-b text-xs" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <span className="text-gray-500">{l}</span>
                <span className="text-white font-medium">{v}</span>
              </div>
            ))}
          </div>
        )}
        {(b.status === "Confirmed" || b.status === "Pending") && (
          canCancel
            ? <button onClick={() => onCancel(b.id)} className="w-full py-2.5 rounded-xl text-red-400 border border-red-500/25 text-xs font-semibold hover:bg-red-500/10 transition-colors">Cancel Booking</button>
            : <p className="text-gray-600 text-xs text-center">Cancellation window closed (3-day limit)</p>
        )}
      </div>
    </div>
  );
}

export function DashboardScreen({ onBack, bookings, setBookings }: { onBack: () => void; bookings: Booking[]; setBookings: React.Dispatch<React.SetStateAction<Booking[]>> }) {
  const [filter, setFilter] = useState<BookingStatus | "All">("All");
  const cancel = (id: string) => setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: "Cancelled" as BookingStatus } : b));
  const filtered = filter === "All" ? bookings : bookings.filter((b) => b.status === filter);
  const statuses: (BookingStatus | "All")[] = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];
  return (
    <>
      <TopBar title="My Bookings" onBack={onBack} />
      <Page>
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-3 mt-5">
            {([{ s: "Confirmed" as BookingStatus, e: "✅" }, { s: "Pending" as BookingStatus, e: "⏳" }, { s: "Completed" as BookingStatus, e: "🏅" }]).map(({ s, e }) => (
              <div key={s} className="rounded-2xl p-4 text-center" style={{ backgroundColor: CARD }}>
                <p className="text-xl">{e}</p>
                <p style={{ fontFamily: "Barlow Condensed, sans-serif", color: ORANGE }} className="font-black text-2xl">{bookings.filter((b) => b.status === s).length}</p>
                <p className="text-gray-500 text-xs">{s}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-5 overflow-x-auto scrollbar-hide pb-1">
            {statuses.map((s) => (
              <button key={s} onClick={() => setFilter(s)} className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all"
                style={{ backgroundColor: filter === s ? PURPLE : SURFACE, color: filter === s ? "white" : "#9ca3af", border: `1.5px solid ${filter === s ? PURPLE : "rgba(255,255,255,0.08)"}` }}>
                {s}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
            {filtered.length === 0 && <div className="col-span-2 text-center py-16"><p className="text-4xl mb-3">🎾</p><p className="text-gray-400 text-sm">No bookings yet.</p></div>}
            {filtered.map((b) => <BookingCard key={b.id} b={b} onCancel={cancel} />)}
          </div>
        </div>
      </Page>
    </>
  );
}
