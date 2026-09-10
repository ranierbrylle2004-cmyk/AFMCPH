import { useState } from "react";
import type { Post } from "../types";
import { CARD, ORANGE, PURPLE, PURPLE_BORDER, SURFACE, postTypeStyle } from "../constants/theme";
import { IcoHeart, IcoComment } from "./Icons";

export function PostCard({ post, liked, onLike }: { post: Post; liked: boolean; onLike: () => void }) {
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
    <div className="rounded-2xl p-4" style={{ backgroundColor: CARD, border: isPending ? `1px solid rgba(249,115,22,0.15)` : "1px solid rgba(255,255,255,0.05)", opacity: isPending ? 0.8 : 1 }}>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xl">{post.avatar}</span>
          <div><p className="text-white text-xs font-semibold">{post.author}</p><p className="text-gray-500 text-[10px]">{post.date}</p></div>
        </div>
        <div className="flex items-center gap-2">
          {isPending && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: "rgba(249,115,22,0.15)", color: ORANGE }}>Pending</span>}
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