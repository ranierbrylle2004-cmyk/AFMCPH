import { useState } from "react";
import type { Screen, Settings, Booking, Post, Conversation } from "./types/index";
import { DEFAULT_SETTINGS, BG } from "./constants/theme";
import { TopBarCtx, Sidebar, BottomNav } from "./components/Layout";

// Auth screens
import { LoginScreen } from "./screens/auth/LoginScreen";
import { RegisterScreen } from "./screens/auth/RegisterScreen";

// Customer screens
import { HomeScreen } from "./screens/customer/HomeScreen";
import { VenueDetailScreen } from "./screens/customer/VenueDetailScreen";
import { CalendarScreen } from "./screens/customer/CalendarScreen";
import { CheckoutScreen } from "./screens/customer/CheckoutScreen";
import { PaymentScreen } from "./screens/customer/PaymentScreen";
import { DashboardScreen } from "./screens/customer/DashboardScreen";
import { PricingScreen } from "./screens/customer/PricingScreen";

// Community screens
import { NewsfeedScreen } from "./screens/community/NewsfeedScreen";
import { ChatScreen } from "./screens/community/ChatScreen";
import { ChatThreadScreen } from "./screens/community/ChatThreadScreen";

// Admin screens
import { AdminBookingsScreen } from "./screens/admin/AdminBookingsScreen";
import { AdminNewsfeedScreen } from "./screens/admin/AdminNewsfeedScreen";
import { AdminSettingsScreen } from "./screens/admin/AdminSettingsScreen";

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [history, setHistory] = useState<Screen[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeConvo, setActiveConvo] = useState<string>("c1");
  const [custConvos, setCustConvos] = useState<Conversation[]>([]);
  const [adminConvos, setAdminConvos] = useState<Conversation[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const patchSettings = (p: Partial<Settings>) => setSettings((s) => ({ ...s, ...p }));
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [pendingPosts, setPendingPosts] = useState<Post[]>([]);

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