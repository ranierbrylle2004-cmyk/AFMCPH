import { ORANGE, PURPLE } from "../constants/theme";

export const IcoMenu = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect y="4" width="22" height="2" rx="1" fill="white"/>
    <rect y="10" width="16" height="2" rx="1" fill="white"/>
    <rect y="16" width="22" height="2" rx="1" fill="white"/>
  </svg>
);

export const IcoClose = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M4 4l12 12M16 4L4 16" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export const IcoBack = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M14 5l-7 6 7 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IcoSend = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M18 2L2 9l7 2 2 7 7-16Z" fill="white"/>
  </svg>
);

export const IcoClock = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.5" stroke={ORANGE} strokeWidth="1.5"/>
    <path d="M8 5v3.5l2.5 1.5" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const IcoUpload = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 20V10M14 10l-4 4M14 10l4 4" stroke={PURPLE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 20c0 2 1 3 3 3h12c2 0 3-1 3-3" stroke={PURPLE} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export const IcoHeart = ({ filled }: { filled?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill={filled ? "#f87171" : "none"}>
    <path d="M8 13.5S2 9.5 2 5.5A3.5 3.5 0 0 1 8 3.6 3.5 3.5 0 0 1 14 5.5c0 4-6 8-6 8Z" stroke={filled ? "#f87171" : "#6b7280"} strokeWidth="1.4"/>
  </svg>
);

export const IcoComment = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 3h12v8H9l-3 2v-2H2V3Z" stroke="#6b7280" strokeWidth="1.4"/>
  </svg>
);

export const IcoPin = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1v6m0 6v-2M4 5l3-4 3 4v2H4V5Z" stroke={ORANGE} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const IcoShield = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
    <path d="M8 1l5 2v4c0 3-2 6-5 7C6 13 3 10 3 7V3l5-2Z" stroke="white" strokeWidth="1.8"/>
  </svg>
);

export const IcoBell = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 2a6 6 0 0 0-6 6c0 3-1.5 4.5-2 5h16c-.5-.5-2-2-2-5a6 6 0 0 0-6-6Z" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M8.5 17a1.5 1.5 0 0 0 3 0" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);