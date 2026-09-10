import { useState } from "react";
import type { Post, PostType } from "../../types/index";
import { PURPLE, PURPLE_DIM, PURPLE_BORDER, CARD, SURFACE, BG, ORANGE, ORANGE_DIM, postTypeStyle } from "../../constants/theme";
import { IcoPin } from "../../components/Icons";
import { TopBar, Page } from "../../components/Layout";
import { PostCard } from "../../components/PostCard";

interface NewsfeedScreenProps {
  onBack: () => void;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  pendingPosts: Post[];
  setPendingPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  members?: number;
  availableCourts?: number;
}

export function NewsfeedScreen({ onBack, posts, setPosts, pendingPosts, setPendingPosts, members = 0, availableCourts = 0 }: NewsfeedScreenProps) {
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
