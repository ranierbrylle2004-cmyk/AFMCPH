import type { Screen, Booking, Post, Settings } from "../../types/index";
import { PURPLE, ORANGE, PURPLE_DIM, PURPLE_BORDER, ORANGE_DIM, CARD, DEFAULT_SETTINGS } from "../../constants/theme";
import { Drawer, TopBar, Page } from "../../components/Layout";

import afmcPromo from "@/imports/790425814_122100518511458370_6831669957420292525_n.jpg";
import afmcCourt1 from "@/imports/788780245_122100397719458370_3038049992003171720_n.jpg";
import afmcWide from "@/imports/789708970_122100406083458370_5937877576636999396_n.jpg";
import afmcNet from "@/imports/789680621_122100406119458370_4428193008530842799_n.jpg";

export function HomeScreen({ onNav, isAdmin, menuOpen, setMenuOpen, settings = DEFAULT_SETTINGS, bookings, posts }: { onNav: (s: Screen) => void; isAdmin: boolean; menuOpen: boolean; setMenuOpen: (v: boolean) => void; settings?: Settings; bookings: Booking[]; posts: Post[] }) {
  const availableCourts = settings.courts.filter((c) => c.available).length;
  return (
    <>
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} onNav={onNav} isAdmin={isAdmin} />
      <TopBar onMenu={() => setMenuOpen(true)} />
      <Page noPad>
        {/* Hero */}
        <div className="relative flex flex-col justify-end overflow-hidden" style={{ minHeight: "clamp(320px, 45vh, 520px)" }}>
          <img src={afmcWide} alt="AFMC Pickle Hub courts" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(13,13,20,0.35) 0%, rgba(13,13,20,0.97) 88%)` }} />
          <div className="relative px-4 sm:px-6 lg:px-8 pb-8 pt-6 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4 border"
              style={{ backgroundColor: PURPLE_DIM, color: "#c4b5fd", borderColor: PURPLE_BORDER }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" /> {availableCourts} of {settings.courts.length} Courts Available
            </span>
            <h1 style={{ fontFamily: "Barlow Condensed, sans-serif", lineHeight: 1.0, fontSize: "clamp(2.4rem,6vw,4.5rem)" }}
              className="text-white font-black uppercase tracking-tight mb-1">
              AFMC<br /><span style={{ color: ORANGE }}>Pickle Hub</span>
            </h1>
            <p className="font-bold tracking-widest text-sm mb-3 uppercase" style={{ color: "#a78bfa", fontFamily: "Barlow Condensed, sans-serif" }}>
              {settings.venueTagline}
            </p>
            <p className="text-white/55 text-sm mb-5 max-w-sm leading-relaxed">
              Ampayon Free Methodist Court — Butuan City's premier indoor pickleball facility. {settings.courts.length} courts, all-weather covered, all levels welcome.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => onNav("venue-detail")}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm transition-all active:scale-95"
                style={{ background: `linear-gradient(135deg, ${PURPLE}, ${ORANGE})` }}>
                View Courts <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button onClick={() => onNav("newsfeed")}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all active:scale-95"
                style={{ backgroundColor: ORANGE_DIM, color: ORANGE, border: `1px solid rgba(249,115,22,0.35)` }}>
                Community
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mt-6">
            {[{ n: String(settings.courts.length), l: "Courts" }, { n: `₱${settings.morningRate}+`, l: "Per Hour" }, { n: `${bookings.length}`, l: "Bookings" }, { n: String(posts.filter(p => p.status === "approved").length), l: "Posts" }].map((s) => (
              <div key={s.l} className="rounded-2xl p-3 text-center" style={{ backgroundColor: CARD }}>
                <p style={{ fontFamily: "Barlow Condensed, sans-serif", color: ORANGE }} className="font-black text-lg md:text-2xl">{s.n}</p>
                <p className="text-gray-500 text-[10px] md:text-xs">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Court status cards */}
          <div className="mt-7">
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontFamily: "Barlow Condensed, sans-serif" }} className="text-white font-black text-2xl md:text-3xl uppercase tracking-tight">Court Status</h2>
              <button onClick={() => onNav("calendar")} className="text-sm font-semibold" style={{ color: ORANGE }}>Book Now →</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {settings.courts.map((c) => (
                <button key={c.id} onClick={() => onNav("calendar")}
                  className="rounded-2xl p-4 text-left transition-all active:scale-95 hover:scale-[1.02]"
                  style={{ backgroundColor: CARD, border: `1.5px solid ${c.available ? "rgba(22,163,74,0.3)" : "rgba(239,68,68,0.25)"}` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">🎾</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: c.available ? "rgba(22,163,74,0.15)" : "rgba(239,68,68,0.15)", color: c.available ? "#34d399" : "#f87171" }}>
                      {c.available ? "Open" : "Booked"}
                    </span>
                  </div>
                  <p className="text-white font-bold text-sm">{c.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: c.color === "Purple" ? "#a78bfa" : ORANGE }}>{c.color} Court</p>
                </button>
              ))}
            </div>
          </div>

          {/* Photo gallery strip */}
          <div className="mt-8">
            <h2 style={{ fontFamily: "Barlow Condensed, sans-serif" }} className="text-white font-black text-2xl uppercase tracking-tight mb-4">The Facility</h2>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2 md:grid md:grid-cols-4 md:overflow-visible md:mx-0 md:px-0">
              {[
                { src: afmcCourt1, alt: "AFMC pickleball court with PDDLAB net" },
                { src: afmcWide, alt: "AFMC Pickle Hub wide view at night" },
                { src: afmcNet, alt: "PDDLAB net at AFMC" },
                { src: afmcPromo, alt: "AFMC Pickle Hub promotional poster" },
              ].map((img, i) => (
                <div key={i} className="flex-shrink-0 w-44 md:w-auto rounded-2xl overflow-hidden bg-gray-900 cursor-pointer hover:scale-[1.02] transition-transform"
                  style={{ border: `1px solid rgba(124,58,237,0.2)` }} onClick={() => onNav("venue-detail")}>
                  <img src={img.src} alt={img.alt} className="w-full h-32 md:h-40 object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 mb-4">
            <h2 style={{ fontFamily: "Barlow Condensed, sans-serif" }} className="text-white font-black text-2xl uppercase tracking-tight mb-4">Why AFMC?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { icon: "🏸", title: "Play. Compete. Connect.", sub: "All Ages. All Levels. Year-round indoor play." },
                { icon: "🏟️", title: "Premium Indoor Facility", sub: "PDDLAB nets, vibrant court surfaces, covered arena." },
                { icon: "👥", title: "Great Community.", sub: "Join the pickleball family. Greater game together." },
              ].map((f) => (
                <div key={f.title} className="rounded-2xl p-4" style={{ backgroundColor: CARD, border: `1px solid rgba(124,58,237,0.15)` }}>
                  <span className="text-3xl block mb-2">{f.icon}</span>
                  <p className="text-white font-bold text-sm mb-1">{f.title}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{f.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Page>
    </>
  );
}
