import { useState } from "react";
import type { Screen, Settings } from "../../types/index";
import { PURPLE, ORANGE, PURPLE_DIM, PURPLE_BORDER, CARD, SURFACE, BG, DEFAULT_SETTINGS } from "../../constants/theme";
import { TopBar, Page } from "../../components/Layout";

import afmcPromo from "@/imports/790425814_122100518511458370_6831669957420292525_n.jpg";
import afmcCourt1 from "@/imports/788780245_122100397719458370_3038049992003171720_n.jpg";
import afmcWide from "@/imports/789708970_122100406083458370_5937877576636999396_n.jpg";
import afmcNet from "@/imports/789680621_122100406119458370_4428193008530842799_n.jpg";

export function VenueDetailScreen({ onNav, onBack, settings = DEFAULT_SETTINGS }: { onNav: (s: Screen) => void; onBack: () => void; settings?: Settings }) {
  const photos = [
    { src: afmcWide, alt: "AFMC courts wide view at night" },
    { src: afmcCourt1, alt: "AFMC pickleball court with PDDLAB net" },
    { src: afmcNet, alt: "PDDLAB net close-up" },
    { src: afmcPromo, alt: "AFMC Pickle Hub promotional poster" },
  ];
  const [activePhoto, setActivePhoto] = useState(0);

  return (
    <>
      <TopBar title="AFMC Pickle Hub" onBack={onBack} />
      <Page noPad>
        {/* Photo gallery */}
        <div className="relative">
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img src={photos[activePhoto].src} alt={photos[activePhoto].alt} className="w-full h-full object-cover transition-all duration-500" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(13,13,20,0.9) 100%)" }} />
            {/* Prev / Next */}
            <button onClick={() => setActivePhoto((p) => (p - 1 + photos.length) % photos.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.55)" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={() => setActivePhoto((p) => (p + 1) % photos.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.55)" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {photos.map((_, i) => <span key={i} className="w-2 h-2 rounded-full transition-all" style={{ backgroundColor: i === activePhoto ? ORANGE : "rgba(255,255,255,0.4)" }} />)}
            </div>
          </div>
          {/* Thumbnail strip */}
          <div className="flex gap-2 px-4 mt-3 overflow-x-auto scrollbar-hide">
            {photos.map((p, i) => (
              <button key={i} onClick={() => setActivePhoto(i)} className="flex-shrink-0 w-16 h-12 rounded-xl overflow-hidden transition-all"
                style={{ border: `2px solid ${i === activePhoto ? ORANGE : "transparent"}`, opacity: i === activePhoto ? 1 : 0.55 }}>
                <img src={p.src} alt={p.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="mt-5 lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full mb-2"
                    style={{ backgroundColor: PURPLE_DIM, color: "#c4b5fd" }}>🎾 Pickleball · Indoor</span>
                  <h1 style={{ fontFamily: "Barlow Condensed, sans-serif" }} className="text-white font-black text-3xl md:text-4xl uppercase tracking-tight leading-none">
                    AFMC<br /><span style={{ color: ORANGE }}>Pickle Hub</span>
                  </h1>
                  <p className="text-gray-400 text-sm mt-1.5 flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1C4.34 1 3 2.34 3 4c0 2.5 3 6.5 3 6.5S9 6.5 9 4c0-1.66-1.34-3-3-3Z" fill="#6b7280"/></svg>
                    Ampayon, Butuan City, Agusan del Norte
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p style={{ fontFamily: "Barlow Condensed, sans-serif", color: "#c4b5fd" }} className="font-black text-2xl">₱{settings.morningRate}</p>
                  <p className="text-gray-500 text-[10px]">morning/hr</p>
                  <p style={{ fontFamily: "Barlow Condensed, sans-serif", color: ORANGE }} className="font-black text-2xl">₱{settings.eveningRate}</p>
                  <p className="text-gray-500 text-[10px]">evening/hr</p>
                </div>
              </div>

              {/* Rating + tags */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(234,179,8,0.15)" }}>
                  <span className="text-yellow-400 text-sm">★</span>
                  <span className="text-white font-bold text-sm">0</span>
                  <span className="text-gray-500 text-xs">(0 reviews)</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "rgba(22,163,74,0.15)", color: "#34d399" }}>● Open Now</span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: PURPLE_DIM, color: "#a78bfa" }}>{settings.courts.length} Courts</span>
              </div>

              {/* Tagline */}
              <div className="rounded-2xl p-4 mb-4" style={{ background: `linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(249,115,22,0.1) 100%)`, border: `1px solid rgba(124,58,237,0.25)` }}>
                <p style={{ fontFamily: "Barlow Condensed, sans-serif", color: ORANGE }} className="font-black text-xl uppercase tracking-wider mb-1">{settings.venueTagline}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{settings.venueDesc}</p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { icon: "🏟️", title: "Indoor Covered", sub: "Rain or shine" },
                  { icon: "🏸", title: "PDDLAB Nets", sub: "Tournament-grade" },
                  { icon: "👥", title: "All Levels", sub: "Beg. to Pro" },
                  { icon: "🚿", title: "Comfort Rooms", sub: "On-site" },
                  { icon: "🎾", title: "Paddle Rental", sub: "₱50/session" },
                  { icon: "📅", title: "Open Daily", sub: "7 AM – 9 PM" },
                ].map((f) => (
                  <div key={f.title} className="rounded-xl p-2.5 text-center" style={{ backgroundColor: SURFACE }}>
                    <span className="text-xl block mb-1">{f.icon}</span>
                    <p className="text-white text-[10px] font-semibold leading-tight">{f.title}</p>
                    <p className="text-gray-500 text-[9px]">{f.sub}</p>
                  </div>
                ))}
              </div>

              {/* Court breakdown */}
              <div className="mb-5">
                <h3 style={{ fontFamily: "Barlow Condensed, sans-serif" }} className="text-white font-bold text-lg uppercase tracking-tight mb-3">Available Courts</h3>
                <div className="flex flex-col gap-2">
                  {settings.courts.map((c) => (
                    <div key={c.id} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ backgroundColor: CARD }}>
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: c.color === "Purple" ? PURPLE : ORANGE }} />
                        <span className="text-white font-medium text-sm">{c.name} <span className="text-gray-500 text-xs">— {c.color} Surface</span></span>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: c.available ? "rgba(22,163,74,0.15)" : "rgba(239,68,68,0.15)", color: c.available ? "#34d399" : "#f87171" }}>
                        {c.available ? "Available" : "Booked"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* House rules */}
              <div className="rounded-2xl p-4 mb-6" style={{ backgroundColor: CARD, border: `1px solid rgba(249,115,22,0.2)` }}>
                <p className="font-bold text-sm mb-2.5 flex items-center gap-2" style={{ color: ORANGE }}>📋 Court Rules</p>
                {["Proper athletic footwear required — no slippers or sandals.", "Pack up 10 minutes before slot ends. Respect the next group.", `₱${settings.morningRate}/hr morning (${settings.openTime}–${settings.morningCutoff}) · ₱${settings.eveningRate}/hr evening. Min. 1 hour.`, `Paddle rentals at ₱${settings.paddleRental}/session. Available at the front desk.`, "Keep the facility clean. Dispose of waste properly."].map((r) => (
                  <p key={r} className="text-gray-400 text-xs flex gap-2 mb-1.5 leading-relaxed"><span style={{ color: ORANGE }}>›</span>{r}</p>
                ))}
              </div>
            </div>

            {/* Desktop sticky booking panel */}
            <div className="hidden lg:block mt-0">
              <div className="sticky top-20 rounded-2xl p-5" style={{ backgroundColor: CARD, border: `1px solid ${PURPLE_BORDER}` }}>
                <p style={{ fontFamily: "Barlow Condensed, sans-serif" }} className="text-white font-black text-xl uppercase mb-1">Book a Court</p>
                <p className="text-gray-500 text-xs mb-4">Pick your slot on the next screen</p>
                <div className="flex flex-col gap-2 mb-4">
                  {[{ l: "Venue", v: settings.venueName }, { l: "Location", v: settings.venueLocation }, { l: "Sport", v: "🎾 Pickleball" }, { l: "Morning", v: `₱${settings.morningRate}/hr` }, { l: "Evening", v: `₱${settings.eveningRate}/hr` }].map(({ l, v }) => (
                    <div key={l} className="flex justify-between text-sm border-b py-2" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      <span className="text-gray-400">{l}</span>
                      <span className="text-white font-medium">{v}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => onNav("calendar")} className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-95"
                  style={{ background: `linear-gradient(135deg, ${PURPLE}, ${ORANGE})` }}>
                  Check Availability →
                </button>
                <button onClick={() => onNav("pricing")} className="w-full py-3 mt-2 rounded-2xl text-sm font-semibold transition-all"
                  style={{ backgroundColor: PURPLE_DIM, color: "#c4b5fd" }}>
                  View Rates & Pricing →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 px-4 py-4 z-40" style={{ backgroundColor: `${BG}f7`, backdropFilter: "blur(14px)", borderTop: `1px solid rgba(124,58,237,0.15)` }}>
          <button onClick={() => onNav("calendar")} className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-95"
            style={{ background: `linear-gradient(135deg, ${PURPLE}, ${ORANGE})` }}>
            Book a Court — from ₱{settings.morningRate}/hr
          </button>
        </div>
      </Page>
    </>
  );
}
