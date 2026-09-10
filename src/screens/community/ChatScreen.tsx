import { useState } from "react";
import type { Screen, Conversation } from "../../types/index";
import { PURPLE, PURPLE_DIM, PURPLE_BORDER, CARD, SURFACE, BG, ORANGE } from "../../constants/theme";
import { IcoShield } from "../../components/Icons";
import { TopBar, Page } from "../../components/Layout";

interface ChatScreenProps {
  onNav: (s: Screen) => void;
  onBack: () => void;
  setActiveConvo: (id: string) => void;
  convos: Conversation[];
  isAdmin: boolean;
}

export function ChatScreen({ onNav, onBack, setActiveConvo, convos, isAdmin }: ChatScreenProps) {
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
