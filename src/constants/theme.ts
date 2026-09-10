import type { Settings, SlotStatus, BookingStatus, PostType, Conversation } from "../types/index";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
export const PURPLE = "#7c3aed";
export const PURPLE_DIM = "rgba(124,58,237,0.18)";
export const PURPLE_BORDER = "rgba(124,58,237,0.35)";
export const ORANGE = "#f97316";
export const ORANGE_DIM = "rgba(249,115,22,0.15)";
export const CARD = "#16161f";
export const SURFACE = "#1e1e2a";
export const BG = "#0d0d14";

// ─── Rates ────────────────────────────────────────────────────────────────────
const RATE_MORNING = 250;
const RATE_EVENING = 300;

export const isMorningSlot = (time: string) => {
  const hour = parseInt(time.split(":")[0]);
  const isPM = time.includes("PM");
  const h24 = isPM && hour !== 12 ? hour + 12 : !isPM && hour === 12 ? 0 : hour;
  return h24 < 12;
};

// ─── Default Settings ─────────────────────────────────────────────────────────
export const DEFAULT_SETTINGS: Settings = {
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

// ─── Data ─────────────────────────────────────────────────────────────────────
export const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const WEEK_DATES = ["18", "19", "20", "21", "22", "23", "24"];

export const DEFAULT_SUPPORT_CONVO: Conversation = {
  id: "c1",
  name: "AFMC Support",
  avatar: "🛡️",
  lastMsg: "Hi! How can we help you today?",
  time: "Now",
  unread: 0,
  isSupport: true,
  messages: [{ id: "m1", from: "them", text: "Hi! How can we help you today?", time: "9:00 AM" }],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const slotColor: Record<SlotStatus, string> = {
  available: "#16a34a",
  reserved: ORANGE,
  booked: "#dc2626",
  closed: "#374151",
};

export const slotLabel: Record<SlotStatus, string> = {
  available: "Available",
  reserved: "Reserved",
  booked: "Fully Booked",
  closed: "Closed",
};

export const bookingColors: Record<BookingStatus, { bg: string; text: string }> = {
  Pending: { bg: ORANGE_DIM, text: ORANGE },
  Confirmed: { bg: "rgba(22,163,74,0.15)", text: "#16a34a" },
  Completed: { bg: PURPLE_DIM, text: "#a78bfa" },
  Cancelled: { bg: "rgba(239,68,68,0.15)", text: "#f87171" },
};

export const postTypeStyle: Record<PostType, { bg: string; text: string; label: string }> = {
  emergency: { bg: "rgba(239,68,68,0.15)", text: "#f87171", label: "🚨 Emergency" },
  tournament: { bg: ORANGE_DIM, text: ORANGE, label: "🏆 Tournament" },
  announcement: { bg: PURPLE_DIM, text: "#a78bfa", label: "📢 Announcement" },
  community: { bg: "rgba(22,163,74,0.12)", text: "#34d399", label: "👥 Community" },
};

export const daysBetween = (a: Date, b: Date) => Math.floor((b.getTime() - a.getTime()) / 86400000);