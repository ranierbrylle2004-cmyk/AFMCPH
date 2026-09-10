import { useState, useEffect, useRef, createContext, useContext } from "react";

import afmcPromo from "@/imports/790425814_122100518511458370_6831669957420292525_n.jpg";
import afmcCourt1 from "@/imports/788780245_122100397719458370_3038049992003171720_n.jpg";
import afmcWide from "@/imports/789708970_122100406083458370_5937877576636999396_n.jpg";
import afmcNet from "@/imports/789680621_122100406119458370_4428193008530842799_n.jpg";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const PURPLE = "#7c3aed";
const PURPLE_DIM = "rgba(124,58,237,0.18)";
const PURPLE_BORDER = "rgba(124,58,237,0.35)";
const ORANGE = "#f97316";
const ORANGE_DIM = "rgba(249,115,22,0.15)";
const CARD = "#16161f";
const SURFACE = "#1e1e2a";
const BG = "#0d0d14";

// ─── Top Bar Context ──────────────────────────────────────────────────────────
const TopBarCtx = createContext<{ onNav: (s: Screen) => void; onLogout: () => void; isAdmin: boolean }>({
  onNav: () => {},
  onLogout: () => {},
  isAdmin: false,
});

// ─── Rates ────────────────────────────────────────────────────────────────────
const RATE_MORNING = 250;
const RATE_EVENING = 300;
const MORNING_HOURS = "6:00 AM – 12:00 PM";
const EVENING_HOURS = "12:00 PM – 9:00 PM";
const isMorningSlot = (time: string) => {
  const hour = parseInt(time.split(":")[0]);
  const isPM = time.includes("PM");
  const h24 = isPM && hour !== 12 ? hour + 12 : !isPM && hour === 12 ? 0 : hour;
  return h24 < 12;
};

// ─── Settings ─────────────────────────────────────────────────────────────────
interface Settings {
  morningRate: number;
  eveningRate: number;
  paddleRental: number;
  gcashNumber: string;
  gcashName: string;
  courts: Array<{ id: string; name: string; color: string; available: boolean }>;
  openTime: string;
  closeTime: string;
  morningCutoff: string;
  venueName: string;
  venueTagline: string;
  venueLocation: string;
  venueDesc: string;
}

const DEFAULT_SETTINGS: Settings = {
  morningRate: RATE_MORNING,
  eveningRate: RATE_EVENING,
  paddleRental: 50,
  gcashNumber: "09170000063",
  gcashName: "Ampayon Free Methodist Court",
  courts: [
    { id: "c1", name: "Court 1", color: "Purple", available: true },
    { id: "c2", name: "Court 2", color: "Purple", available: true },
    { id: "c3", name: "Court 3", color: "Orange", available: true },
  ],
  openTime: "6:00 AM",
  closeTime: "9:00 PM",
  morningCutoff: "12:00 PM",
  venueName: "AFMC Pickle Hub",
  venueTagline: "Serve. Rally. Believe.",
  venueLocation: "Ampayon, Butuan City, Agusan del Norte",
  venueDesc: "Ampayon Free Methodist Court hosts Butuan City's premier indoor pickleball facility. Featuring 3 professional courts with vibrant purple & orange surfaces, PDDLAB nets, and a fully covered arena — play year-round regardless of weather.",
};

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen =
  | "login" | "register"
  | "home" | "venue-detail" | "calendar" | "checkout" | "payment" | "dashboard"
  | "newsfeed" | "chat" | "chat-thread" | "pricing"
  | "admin-newsfeed" | "admin-chat" | "admin-chat-thread" | "admin-settings" | "admin-bookings";
type SlotStatus = "available" | "reserved" | "booked" | "closed";
type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";
type PostStatus = "approved" | "pending" | "rejected";
type PostType = "tournament" | "announcement" | "emergency" | "community";
interface Post { id: string; type: PostType; title: string; body: string; author: string; avatar: string; date: string; status: PostStatus; likes: number; comments: number; pinned?: boolean; }
interface Message { id: string; from: "me" | "them"; text: string; time: string; }
interface Conversation { id: string; name: string; avatar: string; lastMsg: string; time: string; unread: number; isSupport?: boolean; resolved?: boolean; messages: Message[]; }
interface Booking { id: string; court: string; sport: string; date: string; time: string; status: BookingStatus; createdAt: Date; price: string; player: string; avatar: string; }
interface TimeSlot { time: string; status: SlotStatus; }

// ─── Data ─────────────────────────────────────────────────────────────────────
const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEK_DATES = ["18", "19", "20", "21", "22", "23", "24"];

const AFMC_COURTS = [
  { id: "c1", name: "Court 1", color: "Purple", available: true },
  { id: "c2", name: "Court 2", color: "Purple", available: true },
  { id: "c3", name: "Court 3", color: "Orange", available: true },
];

const TIME_SLOTS: TimeSlot[] = [
  { time: "6:00 AM", status: "available" }, { time: "7:00 AM", status: "available" },
  { time: "8:00 AM", status: "available" }, { time: "9:00 AM", status: "available" },
  { time: "10:00 AM", status: "available" }, { time: "11:00 AM", status: "available" },
  { time: "12:00 PM", status: "available" }, { time: "1:00 PM", status: "available" },
  { time: "2:00 PM", status: "available" }, { time: "3:00 PM", status: "available" },
  { time: "4:00 PM", status: "available" }, { time: "5:00 PM", status: "available" },
  { time: "6:00 PM", status: "available" }, { time: "7:00 PM", status: "available" },
  { time: "8:00 PM", status: "available" },
];

const SAMPLE_BOOKINGS: Booking[] = [];

const INITIAL_POSTS: Post[] = [];
const PENDING_POSTS: Post[] = [];
const INITIAL_CONVOS: Conversation[] = [];
const ADMIN_CONVOS: Conversation[] = [];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const slotColor: Record<SlotStatus, string> = { available: "#16a34a", reserved: ORANGE, booked: "#dc2626", closed: "#374151" };
const slotLabel: Record<SlotStatus, string> = { available: "Available", reserved: "Reserved", booked: "Fully Booked", closed: "Closed" };
const bookingColors: Record<BookingStatus, { bg: string; text: string }> = {
  Pending: { bg: ORANGE_DIM, text: ORANGE },
  Confirmed: { bg: "rgba(22,163,74,0.15)", text: "#16a34a" },
  Completed: { bg: PURPLE_DIM, text: "#a78bfa" },
  Cancelled: { bg: "rgba(239,68,68,0.15)", text: "#f87171" },
};
const postTypeStyle: Record<PostType, { bg: string; text: string; label: string }> = {
  emergency: { bg: "rgba(239,68,68,0.15)", text: "#f87171", label: "🚨 Emergency" },
  tournament: { bg: ORANGE_DIM, text: ORANGE, label: "🏆 Tournament" },
  announcement: { bg: PURPLE_DIM, text: "#a78bfa", label: "📢 Announcement" },
  community: { bg: "rgba(22,163,74,0.12)", text: "#34d399", label: "👥 Community" },
};
const daysBetween = (a: Date, b: Date) => Math.floor((b.getTime() - a.getTime()) / 86400000);

// ─── Icons ────────────────────────────────────────────────────────────────────
const IcoMenu = () => <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect y="4" width="22" height="2" rx="1" fill="white"/><rect y="10" width="16" height="2" rx="1" fill="white"/><rect y="16" width="22" height="2" rx="1" fill="white"/></svg>;
const IcoUser = () => <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="8" r="4" stroke="white" strokeWidth="1.8"/><path d="M3 20c0-4 3.582-7 8-7s8 3 8 7" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>;
const IcoClose = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4l12 12M16 4L4 16" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>;
const IcoBack = () => <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M14 5l-7 6 7 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IcoSend = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M18 2L2 9l7 2 2 7 7-16Z" fill="white"/></svg>;
const IcoClock = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke={ORANGE} strokeWidth="1.5"/><path d="M8 5v3.5l2.5 1.5" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round"/></svg>;
const IcoUpload = () => <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 20V10M14 10l-4 4M14 10l4 4" stroke={PURPLE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 20c0 2 1 3 3 3h12c2 0 3-1 3-3" stroke={PURPLE} strokeWidth="1.8" strokeLinecap="round"/></svg>;
const IcoHeart = ({ filled }: { filled?: boolean }) => <svg width="16" height="16" viewBox="0 0 16 16" fill={filled ? "#f87171" : "none"}><path d="M8 13.5S2 9.5 2 5.5A3.5 3.5 0 0 1 8 3.6 3.5 3.5 0 0 1 14 5.5c0 4-6 8-6 8Z" stroke={filled ? "#f87171" : "#6b7280"} strokeWidth="1.4"/></svg>;
const IcoComment = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3h12v8H9l-3 2v-2H2V3Z" stroke="#6b7280" strokeWidth="1.4"/></svg>;
const IcoPin = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v6m0 6v-2M4 5l3-4 3 4v2H4V5Z" stroke={ORANGE} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IcoShield = () => <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 1l5 2v4c0 3-2 6-5 7C6 13 3 10 3 7V3l5-2Z" stroke="white" strokeWidth="1.8"/></svg>;
const IcoBall = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8.5" stroke={ORANGE} strokeWidth="1.5"/><path d="M10 1.5c0 4.7-3 8.5-8.5 8.5M10 18.5c0-4.7 3-8.5 8.5-8.5M1.5 10h17" stroke={ORANGE} strokeWidth="1.5"/></svg>;

// ─── Logo ─────────────────────────────────────────────────────────────────────
function AFMCLogo({ size = 32 }: { size?: number }) {
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
function Sidebar({ screen, onNav, isAdmin }: { screen: Screen; onNav: (s: Screen) => void; isAdmin: boolean }) {
  const custNav = [
    { s: "home" as Screen, label: "Home", icon: "🏠" },
    { s: "pricing" as Screen, label: "Rates", icon: "💰" },
    { s: "calendar" as Screen, label: "Book a Slot", icon: "📅" },
    { s: "newsfeed" as Screen, label: "Community Feed", icon: "📰" },
    { s: "chat" as Screen, label: "Messages", icon: "💬" },
    { s: "dashboard" as Screen, label: "My Bookings", icon: "🎫" },
  ];
  const adminNav = [
    { s: "admin-bookings" as Screen, label: "Bookings", icon: "📅" },
    { s: "admin-newsfeed" as Screen, label: "Newsfeed Mgmt", icon: "📋" },
    { s: "admin-chat" as Screen, label: "Chat Management", icon: "🎧" },
    { s: "admin-settings" as Screen, label: "Settings", icon: "⚙️" },
  ];
  const links = isAdmin ? adminNav : custNav;
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
          const active = screen === l.s || (l.s === "chat" && screen === "chat-thread") || (l.s === "admin-chat" && screen === "admin-chat-thread");
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
function Drawer({ open, onClose, onNav, isAdmin }: { open: boolean; onClose: () => void; onNav: (s: Screen) => void; isAdmin: boolean }) {
  if (!open) return null;
  const links = isAdmin
    ? [{ s: "admin-bookings" as Screen, label: "Bookings", icon: "📅" }, { s: "admin-newsfeed" as Screen, label: "Newsfeed Management", icon: "📋" }, { s: "admin-chat" as Screen, label: "Chat Management", icon: "🎧" }, { s: "admin-settings" as Screen, label: "Settings", icon: "⚙️" }]
    : [{ s: "home" as Screen, label: "Home", icon: "🏠" }, { s: "pricing" as Screen, label: "Rates", icon: "💰" }, { s: "calendar" as Screen, label: "Book a Slot", icon: "📅" }, { s: "newsfeed" as Screen, label: "Community Feed", icon: "📰" }, { s: "chat" as Screen, label: "Messages", icon: "💬" }, { s: "dashboard" as Screen, label: "My Bookings", icon: "🎫" }];
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
const IcoBell = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 2a6 6 0 0 0-6 6c0 3-1.5 4.5-2 5h16c-.5-.5-2-2-2-5a6 6 0 0 0-6-6Z" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M8.5 17a1.5 1.5 0 0 0 3 0" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);
function TopBar({ title, onBack, onMenu }: { title?: string; onBack?: () => void; onMenu?: () => void; badge?: number; isAdmin?: boolean }) {
  const { onNav, onLogout, isAdmin } = useContext(TopBarCtx);
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
          {isAdmin && <span className="hidden sm:inline text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: PURPLE_DIM, color: "#a78bfa" }}>ADMIN</span>}
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
              background: isAdmin ? `linear-gradient(135deg, #92400e, ${ORANGE})` : `linear-gradient(135deg, ${PURPLE}, ${ORANGE})`,
              boxShadow: showProfile ? `0 0 0 2px white` : `0 0 0 2px ${isAdmin ? "rgba(249,115,22,0.5)" : PURPLE_BORDER}`,
            }}>
            {isAdmin ? "🛡️" : "👤"}
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
            style={{ backgroundColor: SURFACE, border: `1px solid ${isAdmin ? "rgba(249,115,22,0.25)" : PURPLE_BORDER}` }}>
            {/* Avatar row */}
            <div className="px-4 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)", background: isAdmin ? `linear-gradient(135deg, rgba(146,64,14,0.2), rgba(249,115,22,0.1))` : `linear-gradient(135deg, ${PURPLE_DIM}, rgba(249,115,22,0.08))` }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: isAdmin ? `linear-gradient(135deg, #92400e, ${ORANGE})` : `linear-gradient(135deg, ${PURPLE}, ${ORANGE})` }}>
                  {isAdmin ? "🛡️" : "👤"}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{isAdmin ? "Admin" : "Player"}</p>
                  <p className="text-[10px]" style={{ color: isAdmin ? ORANGE : "#a78bfa" }}>{isAdmin ? "Administrator" : "AFMC Member"}</p>
                </div>
              </div>
            </div>
            {/* Menu items */}
            {(isAdmin
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
function BottomNav({ screen, onNav, isAdmin }: { screen: Screen; onNav: (s: Screen) => void; isAdmin: boolean }) {
  const custTabs = [
    { s: "home" as Screen, label: "Home", ico: "🏠" },
    { s: "pricing" as Screen, label: "Rates", ico: "💰" },
    { s: "newsfeed" as Screen, label: "Feed", ico: "📰" },
    { s: "chat" as Screen, label: "Chat", ico: "💬" },
    { s: "dashboard" as Screen, label: "Bookings", ico: "🎫" },
  ];
  const adminTabs = [
    { s: "admin-bookings" as Screen, label: "Bookings", ico: "📅" },
    { s: "admin-newsfeed" as Screen, label: "Newsfeed", ico: "📋" },
    { s: "admin-chat" as Screen, label: "Chat", ico: "🎧" },
    { s: "admin-settings" as Screen, label: "Settings", ico: "⚙️" },
  ];
  const tabs = isAdmin ? adminTabs : custTabs;
  return (
    <nav style={{ backgroundColor: `${BG}fa`, backdropFilter: "blur(14px)", borderTop: `1px solid rgba(124,58,237,0.15)` }}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center">
      {tabs.map((t) => {
        const active = screen === t.s || (t.s === "venue-detail" && screen === "calendar");
        return (
          <button key={t.s} onClick={() => onNav(t.s)} className="flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors" style={{ color: active ? "#c4b5fd" : "#6b7280" }}>
            <span className="text-lg leading-none">{t.ico}</span>
            <span className="text-[9px] font-semibold tracking-wide">{t.label}</span>
            {active && <span className="w-4 h-0.5 rounded-full mt-0.5" style={{ backgroundColor: PURPLE }} />}
          </button>
        );
      })}
    </nav>
  );
}

function Page({ children, noPad }: { children: React.ReactNode; noPad?: boolean }) {
  return <div className={`pt-14 pb-20 lg:pb-6 min-h-screen ${noPad ? "" : "px-4 sm:px-6 lg:px-8"}`}>{children}</div>;
}

// ─── Screen: Home ─────────────────────────────────────────────────────────────
function HomeScreen({ onNav, isAdmin, menuOpen, setMenuOpen, settings = DEFAULT_SETTINGS, bookings, posts, members }: { onNav: (s: Screen) => void; isAdmin: boolean; menuOpen: boolean; setMenuOpen: (v: boolean) => void; settings?: Settings; bookings: Booking[]; posts: Post[]; members: number }) {
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

// ─── Screen: Venue Detail ─────────────────────────────────────────────────────
function VenueDetailScreen({ onNav, onBack, settings = DEFAULT_SETTINGS }: { onNav: (s: Screen) => void; onBack: () => void; settings?: Settings }) {
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

// ─── Screen: Calendar ─────────────────────────────────────────────────────────
function CalendarScreen({ onNav, onBack, settings = DEFAULT_SETTINGS }: { onNav: (s: Screen) => void; onBack: () => void; settings?: Settings }) {
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

// ─── Screen: Checkout ─────────────────────────────────────────────────────────
function CheckoutScreen({ onNav, onBack, settings = DEFAULT_SETTINGS }: { onNav: (s: Screen) => void; onBack: () => void; settings?: Settings }) {
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
            {[{ l: "Venue", v: "AFMC Pickle Hub" }, { l: "Court", v: "Court 1 — Purple" }, { l: "Date", v: "Tuesday, August 19, 2026" }, { l: "Time", v: "10:00 AM – 11:00 AM" }].map(({ l, v }) => (
              <div key={l} className="flex justify-between items-start py-2.5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <span className="text-gray-400 text-sm">{l}</span>
                <span className="text-white text-sm font-medium text-right">{v}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4">
              <span className="text-white font-semibold">Total</span>
              <div className="text-right">
                <span style={{ fontFamily: "Barlow Condensed, sans-serif", color: "#c4b5fd" }} className="font-black text-2xl">₱{settings.morningRate}</span>
                <p className="text-gray-500 text-xs">Morning rate</p>
              </div>
            </div>
          </div>
          <div className="mt-4 px-4 py-3 rounded-xl flex gap-2.5 items-start" style={{ backgroundColor: PURPLE_DIM, border: `1px solid ${PURPLE_BORDER}` }}>
            <span className="mt-0.5" style={{ color: "#a78bfa" }}>ℹ️</span>
            <p className="text-gray-400 text-xs leading-relaxed">Free cancellation within <span className="text-white font-semibold">3 days</span> of booking. GCash payment required to confirm your slot.</p>
          </div>
          <button disabled={expired} onClick={() => !expired && onNav("payment")}
            className="w-full mt-5 py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-95 disabled:opacity-40"
            style={{ background: expired ? "#374151" : `linear-gradient(135deg, ${PURPLE}, ${ORANGE})` }}>
            {expired ? "Session Expired" : "Proceed to GCash Payment →"}
          </button>
          <button onClick={onBack} className="w-full py-3 text-gray-500 text-sm font-medium">Choose a different slot</button>
        </div>
      </Page>
    </>
  );
}

// ─── Screen: Payment ─────────────────────────────────────────────────────────
function PaymentScreen({ onNav, onBack, settings = DEFAULT_SETTINGS }: { onNav: (s: Screen) => void; onBack: () => void; settings?: Settings }) {
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
          <div className="mt-5 flex items-center gap-3 p-4 rounded-2xl" style={{ background: "linear-gradient(135deg, #0070e0 0%, #00457c 100%)" }}>
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">💙</div>
            <div><p className="text-white font-bold text-base">GCash Payment</p><p className="text-blue-200 text-xs">Secure & Instant Verification</p></div>
            <div className="ml-auto text-right"><p className="text-white/60 text-xs">Amount</p><p style={{ fontFamily: "Barlow Condensed, sans-serif", color: "#c4b5fd" }} className="font-black text-2xl">₱{settings.morningRate}</p></div>
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
          <button disabled={!valid} onClick={() => valid && onNav("dashboard")}
            className="w-full mt-5 py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-95 disabled:opacity-35"
            style={{ background: valid ? `linear-gradient(135deg, ${PURPLE}, ${ORANGE})` : "#374151" }}>
            {valid ? "Submit Payment ✓" : "Complete All Fields"}
          </button>
        </div>
      </Page>
    </>
  );
}

// ─── Screen: Dashboard ────────────────────────────────────────────────────────
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

function DashboardScreen({ onBack, bookings, setBookings }: { onBack: () => void; bookings: Booking[]; setBookings: React.Dispatch<React.SetStateAction<Booking[]>> }) {
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

// ─── Post Card ────────────────────────────────────────────────────────────────
function PostCard({ post, liked, onLike }: { post: Post; liked: boolean; onLike: () => void }) {
  const { bg, text, label } = postTypeStyle[post.type];
  const isPending = post.status === "pending";
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState<{ author: string; text: string; time: string }[]>([]);

  const addComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;
    setLocalComments((prev) => [...prev, { author: "You", text: trimmed, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setCommentText("");
  };

  return (
    <div className="rounded-2xl p-4" style={{ backgroundColor: CARD, border: isPending ? `1px solid ${ORANGE_DIM}` : "1px solid rgba(255,255,255,0.05)", opacity: isPending ? 0.8 : 1 }}>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xl">{post.avatar}</span>
          <div><p className="text-white text-xs font-semibold">{post.author}</p><p className="text-gray-500 text-[10px]">{post.date}</p></div>
        </div>
        <div className="flex items-center gap-2">
          {isPending && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: ORANGE_DIM, color: ORANGE }}>Pending</span>}
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor: bg, color: text }}>{label}</span>
        </div>
      </div>
      <h3 className="text-white font-semibold text-sm leading-snug mb-1.5">{post.title}</h3>
      <p className="text-gray-400 text-xs leading-relaxed">{post.body}</p>
      {!isPending && (
        <>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <button type="button" onClick={onLike} className="flex items-center gap-1.5 transition-transform active:scale-110"><IcoHeart filled={liked} /><span className="text-gray-500 text-xs">{post.likes}</span></button>
            <button type="button" onClick={() => setShowComments((v) => !v)} className="flex items-center gap-1.5 hover:opacity-80 active:scale-95 transition-all"><IcoComment /><span className="text-gray-500 text-xs">{post.comments + localComments.length}</span></button>
            <button type="button" onClick={() => navigator.clipboard?.writeText(`AFMC: ${post.title}`).catch(() => {})}
              className="ml-auto text-xs font-semibold hover:opacity-80 active:scale-95 transition-all" style={{ color: PURPLE }}>Share</button>
          </div>
          {showComments && (
            <div className="mt-3 rounded-xl p-3" style={{ backgroundColor: SURFACE, border: `1px solid ${PURPLE_BORDER}` }}>
              {localComments.length > 0 && (
                <div className="flex flex-col gap-2 mb-3">
                  {localComments.map((c, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <span className="text-sm mt-0.5">👤</span>
                      <div className="rounded-xl px-3 py-2 flex-1" style={{ backgroundColor: CARD }}>
                        <p className="text-white text-xs font-semibold">{c.author} <span className="text-gray-600 font-normal">{c.time}</span></p>
                        <p className="text-gray-300 text-xs mt-0.5">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {localComments.length === 0 && (
                <p className="text-gray-600 text-xs mb-3">No comments yet. Be the first!</p>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addComment()}
                  placeholder="Write a comment…"
                  className="flex-1 px-3 py-2 rounded-xl text-white text-xs placeholder-gray-600 focus:outline-none"
                  style={{ backgroundColor: CARD, border: `1px solid ${PURPLE_BORDER}` }}
                />
                <button type="button" onClick={addComment}
                  className="px-3 py-2 rounded-xl text-white text-xs font-semibold flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${PURPLE}, ${ORANGE})` }}>
                  Send
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Screen: Newsfeed ─────────────────────────────────────────────────────────
function NewsfeedScreen({ onBack, posts, setPosts, pendingPosts, setPendingPosts, members = 0, availableCourts = 0 }: { onBack: () => void; posts: Post[]; setPosts: React.Dispatch<React.SetStateAction<Post[]>>; pendingPosts: Post[]; setPendingPosts: React.Dispatch<React.SetStateAction<Post[]>>; members?: number; availableCourts?: number }) {
  const [filter, setFilter] = useState<PostType | "all">("all");
  const [showSubmit, setShowSubmit] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      const liked = next.has(id);
      liked ? next.delete(id) : next.add(id);
      setPosts((ps) => ps.map((p) => p.id === id ? { ...p, likes: p.likes + (liked ? -1 : 1) } : p));
      return next;
    });
  };
  const submitPost = () => {
    if (!newTitle.trim() || !newBody.trim()) return;
    setPendingPosts((prev) => [{ id: `p${Date.now()}`, type: "community", title: newTitle, body: newBody, author: "You", avatar: "👤", date: "Just now", status: "pending", likes: 0, comments: 0 }, ...prev]);
    setNewTitle(""); setNewBody(""); setShowSubmit(false);
  };
  const types: (PostType | "all")[] = ["all", "tournament", "announcement", "emergency", "community"];
  const approvedPosts = posts.filter((p) => p.status === "approved");
  const filtered = filter === "all" ? approvedPosts : approvedPosts.filter((p) => p.type === filter);
  const pinned = filtered.filter((p) => p.pinned);
  const feed = filtered.filter((p) => !p.pinned);
  return (
    <>
      <TopBar title="Community Feed" onBack={onBack} />
      <Page>
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2 mt-5 overflow-x-auto scrollbar-hide pb-1">
            {types.map((t) => (
              <button key={t} onClick={() => setFilter(t)} className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all"
                style={{ backgroundColor: filter === t ? PURPLE : SURFACE, color: filter === t ? "white" : "#9ca3af", border: `1.5px solid ${filter === t ? PURPLE : "rgba(255,255,255,0.08)"}` }}>
                {t === "all" ? "All Posts" : postTypeStyle[t as PostType].label}
              </button>
            ))}
          </div>
          <div className="mt-4 lg:grid lg:grid-cols-[1fr_260px] lg:gap-6">
            <div>
              {!showSubmit ? (
                <button onClick={() => setShowSubmit(true)} className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold mb-4 transition-all"
                  style={{ backgroundColor: SURFACE, border: `1.5px dashed rgba(124,58,237,0.3)`, color: "#9ca3af" }}>
                  ✏️ Share with the AFMC community…
                </button>
              ) : (
                <div className="mb-4 rounded-2xl p-4" style={{ backgroundColor: CARD, border: `1px solid ${PURPLE_BORDER}` }}>
                  <p className="text-white font-semibold text-sm mb-3">Create a Post</p>
                  <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Post title…" className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none mb-2" style={{ backgroundColor: BG, border: `1px solid rgba(255,255,255,0.1)` }} />
                  <textarea value={newBody} onChange={(e) => setNewBody(e.target.value)} placeholder="What's on your mind?" rows={3} className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none resize-none" style={{ backgroundColor: BG, border: `1px solid rgba(255,255,255,0.1)` }} />
                  <p className="text-gray-600 text-xs mt-2 mb-3">Posts are reviewed by AFMC admins before publishing.</p>
                  <div className="flex gap-2">
                    <button onClick={() => setShowSubmit(false)} className="flex-1 py-2.5 rounded-xl text-gray-400 text-sm border border-white/10">Cancel</button>
                    <button onClick={submitPost} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: `linear-gradient(135deg, ${PURPLE}, ${ORANGE})` }}>Submit for Review</button>
                  </div>
                </div>
              )}
              {pendingPosts.some((p) => p.author === "You") && (
                <div className="mb-4 px-4 py-3 rounded-xl flex gap-2 items-center" style={{ backgroundColor: ORANGE_DIM, border: `1px solid rgba(249,115,22,0.25)` }}>
                  <span style={{ color: ORANGE }}>⏳</span><p className="text-xs" style={{ color: ORANGE }}>Your post is pending AFMC admin review.</p>
                </div>
              )}
              {pinned.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-1.5 mb-2"><IcoPin /><span className="text-xs font-bold tracking-widest uppercase" style={{ color: ORANGE }}>Pinned</span></div>
                  <div className="flex flex-col gap-3">{pinned.map((p) => <PostCard key={p.id} post={p} liked={likedIds.has(p.id)} onLike={() => toggleLike(p.id)} />)}</div>
                </div>
              )}
              <div className="flex flex-col gap-3">{feed.map((p) => <PostCard key={p.id} post={p} liked={likedIds.has(p.id)} onLike={() => toggleLike(p.id)} />)}</div>

            </div>
            {/* Desktop sidebar */}
            <div className="hidden lg:flex flex-col gap-4">
              <div className="rounded-2xl p-4" style={{ backgroundColor: CARD, border: `1px solid rgba(124,58,237,0.15)` }}>
                <p style={{ fontFamily: "Barlow Condensed, sans-serif" }} className="text-white font-black text-lg uppercase mb-3">AFMC Stats</p>
                {[{ n: String(members), l: "Community members" }, { n: String(availableCourts), l: "Active courts" }, { n: String(posts.filter(p => p.status === "approved").length), l: "Live posts" }].map(({ n, l }) => (
                  <div key={l} className="flex justify-between items-center py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <span className="text-gray-400 text-sm">{l}</span>
                    <span className="font-bold text-sm" style={{ color: ORANGE }}>{n}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Page>
    </>
  );
}

// ─── Chat Thread ──────────────────────────────────────────────────────────────
function ChatThreadScreen({ convoId, convos, setConvos, onBack, isAdmin }: { convoId: string; convos: Conversation[]; setConvos: (c: Conversation[]) => void; onBack: () => void; isAdmin: boolean }) {
  const convo = convos.find((c) => c.id === convoId);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [convo?.messages.length]);
  if (!convo) return null;
  const send = () => {
    if (!input.trim()) return;
    const msg: Message = { id: `m${Date.now()}`, from: "me", text: input.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setConvos(convos.map((c) => c.id === convoId ? { ...c, messages: [...c.messages, msg], lastMsg: input.trim(), unread: 0 } : c));
    setInput("");
  };
  return (
    <>
      <header style={{ backgroundColor: `${BG}f7`, backdropFilter: "blur(16px)", borderBottom: `1px solid rgba(124,58,237,0.12)` }}
        className="fixed top-0 right-0 left-0 lg:left-60 z-30 flex items-center gap-3 px-4 md:px-6 h-14">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors"><IcoBack /></button>
        <span className="text-2xl">{convo.avatar}</span>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm">{convo.name}</p>
          <p className="text-[10px]" style={{ color: "#34d399" }}>● Online</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setConvos(convos.map((c) => c.id === convoId ? { ...c, resolved: !c.resolved } : c))}
            className="text-[10px] px-2.5 py-1 rounded-full font-bold transition-all"
            style={{ backgroundColor: convo.resolved ? "rgba(22,163,74,0.15)" : PURPLE_DIM, color: convo.resolved ? "#34d399" : "#a78bfa" }}>
            {convo.resolved ? "✓ Resolved" : "Mark Resolved"}
          </button>
        )}
      </header>
      <div className="pt-14 pb-24 px-4 sm:px-6 flex flex-col min-h-screen">
        <div className="max-w-2xl mx-auto w-full mt-4 flex flex-col gap-3">
          {convo.messages.map((m) => {
            const isMe = m.from === "me";
            return (
              <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[75%] md:max-w-[60%]">
                  <div className="px-4 py-2.5 text-sm leading-relaxed text-white"
                    style={{ background: isMe ? `linear-gradient(135deg, ${PURPLE}, ${ORANGE}88)` : CARD, borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px" }}>
                    {m.text}
                  </div>
                  <p className={`text-[10px] text-gray-600 mt-1 ${isMe ? "text-right" : "text-left"}`}>{m.time}</p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="fixed bottom-0 right-0 left-0 lg:left-60 px-4 py-3 z-40 flex gap-3 items-center"
        style={{ backgroundColor: `${BG}f7`, backdropFilter: "blur(12px)", borderTop: `1px solid rgba(124,58,237,0.12)` }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message…" className="flex-1 px-4 py-3 rounded-2xl text-white text-sm placeholder-gray-600 focus:outline-none"
          style={{ backgroundColor: SURFACE, border: `1px solid rgba(124,58,237,0.2)` }} />
        <button onClick={send} className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 active:scale-90 transition-all"
          style={{ background: `linear-gradient(135deg, ${PURPLE}, ${ORANGE})` }}><IcoSend /></button>
      </div>
    </>
  );
}

// ─── Chat Screen ──────────────────────────────────────────────────────────────
function ChatScreen({ onNav, onBack, setActiveConvo, convos, isAdmin }: { onNav: (s: Screen) => void; onBack: () => void; setActiveConvo: (id: string) => void; convos: Conversation[]; isAdmin: boolean }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchConvos, setSearchConvos] = useState("");
  const totalUnread = convos.reduce((a, c) => a + c.unread, 0);
  const totalResolved = convos.filter((c) => c.resolved).length;
  const threadScreen: Screen = isAdmin ? "admin-chat-thread" : "chat-thread";
  const openConvo = (id: string) => { setActiveConvo(id); setActiveId(id); onNav(threadScreen); };
  return (
    <>
      <TopBar title={isAdmin ? "Chat Management" : "Messages"} onBack={onBack} badge={totalUnread} isAdmin={isAdmin} />
      <Page noPad>
        <div className="pt-4 lg:grid lg:grid-cols-[320px_1fr] lg:h-[calc(100vh-56px)]">
          <div className="border-r overflow-y-auto px-4 sm:px-6 pb-20 lg:pb-4" style={{ borderColor: "rgba(124,58,237,0.1)" }}>
            {!isAdmin && (
              <div className="flex items-center gap-3 p-4 rounded-2xl mt-4" style={{ background: `linear-gradient(135deg, ${PURPLE_DIM}, rgba(249,115,22,0.1))`, border: `1px solid ${PURPLE_BORDER}` }}>
                <span className="text-2xl">🛡️</span>
                <div className="flex-1"><p className="text-white font-semibold text-sm">AFMC Support</p><p className="text-gray-400 text-xs">Available 7 AM – 9 PM daily</p></div>
                <button onClick={() => openConvo("c1")} className="px-3 py-1.5 rounded-full text-xs font-semibold text-white" style={{ background: `linear-gradient(135deg, ${PURPLE}, ${ORANGE})` }}>Chat</button>
              </div>
            )}
            {isAdmin && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {[{ n: totalUnread, l: "Unread", c: ORANGE }, { n: convos.length, l: "Customers", c: "#a78bfa" }, { n: totalResolved, l: "Resolved", c: "#34d399" }].map(({ n, l, c }) => (
                  <div key={l} className="rounded-xl p-2.5 text-center" style={{ backgroundColor: CARD }}>
                    <p style={{ fontFamily: "Barlow Condensed, sans-serif", color: c }} className="font-black text-xl">{n}</p>
                    <p className="text-gray-500 text-[10px]">{l}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="relative mt-4">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
              <input
                placeholder="Search conversations…"
                value={searchConvos}
                onChange={(e) => setSearchConvos(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl text-white text-sm placeholder-gray-600 focus:outline-none"
                style={{ backgroundColor: SURFACE, border: `1px solid rgba(124,58,237,0.15)` }}
              />
            </div>
            <p className="text-xs font-semibold tracking-widest uppercase mt-4 mb-2" style={{ color: "rgba(167,139,250,0.6)" }}>{isAdmin ? "Customer Inquiries" : "Direct Messages"}</p>
            <div className="flex flex-col gap-1">
              {convos.filter((c) => {
                const q = searchConvos.toLowerCase();
                return !q || c.name.toLowerCase().includes(q) || c.lastMsg.toLowerCase().includes(q);
              }).map((c) => (
                <button key={c.id} onClick={() => openConvo(c.id)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-left w-full transition-colors hover:bg-white/5"
                  style={{ backgroundColor: c.id === activeId ? PURPLE_DIM : c.unread > 0 ? "rgba(124,58,237,0.06)" : CARD, border: c.id === activeId ? `1px solid ${PURPLE_BORDER}` : "1px solid transparent" }}>
                  <div className="relative">
                    <span className="text-2xl">{c.avatar}</span>
                    {c.isSupport && <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#16a34a] flex items-center justify-center"><IcoShield /></span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-0.5">
                      <p className={`text-sm font-semibold ${c.unread > 0 ? "text-white" : "text-gray-300"}`}>{c.name}</p>
                      <p className="text-gray-500 text-[10px]">{c.time}</p>
                    </div>
                    <p className="text-gray-500 text-xs truncate">{c.lastMsg}</p>
                  </div>
                  {c.unread > 0 && <span className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: PURPLE }}>{c.unread}</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center" style={{ backgroundColor: BG }}>
            <div className="text-center">
              <p className="text-4xl mb-3">🎾</p>
              <p className="text-gray-500 text-sm">Select a conversation to start chatting</p>
            </div>
          </div>
        </div>
      </Page>
    </>
  );
}

// ─── Admin Newsfeed ───────────────────────────────────────────────────────────
function AdminNewsfeedScreen({ onBack, posts, setPosts, pendingPosts, setPendingPosts }: { onBack: () => void; posts: Post[]; setPosts: React.Dispatch<React.SetStateAction<Post[]>>; pendingPosts: Post[]; setPendingPosts: React.Dispatch<React.SetStateAction<Post[]>> }) {
  const [tab, setTab] = useState<"feed" | "pending" | "create">("feed");
  const pending = pendingPosts;
  const setPending = setPendingPosts;
  const approved = posts;
  const setApproved = setPosts;
  const [newType, setNewType] = useState<PostType>("announcement");
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const approve = (p: Post) => { setApproved((prev) => [{ ...p, status: "approved" as PostStatus }, ...prev]); setPending((prev) => prev.filter((x) => x.id !== p.id)); };
  const reject = (id: string) => setPending((prev) => prev.filter((x) => x.id !== id));
  const publish = () => {
    if (!newTitle.trim() || !newBody.trim()) return;
    setApproved((prev) => [{ id: `admin${Date.now()}`, type: newType, title: newTitle, body: newBody, author: "AFMC Admin", avatar: "🛡️", date: "Just now", status: "approved", likes: 0, comments: 0, pinned: newType === "emergency" }, ...prev]);
    setNewTitle(""); setNewBody(""); setTab("feed");
  };
  return (
    <>
      <TopBar title="Newsfeed Mgmt" onBack={onBack} isAdmin />
      <Page noPad>
        <div className="border-b flex" style={{ borderColor: "rgba(124,58,237,0.15)" }}>
          {([["feed", "Live Feed"], ["pending", `Review (${pending.length})`], ["create", "Publish"]] as const).map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 py-3.5 text-xs font-bold tracking-wide transition-colors`}
              style={{ color: tab === t ? ORANGE : "#6b7280", borderBottom: tab === t ? `2px solid ${ORANGE}` : "2px solid transparent" }}>{label}</button>
          ))}
        </div>
        <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          {tab === "feed" && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {approved.map((p) => (
                <div key={p.id} className="rounded-2xl p-4" style={{ backgroundColor: CARD }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor: postTypeStyle[p.type].bg, color: postTypeStyle[p.type].text }}>{postTypeStyle[p.type].label}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: "rgba(22,163,74,0.15)", color: "#34d399" }}>● Live</span>
                  </div>
                  <p className="text-white font-semibold text-sm">{p.title}</p>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">{p.body}</p>
                  <div className="flex gap-3 mt-2.5 pt-2.5 border-t items-center" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <span className="text-gray-500 text-xs">❤️ {p.likes}</span>
                    <span className="text-gray-500 text-xs">💬 {p.comments}</span>
                    <span className="text-gray-500 text-xs">{p.date}</span>
                    <button onClick={() => setApproved((prev) => prev.filter((x) => x.id !== p.id))}
                      className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors hover:bg-red-500/15"
                      style={{ color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" }}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab === "pending" && (
            <div className="mt-4 flex flex-col gap-3 pb-8">
              {pending.length === 0 && <div className="text-center py-16"><p className="text-4xl mb-3">✅</p><p className="text-gray-400 text-sm">All clear — no posts awaiting review.</p></div>}
              {pending.map((p) => (
                <div key={p.id} className="rounded-2xl p-4" style={{ backgroundColor: CARD, border: `1px solid ${ORANGE_DIM}` }}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-xl">{p.avatar}</span>
                    <div><p className="text-white text-xs font-semibold">{p.author}</p><p className="text-gray-500 text-[10px]">{p.date}</p></div>
                  </div>
                  <p className="text-white font-semibold text-sm mb-1">{p.title}</p>
                  <p className="text-gray-400 text-xs leading-relaxed mb-3">{p.body}</p>
                  <div className="flex gap-2">
                    <button onClick={() => reject(p.id)} className="flex-1 py-2.5 rounded-xl text-red-400 border border-red-500/25 text-xs font-semibold hover:bg-red-500/10 transition-colors">✕ Reject</button>
                    <button onClick={() => approve(p)} className="flex-1 py-2.5 rounded-xl text-green-400 border border-green-500/25 text-xs font-semibold hover:bg-green-500/10 transition-colors">✓ Approve & Publish</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab === "create" && (
            <div className="mt-5 max-w-lg pb-8">
              <div className="mb-4">
                <label className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "rgba(167,139,250,0.7)" }}>Post Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["announcement", "tournament", "emergency", "community"] as PostType[]).map((t) => (
                    <button key={t} onClick={() => setNewType(t)} className="py-3 px-3 rounded-xl text-xs font-semibold text-left transition-all"
                      style={{ backgroundColor: newType === t ? postTypeStyle[t].bg : SURFACE, color: newType === t ? postTypeStyle[t].text : "#9ca3af", border: `1.5px solid ${newType === t ? postTypeStyle[t].text + "40" : "rgba(255,255,255,0.08)"}` }}>
                      {postTypeStyle[t].label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "rgba(167,139,250,0.7)" }}>Title</label>
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Post headline…" className="w-full px-4 py-3.5 rounded-2xl text-white text-sm placeholder-gray-600 focus:outline-none" style={{ backgroundColor: CARD, border: `1.5px solid rgba(255,255,255,0.1)` }} />
              </div>
              <div className="mb-5">
                <label className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "rgba(167,139,250,0.7)" }}>Body</label>
                <textarea value={newBody} onChange={(e) => setNewBody(e.target.value)} placeholder="Write the announcement…" rows={5} className="w-full px-4 py-3.5 rounded-2xl text-white text-sm placeholder-gray-600 focus:outline-none resize-none" style={{ backgroundColor: CARD, border: `1.5px solid rgba(255,255,255,0.1)` }} />
              </div>
              {newType === "emergency" && (
                <div className="mb-4 px-4 py-3 rounded-xl flex gap-2" style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
                  <span>🚨</span><p className="text-red-300 text-xs leading-relaxed">Emergency posts are <strong>pinned immediately</strong> and all AFMC players are notified.</p>
                </div>
              )}
              <button onClick={publish} className="w-full py-4 rounded-2xl text-white font-bold text-base active:scale-95 transition-all"
                style={{ background: newType === "emergency" ? "#dc2626" : `linear-gradient(135deg, ${PURPLE}, ${ORANGE})` }}>
                {newType === "emergency" ? "🚨 Publish Emergency Notice" : "Publish Post →"}
              </button>
            </div>
          )}
        </div>
      </Page>
    </>
  );
}

// ─── Screen: Pricing ──────────────────────────────────────────────────────────
function PricingScreen({ onNav, onBack, settings = DEFAULT_SETTINGS }: { onNav: (s: Screen) => void; onBack: () => void; settings?: Settings }) {
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
      colorDim: ORANGE_DIM,
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

// ─── Admin Settings ───────────────────────────────────────────────────────────
function AdminSettingsScreen({ settings, patchSettings, onBack }: { settings: Settings; patchSettings: (p: Partial<Settings>) => void; onBack: () => void }) {
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
              <div className="rounded-2xl p-4" style={{ background: `linear-gradient(135deg, ${PURPLE_DIM}, ${ORANGE_DIM})`, border: `1px solid ${PURPLE_BORDER}` }}>
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

              <div className="px-4 py-3 rounded-xl flex gap-2 items-start" style={{ backgroundColor: ORANGE_DIM, border: "1px solid rgba(249,115,22,0.25)" }}>
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
                            style={{ backgroundColor: court.color === col ? (col === "Purple" ? PURPLE_DIM : ORANGE_DIM) : SURFACE, color: court.color === col ? (col === "Purple" ? "#c4b5fd" : ORANGE) : "#9ca3af", border: `1.5px solid ${court.color === col ? (col === "Purple" ? PURPLE_BORDER : "rgba(249,115,22,0.35)") : "rgba(255,255,255,0.08)"}` }}>
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

// ─── Screen: Admin Bookings ───────────────────────────────────────────────────
function AdminBookingsScreen({ onBack, bookings, setBookings }: { onBack: () => void; bookings: Booking[]; setBookings: React.Dispatch<React.SetStateAction<Booking[]>> }) {
  const [filter, setFilter] = useState<BookingStatus | "All">("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const updateStatus = (id: string, status: BookingStatus) =>
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));

  const filtered = filter === "All" ? bookings : bookings.filter((b) => b.status === filter);
  const statuses: (BookingStatus | "All")[] = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

  const pendingCount = bookings.filter((b) => b.status === "Pending").length;

  return (
    <>
      <TopBar title="Booking Requests" onBack={onBack} isAdmin badge={pendingCount} />
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

// ─── Screen: Login ────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, onRegister }: { onLogin: (asAdmin: boolean) => void; onRegister: () => void }) {
  type Role = "player" | "admin" | null;
  const [role, setRole] = useState<Role>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const ADMIN_PASS = "admin2026";

  const handleSubmit = () => {
    if (email.trim().length < 3 || !password) { setError("Please fill in all fields."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (role === "admin") {
        if (password !== ADMIN_PASS) { setError("Incorrect admin password."); return; }
        onLogin(true);
      } else {
        onLogin(false);
      }
    }, 900);
  };

  const roleCards: { id: Role; icon: string; title: string; sub: string; color: string; dimBg: string; border: string }[] = [
    { id: "player", icon: "🎾", title: "I'm a Player", sub: "Book courts, chat & join the community", color: "#c4b5fd", dimBg: PURPLE_DIM, border: PURPLE_BORDER },
    { id: "admin", icon: "🛡️", title: "Admin Access", sub: "Manage courts, newsfeed & settings", color: ORANGE, dimBg: ORANGE_DIM, border: "rgba(249,115,22,0.35)" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10 relative overflow-hidden"
      style={{ backgroundColor: BG }}>
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, ${PURPLE} 0%, transparent 70%)`, filter: "blur(48px)" }} />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full opacity-10 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, ${ORANGE} 0%, transparent 70%)`, filter: "blur(60px)" }} />

      <div className="relative w-full max-w-sm">
        {/* Branding */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-white text-2xl mb-4"
            style={{ background: `linear-gradient(135deg, ${PURPLE} 0%, ${ORANGE} 100%)`, fontFamily: "Barlow Condensed, sans-serif" }}>
            AF
          </div>
          <h1 style={{ fontFamily: "Barlow Condensed, sans-serif" }}
            className="text-white font-black text-4xl uppercase tracking-widest leading-none mb-1">
            AFMC
          </h1>
          <p className="text-sm font-semibold tracking-widest" style={{ color: ORANGE }}>PICKLE HUB</p>
          <p className="text-xs mt-2 italic" style={{ color: "rgba(167,139,250,0.6)" }}>Serve. Rally. Believe.</p>
        </div>

        {/* Step 1 — Role selection */}
        {!role && (
          <div>
            <p className="text-center text-gray-400 text-sm mb-5">Choose how you want to sign in</p>
            <div className="flex flex-col gap-3">
              {roleCards.map((c) => (
                <button key={c.id} onClick={() => setRole(c.id)}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all active:scale-[0.98] hover:scale-[1.01]"
                  style={{ backgroundColor: CARD, border: `1.5px solid rgba(255,255,255,0.07)` }}>
                  <span className="text-3xl">{c.icon}</span>
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm">{c.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5 leading-snug">{c.sub}</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4l4 4-4 4" stroke={c.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              ))}
            </div>
            <p className="text-center text-gray-600 text-xs mt-8">
              By continuing you agree to AFMC's terms of service.
            </p>
          </div>
        )}

        {/* Step 2 — Login form */}
        {role && (
          <div>
            {/* Role badge + back */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => { setRole(null); setError(""); setEmail(""); setPassword(""); }}
                className="flex items-center gap-1.5 text-gray-400 text-xs hover:text-white transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back
              </button>
              <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: role === "admin" ? ORANGE_DIM : PURPLE_DIM,
                  color: role === "admin" ? ORANGE : "#c4b5fd",
                }}>
                {role === "admin" ? "🛡️ Admin Login" : "🎾 Player Login"}
              </span>
            </div>

            {/* Admin warning */}
            {role === "admin" && (
              <div className="mb-5 px-4 py-3 rounded-xl flex gap-2.5 items-start"
                style={{ backgroundColor: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.25)" }}>
                <span className="mt-0.5 text-sm" style={{ color: ORANGE }}>⚠️</span>
                <p className="text-xs leading-relaxed" style={{ color: ORANGE }}>
                  Admin access is restricted. Contact AFMC management if you need credentials.
                </p>
              </div>
            )}

            <p className="text-white font-bold text-xl mb-6" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
              {role === "admin" ? "Admin Sign In" : "Welcome Back"}
            </p>

            <div className="flex flex-col gap-4">
              {/* Email */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-2"
                  style={{ color: "rgba(167,139,250,0.7)" }}>
                  {role === "admin" ? "Admin Username" : "Username"}
                </label>
                <input
                  type="text"
                  placeholder={role === "admin" ? "Enter admin username" : "Enter your username"}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value.replace(/\s/g, "")); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full px-4 py-3.5 rounded-2xl text-white text-sm placeholder-gray-600 focus:outline-none transition-all"
                  style={{
                    backgroundColor: CARD,
                    border: `1.5px solid ${email.length >= 3 ? "rgba(22,163,74,0.5)" : "rgba(255,255,255,0.1)"}`,
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-2"
                  style={{ color: "rgba(167,139,250,0.7)" }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder={role === "admin" ? "Enter admin password" : "Enter your password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    className="w-full px-4 py-3.5 pr-12 rounded-2xl text-white text-sm placeholder-gray-600 focus:outline-none transition-all"
                    style={{
                      backgroundColor: CARD,
                      border: `1.5px solid ${error ? "rgba(239,68,68,0.5)" : password.length >= 6 ? "rgba(22,163,74,0.5)" : "rgba(255,255,255,0.1)"}`,
                    }}
                  />
                  <button onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors text-xs font-semibold">
                    {showPw ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="px-4 py-2.5 rounded-xl flex gap-2 items-center"
                  style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
                  <span className="text-sm">⚠️</span>
                  <p className="text-xs" style={{ color: "#f87171" }}>{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-1 py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                style={{ background: role === "admin" ? `linear-gradient(135deg, #92400e, ${ORANGE})` : `linear-gradient(135deg, ${PURPLE}, ${ORANGE})` }}>
                {loading
                  ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Signing in…</>
                  : role === "admin" ? "Access Admin Panel →" : "Sign In →"}
              </button>

              {role === "player" && (
                <div className="text-center space-y-2 mt-1">
                  <button type="button" onClick={() => setForgotSent(true)}
                    className="text-xs font-semibold hover:opacity-80 transition-opacity" style={{ color: "#a78bfa" }}>
                    {forgotSent ? "✓ Reset link sent!" : "Forgot password?"}
                  </button>
                  <p className="text-gray-600 text-xs">Don't have an account? <button onClick={onRegister} className="font-semibold" style={{ color: "#c4b5fd" }}>Create one</button></p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Screen: Register ─────────────────────────────────────────────────────────
function RegisterScreen({ onLogin, onBack }: { onLogin: () => void; onBack: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [skillLevel, setSkillLevel] = useState<string>("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const SKILL_LEVELS = [
    { id: "beginner", label: "Beginner", sub: "New to pickleball" },
    { id: "intermediate", label: "Intermediate", sub: "2.5 – 3.5 level" },
    { id: "advanced", label: "Advanced", sub: "4.0+ competitive" },
  ];

  const usernameValid = /^[a-zA-Z0-9_]{3,}$/.test(email);
  const pwMatch = password === confirm && password.length >= 8;

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "First name required";
    if (!lastName.trim()) e.lastName = "Last name required";
    if (!usernameValid) e.email = "Username must be at least 3 characters (letters, numbers, _)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!skillLevel) e.skill = "Pick your skill level";
    if (password.length < 8) e.password = "Password must be at least 8 characters";
    if (!pwMatch) e.confirm = "Passwords don't match";
    if (!agreeTerms) e.terms = "You must agree to continue";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validateStep1()) setStep(2); };

  const handleSubmit = () => {
    if (!validateStep2()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1200);
  };

  const inputBase = "w-full px-4 py-3.5 rounded-2xl text-white text-sm placeholder-gray-600 focus:outline-none transition-all";
  const inputStyle = (valid?: boolean, err?: string) => ({
    backgroundColor: CARD,
    border: `1.5px solid ${err ? "rgba(239,68,68,0.5)" : valid ? "rgba(22,163,74,0.5)" : "rgba(255,255,255,0.1)"}`,
  });

  if (done) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10 relative overflow-hidden"
      style={{ backgroundColor: BG }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, ${PURPLE} 0%, transparent 70%)`, filter: "blur(48px)" }} />
      <div className="relative w-full max-w-sm text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6"
          style={{ background: `linear-gradient(135deg, rgba(22,163,74,0.25), rgba(22,163,74,0.1))`, border: "2px solid rgba(22,163,74,0.5)" }}>
          ✓
        </div>
        <h2 style={{ fontFamily: "Barlow Condensed, sans-serif" }}
          className="text-white font-black text-4xl uppercase tracking-tight mb-2">
          You're In!
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-2">
          Welcome to AFMC Pickle Hub, <span className="text-white font-semibold">{firstName}</span>!
        </p>
        <p className="text-gray-500 text-xs leading-relaxed mb-8">
          Your account has been created. You can now book courts, join the community feed, and message other players.
        </p>
        <div className="rounded-2xl p-4 mb-8 text-left" style={{ backgroundColor: CARD, border: `1px solid ${PURPLE_BORDER}` }}>
          {[
            { l: "Name", v: `${firstName} ${lastName}` },
            { l: "Username", v: `@${email}` },
            { l: "Skill Level", v: SKILL_LEVELS.find((s) => s.id === skillLevel)?.label ?? skillLevel },
          ].map(({ l, v }) => (
            <div key={l} className="flex justify-between py-2 border-b text-sm" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <span className="text-gray-400">{l}</span>
              <span className="text-white font-medium">{v}</span>
            </div>
          ))}
        </div>
        <button onClick={onLogin}
          className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-95"
          style={{ background: `linear-gradient(135deg, ${PURPLE}, ${ORANGE})` }}>
          Go to Home →
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-5 py-10 relative overflow-hidden"
      style={{ backgroundColor: BG }}>
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] rounded-full opacity-15 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, ${PURPLE} 0%, transparent 70%)`, filter: "blur(48px)" }} />

      <div className="relative w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={step === 2 ? () => setStep(1) : onBack}
            className="flex items-center gap-1.5 text-gray-400 text-xs hover:text-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {step === 2 ? "Back" : "Sign In"}
          </button>
          <div className="flex items-center gap-1.5">
            <AFMCLogo size={24} />
            <span style={{ fontFamily: "Barlow Condensed, sans-serif", color: ORANGE }} className="font-black text-sm tracking-widest">AFMC</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-7">
          {([1, 2] as const).map((n) => (
            <div key={n} className="h-1 flex-1 rounded-full transition-all duration-500"
              style={{ backgroundColor: step >= n ? PURPLE : "rgba(255,255,255,0.1)" }} />
          ))}
        </div>

        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "rgba(167,139,250,0.6)" }}>
          Step {step} of 2
        </p>
        <h1 style={{ fontFamily: "Barlow Condensed, sans-serif" }}
          className="text-white font-black text-3xl uppercase tracking-tight mb-1">
          {step === 1 ? "Create Account" : "Set Your Level"}
        </h1>
        <p className="text-gray-500 text-sm mb-7">
          {step === 1 ? "Join the AFMC Pickle Hub community." : "Almost done — just a few more details."}
        </p>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "rgba(167,139,250,0.7)" }}>First Name</label>
                <input type="text" placeholder="Juan" value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); setErrors((p) => ({ ...p, firstName: "" })); }}
                  className={inputBase} style={inputStyle(firstName.trim().length > 0, errors.firstName)} />
                {errors.firstName && <p className="text-red-400 text-[10px] mt-1 pl-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "rgba(167,139,250,0.7)" }}>Last Name</label>
                <input type="text" placeholder="Dela Cruz" value={lastName}
                  onChange={(e) => { setLastName(e.target.value); setErrors((p) => ({ ...p, lastName: "" })); }}
                  className={inputBase} style={inputStyle(lastName.trim().length > 0, errors.lastName)} />
                {errors.lastName && <p className="text-red-400 text-[10px] mt-1 pl-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "rgba(167,139,250,0.7)" }}>Username</label>
              <input type="text" placeholder="e.g. juan_pb" value={email}
                onChange={(e) => { setEmail(e.target.value.replace(/\s/g, "")); setErrors((p) => ({ ...p, email: "" })); }}
                className={inputBase} style={inputStyle(usernameValid, errors.email)} />
              {errors.email
                ? <p className="text-red-400 text-[10px] mt-1 pl-1">{errors.email}</p>
                : <p className="text-gray-600 text-[10px] mt-1 pl-1">Letters, numbers, and underscores only</p>}
            </div>

            <button onClick={handleNext}
              className="w-full mt-1 py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-95"
              style={{ background: `linear-gradient(135deg, ${PURPLE}, ${ORANGE})` }}>
              Continue →
            </button>

            <p className="text-center text-gray-600 text-xs">
              Already have an account?{" "}
              <button onClick={onBack} className="font-semibold" style={{ color: "#c4b5fd" }}>Sign in</button>
            </p>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            {/* Skill level selector */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "rgba(167,139,250,0.7)" }}>Skill Level</label>
              <div className="flex flex-col gap-2">
                {SKILL_LEVELS.map((s) => {
                  const active = skillLevel === s.id;
                  return (
                    <button key={s.id} onClick={() => { setSkillLevel(s.id); setErrors((p) => ({ ...p, skill: "" })); }}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all"
                      style={{
                        backgroundColor: active ? PURPLE_DIM : CARD,
                        border: `1.5px solid ${active ? PURPLE : "rgba(255,255,255,0.07)"}`,
                      }}>
                      <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={{ borderColor: active ? PURPLE : "#4b5563" }}>
                        {active && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PURPLE }} />}
                      </span>
                      <div className="flex-1">
                        <p className="text-white text-sm font-semibold">{s.label}</p>
                        <p className="text-gray-500 text-xs">{s.sub}</p>
                      </div>
                      {active && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: PURPLE_DIM, color: "#c4b5fd" }}>Selected</span>}
                    </button>
                  );
                })}
              </div>
              {errors.skill && <p className="text-red-400 text-[10px] mt-1 pl-1">{errors.skill}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "rgba(167,139,250,0.7)" }}>Create Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} placeholder="Min. 8 characters" value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "", confirm: "" })); }}
                  className={inputBase + " pr-16"} style={inputStyle(password.length >= 8, errors.password)} />
                <button onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-xs font-semibold transition-colors">
                  {showPw ? "HIDE" : "SHOW"}
                </button>
              </div>
              {/* Strength bar */}
              {password.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3].map((n) => {
                    const strength = password.length < 8 ? 1 : password.match(/[A-Z]/) && password.match(/\d/) ? 3 : 2;
                    return <div key={n} className="h-1 flex-1 rounded-full transition-all"
                      style={{ backgroundColor: n <= strength ? (strength === 3 ? "#16a34a" : strength === 2 ? ORANGE : "#ef4444") : "rgba(255,255,255,0.1)" }} />;
                  })}
                  <span className="text-[10px] ml-1" style={{ color: password.length < 8 ? "#f87171" : password.match(/[A-Z]/) && password.match(/\d/) ? "#34d399" : ORANGE }}>
                    {password.length < 8 ? "Weak" : password.match(/[A-Z]/) && password.match(/\d/) ? "Strong" : "Fair"}
                  </span>
                </div>
              )}
              {errors.password && <p className="text-red-400 text-[10px] mt-1 pl-1">{errors.password}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: "rgba(167,139,250,0.7)" }}>Confirm Password</label>
              <input type={showPw ? "text" : "password"} placeholder="Repeat your password" value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setErrors((p) => ({ ...p, confirm: "" })); }}
                className={inputBase} style={inputStyle(confirm.length > 0 && pwMatch, errors.confirm)} />
              {errors.confirm && <p className="text-red-400 text-[10px] mt-1 pl-1">{errors.confirm}</p>}
            </div>

            {/* Terms */}
            <button onClick={() => { setAgreeTerms(!agreeTerms); setErrors((p) => ({ ...p, terms: "" })); }}
              className="flex items-start gap-3 text-left">
              <span className="mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all"
                style={{ backgroundColor: agreeTerms ? PURPLE : "transparent", borderColor: agreeTerms ? PURPLE : errors.terms ? "#ef4444" : "#4b5563" }}>
                {agreeTerms && <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </span>
              <p className="text-gray-400 text-xs leading-relaxed">
                I agree to AFMC Pickle Hub's <span className="font-semibold" style={{ color: "#c4b5fd" }}>Terms of Service</span> and{" "}
                <span className="font-semibold" style={{ color: "#c4b5fd" }}>Privacy Policy</span>
              </p>
            </button>
            {errors.terms && <p className="text-red-400 text-[10px] -mt-2 pl-8">{errors.terms}</p>}

            <button onClick={handleSubmit} disabled={loading}
              className="w-full mt-1 py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg, ${PURPLE}, ${ORANGE})` }}>
              {loading
                ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Creating account…</>
                : "Create My Account →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [history, setHistory] = useState<Screen[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeConvo, setActiveConvo] = useState<string>("c1");
  const [custConvos, setCustConvos] = useState<Conversation[]>(INITIAL_CONVOS);
  const [adminConvos, setAdminConvos] = useState<Conversation[]>(ADMIN_CONVOS);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const patchSettings = (p: Partial<Settings>) => setSettings((s) => ({ ...s, ...p }));
  const [bookings, setBookings] = useState<Booking[]>(SAMPLE_BOOKINGS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [pendingPosts, setPendingPosts] = useState<Post[]>(PENDING_POSTS);

  const navigate = (s: Screen) => { setHistory((h) => [...h, screen]); setScreen(s); };
  const goBack = () => { const prev = history[history.length - 1] ?? "home"; setHistory((h) => h.slice(0, -1)); setScreen(prev); };

  const handleLogin = (asAdmin: boolean) => {
    setIsAdmin(asAdmin);
    setHistory([]);
    setScreen(asAdmin ? "admin-newsfeed" : "home");
  };

  const handleLogout = () => {
    setHistory([]);
    setIsAdmin(false);
    setScreen("login");
  };

  const topBarProps = { onNav: navigate, onLogout: handleLogout, isAdmin };

  const bottomNavScreens: Screen[] = ["home", "venue-detail", "calendar", "pricing", "newsfeed", "chat", "dashboard", "admin-bookings", "admin-newsfeed", "admin-chat", "admin-settings"];
  const showBottomNav = bottomNavScreens.includes(screen);

  if (screen === "login") return <LoginScreen onLogin={handleLogin} onRegister={() => setScreen("register")} />;
  if (screen === "register") return <RegisterScreen onLogin={() => handleLogin(false)} onBack={() => setScreen("login")} />;

  return (
    <TopBarCtx.Provider value={topBarProps}>
    <div className="min-h-screen w-full" style={{ backgroundColor: BG }}>
      <Sidebar screen={screen} onNav={navigate} isAdmin={isAdmin} />
      <div className="lg:pl-60">
        {screen === "home" && <HomeScreen onNav={navigate} isAdmin={isAdmin} menuOpen={menuOpen} setMenuOpen={setMenuOpen} settings={settings} bookings={bookings} posts={posts} members={adminConvos.length} />}
        {screen === "venue-detail" && <VenueDetailScreen onNav={navigate} onBack={goBack} settings={settings} />}
        {screen === "calendar" && <CalendarScreen onNav={navigate} onBack={goBack} settings={settings} />}
        {screen === "checkout" && <CheckoutScreen onNav={navigate} onBack={goBack} settings={settings} />}
        {screen === "payment" && <PaymentScreen onNav={navigate} onBack={goBack} settings={settings} />}
        {screen === "dashboard" && <DashboardScreen onBack={goBack} bookings={bookings} setBookings={setBookings} />}
        {screen === "pricing" && <PricingScreen onNav={navigate} onBack={goBack} settings={settings} />}
        {screen === "newsfeed" && <NewsfeedScreen onBack={goBack} posts={posts} setPosts={setPosts} pendingPosts={pendingPosts} setPendingPosts={setPendingPosts} members={adminConvos.length} availableCourts={settings.courts.filter((c) => c.available).length} />}
        {screen === "chat" && <ChatScreen onNav={navigate} onBack={goBack} setActiveConvo={setActiveConvo} convos={custConvos} isAdmin={false} />}
        {screen === "chat-thread" && <ChatThreadScreen convoId={activeConvo} convos={custConvos} setConvos={setCustConvos} onBack={goBack} isAdmin={false} />}
        {screen === "admin-bookings" && <AdminBookingsScreen onBack={goBack} bookings={bookings} setBookings={setBookings} />}
        {screen === "admin-newsfeed" && <AdminNewsfeedScreen onBack={goBack} posts={posts} setPosts={setPosts} pendingPosts={pendingPosts} setPendingPosts={setPendingPosts} />}
        {screen === "admin-chat" && <ChatScreen onNav={navigate} onBack={goBack} setActiveConvo={setActiveConvo} convos={adminConvos} isAdmin={true} />}
        {screen === "admin-chat-thread" && <ChatThreadScreen convoId={activeConvo} convos={adminConvos} setConvos={setAdminConvos} onBack={goBack} isAdmin />}
        {screen === "admin-settings" && <AdminSettingsScreen settings={settings} patchSettings={patchSettings} onBack={goBack} />}
        {showBottomNav && <BottomNav screen={screen} onNav={navigate} isAdmin={isAdmin} />}
      </div>
    </div>
    </TopBarCtx.Provider>
  );
}
