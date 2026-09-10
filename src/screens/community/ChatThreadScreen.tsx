import { useState, useEffect, useRef } from "react";
import type { Conversation, Message } from "../../types/index";
import { BG, PURPLE, PURPLE_DIM, PURPLE_BORDER, ORANGE, CARD, SURFACE } from "../../constants/theme";
import { IcoBack, IcoSend, IcoShield } from "../../components/Icons";

interface ChatThreadScreenProps {
  convoId: string;
  convos: Conversation[];
  setConvos: (c: Conversation[]) => void;
  onBack: () => void;
  isAdmin: boolean;
}

export function ChatThreadScreen({ convoId, convos, setConvos, onBack, isAdmin }: ChatThreadScreenProps) {
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
