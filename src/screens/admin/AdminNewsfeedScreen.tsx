import { useState } from "react";
import type { Post, PostType, PostStatus } from "../../types/index";
import { ORANGE, CARD, PURPLE, PURPLE_DIM, PURPLE_BORDER, SURFACE, postTypeStyle } from "../../constants/theme";
import { TopBar, Page } from "../../components/Layout";

export function AdminNewsfeedScreen({ onBack, posts, setPosts, pendingPosts, setPendingPosts }: { onBack: () => void; posts: Post[]; setPosts: React.Dispatch<React.SetStateAction<Post[]>>; pendingPosts: Post[]; setPendingPosts: React.Dispatch<React.SetStateAction<Post[]>> }) {
  const [tab, setTab] = useState<"feed" | "pending" | "create">("feed");
  const [newType, setNewType] = useState<PostType>("announcement");
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const approve = (p: Post) => {
    setPosts((prev) => [{ ...p, status: "approved" as PostStatus }, ...prev]);
    setPendingPosts((prev) => prev.filter((x) => x.id !== p.id));
  };
  const reject = (id: string) => setPendingPosts((prev) => prev.filter((x) => x.id !== id));
  const publish = () => {
    if (!newTitle.trim() || !newBody.trim()) return;
    setPosts((prev) => [{ id: `admin${Date.now()}`, type: newType, title: newTitle, body: newBody, author: "AFMC Admin", avatar: "🛡️", date: "Just now", status: "approved", likes: 0, comments: 0, pinned: newType === "emergency" }, ...prev]);
    setNewTitle(""); setNewBody(""); setTab("feed");
  };
  return (
    <>
      <TopBar title="Newsfeed Mgmt" onBack={onBack} isAdmin />
      <Page noPad>
        <div className="border-b flex" style={{ borderColor: "rgba(124,58,237,0.15)" }}>
          {([["feed", "Live Feed"], ["pending", `Review (${pendingPosts.length})`], ["create", "Publish"]] as const).map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 py-3.5 text-xs font-bold tracking-wide transition-colors`}
              style={{ color: tab === t ? ORANGE : "#6b7280", borderBottom: tab === t ? `2px solid ${ORANGE}` : "2px solid transparent" }}>{label}</button>
          ))}
        </div>
        <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          {tab === "feed" && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {posts.map((p) => (
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
                    <button onClick={() => setPosts((prev) => prev.filter((x) => x.id !== p.id))}
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
              {pendingPosts.length === 0 && <div className="text-center py-16"><p className="text-4xl mb-3">✅</p><p className="text-gray-400 text-sm">All clear — no posts awaiting review.</p></div>}
              {pendingPosts.map((p) => (
                <div key={p.id} className="rounded-2xl p-4" style={{ backgroundColor: CARD, border: `1px solid rgba(249,115,22,0.15)` }}>
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
