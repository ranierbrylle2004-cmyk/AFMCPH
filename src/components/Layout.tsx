import { useState, useContext, createContext } from "react";
import type { Screen } from "../types/index";
import { BG, ORANGE, PURPLE, PURPLE_BORDER, PURPLE_DIM, SURFACE } from "../constants/theme";
import { IcoMenu, IcoClose, IcoBack, IcoBell } from "./Icons";

type NavItem = { s: Screen; label: string; icon: string };

const CUSTOMER_NAV: NavItem[] = [
  { s: "home", label: "Home", icon: "🏠" },
  { s: "pricing", label: "Rates", icon: "💰" },
  { s: "calendar", label: "Book a Slot", icon: "📅" },
  { s: "newsfeed", label: "Community Feed", icon: "📰" },
  { s: "chat", label: "Messages", icon: "💬" },
  { s: "dashboard", label: "My Bookings", icon: "🎫" },
];

const ADMIN_NAV: NavItem[] = [
  { s: "admin-bookings", label: "Bookings", icon: "📅" },
  { s: "admin-newsfeed", label: "Newsfeed Mgmt", icon: "📋" },
  { s: "admin-chat", label: "Chat Management", icon: "🎧" },
  { s: "admin-settings", label: "Settings", icon: "⚙️" },
];

const CUSTOMER_BOTTOM_NAV: Screen[] = ["home", "pricing", "newsfeed", "chat", "dashboard"];
const BOTTOM_NAV_LABELS: Partial<Record<Screen, string>> = {
  home: "Home", pricing: "Rates", newsfeed: "Feed", chat: "Chat", dashboard: "Bookings",
  "admin-bookings": "Bookings", "admin-newsfeed": "Newsfeed", "admin-chat": "Chat", "admin-settings": "Settings",
};

const BOOKING_FLOW: Screen[] = ["calendar", "checkout", "payment"];

const isNavActive = (screen: Screen, link: Screen) =>
  screen === link
  || (link === "home" && screen === "venue-detail")
  || (link === "pricing" && BOOKING_FLOW.includes(screen))
  || (link === "chat" && screen === "chat-thread")
  || (link === "admin-chat" && screen === "admin-chat-thread");

// ─── Top Bar Context ──────────────────────────────────────────────────────────
export const TopBarCtx = createContext<{ onNav: (s: Screen) => void; onLogout: () => void; isAdmin: boolean }>({
  onNav: () => {},
  onLogout: () => {},
  isAdmin: false,
});

// ─── Logo ─────────────────────────────────────────────────────────────────────
export function AFMCLogo({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-xl flex items-center justify-center flex-shrink-0 font-black text-white"
        style={{ width: size, height: size, background: `linear-gradient(135deg, ${PURPLE} 0%, ${ORANGE} 100%)`, fontSize: size * 0.38, fontFamily: "Barlow Condensed, sans-serif" }}>
        AF
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export function Sidebar({ screen, onNav, isAdmin }: { screen: Screen; onNav: (s: Screen) => void; isAdmin: boolean }) {
  const links = isAdmin ? ADMIN_NAV : CUSTOMER_NAV;
  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-60 border-r z-40 py-6 px-4"
      style={{ backgroundColor: BG, borderColor: "rgba(124,58,237,0.15)" }}>
      <div className="flex items-center gap-2.5 px-2 mb-2">
        <AFMCLogo size={36} />
        <div>
          <span style={{ fontFamily: "Barlow Condensed, sans-serif" }} className="text-white font-black text-xl tracking-widest uppercase">AFMC</span>
          <p className="text-xs leading-none" style={{ color: ORANGE }}>Pickle Hub</p>
        </div>
      </div>
      <p className="text-xs italic px-2 mb-7" style={{ color: "rgba(167,139,250,0.6)" }}>Serve. Rally. Believe.</p>

      {isAdmin && <div className="mb-3 px-2"><span className="text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full" style={{ backgroundColor: PURPLE_DIM, color: "#a78bfa" }}>ADMIN PANEL</span></div>}
      <nav className="flex flex-col gap-1 flex-1">
        {links.map((l) => {
          const active = isNavActive(screen, l.s);
          return (
            <button key={l.s} onClick={() => onNav(l.s)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-left font-medium transition-all"
              style={{ backgroundColor: active ? PURPLE_DIM : "transparent", color: active ? "#c4b5fd" : "#9ca3af", border: active ? `1px solid ${PURPLE_BORDER}` : "1px solid transparent" }}>
              <span className="text-lg">{l.icon}</span>
              <span className="text-sm">{l.label}</span>
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PURPLE }} />}
            </button>
          );
        })}
      </nav>
      <div className="pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-2 px-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ backgroundColor: SURFACE }}>
            {isAdmin ? "🛡️" : "👤"}
          </div>
          <div>
            <p className="text-white text-xs font-semibold">{isAdmin ? "Admin" : "Player"}</p>
            <p className="text-xs" style={{ color: "rgba(167,139,250,0.6)" }}>Ampayon, Butuan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── Mobile Drawer ────────────────────────────────────────────────────────────
export function Drawer({ open, onClose, onNav, isAdmin }: { open: boolean; onClose: () => void; onNav: (s: Screen) => void; isAdmin: boolean }) {
  if (!open) return null;
  const links = isAdmin ? ADMIN_NAV : CUSTOMER_NAV;
  return (
    <div className="fixed inset-0 z-[60] flex lg:hidden">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div style={{ backgroundColor: BG, borderRight: `1px solid ${PURPLE_BORDER}` }} className="relative w-72 h-full flex flex-col pt-16 pb-8 px-6 overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors"><IcoClose /></button>
        <div className="flex items-center gap-3 mb-1">
          <AFMCLogo size={40} />
          <div>
            <span style={{ fontFamily: "Barlow Condensed, sans-serif" }} className="text-white font-black text-2xl tracking-widest uppercase">AFMC</span>
            <p className="text-xs" style={{ color: ORANGE }}>Pickle Hub</p>
          </div>
        </div>
        <p className="text-xs italic mb-7 mt-1" style={{ color: "rgba(167,139,250,0.6)" }}>Serve. Rally. Believe.</p>
        {isAdmin && <p className="text-xs font-bold tracking-widest mb-2 px-1" style={{ color: "#a78bfa" }}>ADMIN PANEL</p>}
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <button key={l.s} onClick={() => { onNav(l.s); onClose(); }} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-left hover:bg-white/8 transition-colors font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
              <span className="text-lg">{l.icon}</span><span className="flex-1 text-sm">{l.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

// ─── Top Bar ──────────────────────────────────────────────────────────────────
export function TopBar({ title, onBack, onMenu, isAdmin }: { title?: string; onBack?: () => void; onMenu?: () => void; isAdmin?: boolean }) {
  const { onNav, onLogout, isAdmin: ctxIsAdmin } = useContext(TopBarCtx);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <>
      <header style={{ backgroundColor: `${BG}f7`, backdropFilter: "blur(16px)", borderBottom: `1px solid rgba(124,58,237,0.12)` }}
        className="fixed top-0 right-0 left-0 lg:left-60 z-30 flex items-center justify-between px-4 md:px-6 h-14">
        {/* Left */}
        <div className="flex items-center gap-3">
          {onBack
            ? <button type="button" onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors lg:hidden"><IcoBack /></button>
            : <button type="button" onClick={onMenu} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors lg:hidden"><IcoMenu /></button>}
          {!title && <div className="flex items-center gap-2 lg:hidden"><AFMCLogo size={26} /><span style={{ fontFamily: "Barlow Condensed, sans-serif" }} className="text-white font-black text-lg tracking-widest">AFMC</span></div>}
          {title && <span className="text-white font-semibold text-base">{title}</span>}
          {(isAdmin || ctxIsAdmin) && <span className="hidden sm:inline text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: PURPLE_DIM, color: "#a78bfa" }}>ADMIN</span>}
        </div>

        {/* Right */}
        <div className="flex items-center gap-1">
          {/* Notifications */}
          <button type="button" onClick={() => { setShowNotifs((v) => !v); setShowProfile(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/10 active:bg-white/20 transition-colors">
            <IcoBell />
          </button>

          {/* Profile avatar */}
          <button type="button" onClick={() => { setShowProfile((v) => !v); setShowNotifs(false); }}
            className="ml-1 w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 transition-all active:scale-90"
            style={{
              background: (isAdmin || ctxIsAdmin) ? `linear-gradient(135deg, #92400e, ${ORANGE})` : `linear-gradient(135deg, ${PURPLE}, ${ORANGE})`,
              boxShadow: showProfile ? `0 0 0 2px white` : `0 0 0 2px ${(isAdmin || ctxIsAdmin) ? "rgba(249,115,22,0.5)" : PURPLE_BORDER}`,
            }}>
            {(isAdmin || ctxIsAdmin) ? "🛡️" : "👤"}
          </button>
        </div>
      </header>

      {/* Notification dropdown — empty state */}
      {showNotifs && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
          <div className="fixed top-16 right-4 z-50 w-80 rounded-2xl overflow-hidden shadow-2xl"
            style={{ backgroundColor: SURFACE, border: `1px solid rgba(124,58,237,0.25)` }}>
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <p className="text-white font-semibold text-sm">Notifications</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: PURPLE_DIM, color: "#c4b5fd" }}>0 new</span>
            </div>
            <div className="px-4 py-8 text-center">
              <p className="text-2xl mb-2">🔔</p>
              <p className="text-gray-500 text-sm">No notifications yet</p>
            </div>
          </div>
        </>
      )}

      {/* Profile dropdown */}
      {showProfile && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
          <div className="fixed top-16 right-4 z-50 w-64 rounded-2xl overflow-hidden shadow-2xl"
            style={{ backgroundColor: SURFACE, border: `1px solid ${(isAdmin || ctxIsAdmin) ? "rgba(249,115,22,0.25)" : PURPLE_BORDER}` }}>
            {/* Avatar row */}
            <div className="px-4 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)", background: (isAdmin || ctxIsAdmin) ? `linear-gradient(135deg, rgba(146,64,14,0.2), rgba(249,115,22,0.1))` : `linear-gradient(135deg, ${PURPLE_DIM}, rgba(249,115,22,0.08))` }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: (isAdmin || ctxIsAdmin) ? `linear-gradient(135deg, #92400e, ${ORANGE})` : `linear-gradient(135deg, ${PURPLE}, ${ORANGE})` }}>
                  {(isAdmin || ctxIsAdmin) ? "🛡️" : "👤"}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{(isAdmin || ctxIsAdmin) ? "Admin" : "Player"}</p>
                  <p className="text-[10px]" style={{ color: (isAdmin || ctxIsAdmin) ? ORANGE : "#a78bfa" }}>{(isAdmin || ctxIsAdmin) ? "Administrator" : "AFMC Member"}</p>
                </div>
              </div>
            </div>
            {/* Menu items */}
            {(isAdmin || ctxIsAdmin
              ? [
                  { icon: "📅", label: "Booking Requests", screen: "admin-bookings" as Screen },
                  { icon: "📋", label: "Manage Newsfeed", screen: "admin-newsfeed" as Screen },
                  { icon: "⚙️", label: "Settings", screen: "admin-settings" as Screen },
                ]
              : [
                  { icon: "🎫", label: "My Bookings", screen: "dashboard" as Screen },
                  { icon: "📰", label: "Community Feed", screen: "newsfeed" as Screen },
                  { icon: "💬", label: "Messages", screen: "chat" as Screen },
                ]
            ).map((item) => (
              <button key={item.label} type="button" onClick={() => { setShowProfile(false); onNav?.(item.screen); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 active:bg-white/10 transition-colors border-b text-sm"
                style={{ borderColor: "rgba(255,255,255,0.05)", color: "#d1d5db" }}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
                <svg className="ml-auto" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="#4b5563" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            ))}
            <button type="button" onClick={() => { setShowProfile(false); onLogout?.(); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-500/10 active:bg-red-500/20 transition-colors text-sm"
              style={{ color: "#f87171" }}>
              <span>🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        </>
      )}
    </>
  );
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
export function BottomNav({ screen, onNav, isAdmin }: { screen: Screen; onNav: (s: Screen) => void; isAdmin: boolean }) {
  const nav = isAdmin ? ADMIN_NAV : CUSTOMER_NAV;
  const tabs = isAdmin ? nav : nav.filter((l) => CUSTOMER_BOTTOM_NAV.includes(l.s));
  return (
    <nav style={{ backgroundColor: `${BG}fa`, backdropFilter: "blur(14px)", borderTop: `1px solid rgba(124,58,237,0.15)` }}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center">
      {tabs.map((t) => {
        const active = isNavActive(screen, t.s);
        return (
          <button key={t.s} onClick={() => onNav(t.s)} className="flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors" style={{ color: active ? "#c4b5fd" : "#6b7280" }}>
            <span className="text-lg leading-none">{t.icon}</span>
            <span className="text-[9px] font-semibold tracking-wide">{BOTTOM_NAV_LABELS[t.s] ?? t.label}</span>
            {active && <span className="w-4 h-0.5 rounded-full mt-0.5" style={{ backgroundColor: PURPLE }} />}
          </button>
        );
      })}
    </nav>
  );
}

export function Page({ children, noPad }: { children: React.ReactNode; noPad?: boolean }) {
  return <div className={`pt-14 pb-20 lg:pb-6 min-h-screen ${noPad ? "" : "px-4 sm:px-6 lg:px-8"}`}>{children}</div>;
}