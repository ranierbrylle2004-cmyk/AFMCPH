export type Screen =
  | "login" | "register"
  | "home" | "venue-detail" | "calendar" | "checkout" | "payment" | "dashboard"
  | "newsfeed" | "chat" | "chat-thread" | "pricing"
  | "admin-newsfeed" | "admin-chat" | "admin-chat-thread" | "admin-settings" | "admin-bookings";

export type SlotStatus = "available" | "reserved" | "booked" | "closed";
export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";
export type PostStatus = "approved" | "pending" | "rejected";
export type PostType = "tournament" | "announcement" | "emergency" | "community";

export interface Post {
  id: string;
  type: PostType;
  title: string;
  body: string;
  author: string;
  avatar: string;
  date: string;
  status: PostStatus;
  likes: number;
  comments: number;
  pinned?: boolean;
}

export interface Message {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: number;
  isSupport?: boolean;
  resolved?: boolean;
  messages: Message[];
}

export interface Booking {
  id: string;
  court: string;
  sport: string;
  date: string;
  time: string;
  status: BookingStatus;
  createdAt: Date;
  price: string;
  player: string;
  avatar: string;
}

export interface TimeSlot {
  time: string;
  status: SlotStatus;
}

export interface Settings {
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