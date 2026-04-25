import { useState, useEffect } from "react";

const API_KEY = "cf96f13bd62c4223a6aef3c5ae5ce078";
const BASE_URL = "https://api.rawg.io/api";

const categories = [
  { label: "সব", genre: "" },
  { label: "অ্যাকশন", genre: "action" },
  { label: "পাজল", genre: "puzzle" },
  { label: "স্পোর্টস", genre: "sports" },
  { label: "অ্যাডভেঞ্চার", genre: "adventure" },
  { label: "রেসিং", genre: "racing" },
  { label: "RPG", genre: "role-playing-games-rpg" },
];

function Skeleton() {
  return (
    <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ height: 90, background: "rgba(255,255,255,0.07)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)", animation: "shimmer 1.5s infinite" }} />
      </div>
      <div style={{ padding: 8 }}>
        <div style={{ height: 10, background: "rgba(255,255,255,0.07)", borderRadius: 4, marginBottom: 6 }} />
        <div style={{ height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4, width: "60%" }} />
      </div>
    </div>
  );
}

export default function LufeNao() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [activeTab, setActiveTab] = useState("হোম");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchGames = async (genre, search, pageNum, replace = true) => {
    setLoading(true);
    setError(null);
    try {
      let url = `${BASE_URL}/games?key=${API_KEY}&page_size=12&page=${pageNum}&ordering=-rating`;
      if (genre) url += `&genres=${genre}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setGames(prev => replace ? data.results : [...prev, ...data.results]);
      setHasMore(!!data.next);
    } catch (e) {
      setError("গেম লোড হয়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchGames(activeCategory.genre, searchQuery, 1, true);
  }, [activeCategory, searchQuery]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setActiveCategory(categories[0]);
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchGames(activeCategory.genre, searchQuery, next, false);
  };

  const handlePlay = (game) => {
    const url = game.website || `https://www.rawg.io/games/${game.slug}`;
    window.open(url, "_blank");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", fontFamily: "'Hind Siliguri', sans-serif", color: "#fff", paddingBottom: 80 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .game-card { transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; animation: fadeIn 0.4s ease both; }
        .game-card:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 12px 40px rgba(0,240,255,0.2) !important; }
        .cat-btn { transition: all 0.2s; cursor: pointer; border: none; }
        @keyframes glow { 0%,100%{text-shadow:0 0 10px #00f0ff,0 0 20px #00f0ff}50%{text-shadow:0 0 20px #00f0ff,0 0 40px #00f0ff,0 0 60px #7b2fff} }
        @keyframes ticker { 0%{transform:translateX(100%)} 100%{transform:translateX(-100%)} }
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .logo-text { animation: glow 3s ease-in-out infinite; font-family: 'Orbitron', monospace; }
        .live-dot { animation: pulse-dot 1.5s ease-in-out infinite; }
        .hero-emoji { animation: float 3s ease-in-out infinite; display: inline-block; }
      `}</style>

      {/* Header */}
      <header style={{ background: "linear-gradient(180deg,#0d1224 0%,#0a0e1a 100%)", borderBottom: "1px solid rgba(0,240,255,0.15)", padding: "14px 16px", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#00f0ff,#7b2fff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎮</div>
            <div>
              <div className="logo-text" style={{ fontSize: 18, fontWeight: 900, color: "#00f0ff", letterSpacing: 1 }}>LUFE NAO</div>
              <div style={{ fontSize: 9, color: "#7b2fff", letterSpacing: 3, textTransform: "uppercase" }}>Game Portal</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ background: "transparent", border: "1px solid rgba(0,240,255,0.3)", borderRadius: 20, padding: "6px 14px", color: "#00f0ff", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>লগইন</button>
            <button style={{ background: "linear-gradient(135deg,#00f0ff,#7b2fff)", border: "none", borderRadius: 20, padding: "6px 14px", color: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>নিবন্ধন</button>
          </div>
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14 }}>🔍</span>
            <input value={searchInput} onChange={e => setSearchInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} placeholder="গেম খুঁজুন..." style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(0,240,255,0.2)", borderRadius: 24, padding: "9px 16px 9px 36px", color: "#fff", fontSize: 13, fontFamily: "inherit", outline: "none" }} />
          </div>
          <button onClick={handleSearch} style={{ background: "linear-gradient(135deg,#00f0ff,#7b2fff)", border: "none", borderRadius: 20, padding: "9px 16px", color: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>খুঁজুন</button>
        </div>
      </header>

      {/* Ticker */}
      <div style={{ background: "rgba(0,240,255,0.06)", borderBottom: "1px solid rgba(0,240,255,0.1)", padding: "8px 0", overflow: "hidden", display: "flex", alignItems: "center" }}>
        <span style={{ paddingLeft: 16, fontSize: 14, flexShrink: 0 }}>📢</span>
        <div style={{ overflow: "hidden", flex: 1 }}>
          <div style={{ animation: "ticker 20s linear infinite", whiteSpace: "nowrap", fontSize: 12, color: "#00f0ff", paddingLeft: "100%" }}>
            🎮 হাজার হাজার গেম এখন Lufe Nao-তে! &nbsp;&nbsp;&nbsp; 🏆 সেরা গেম বিনামূল্যে খেলো &nbsp;&nbsp;&nbsp; 🚀 প্রতিদিন নতুন গেম আপডেট &nbsp;&nbsp;&nbsp; 🎯 RAWG Database থেকে সরাসরি
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ margin: "16px", borderRadius: 16, background: "linear-gradient(135deg,#0d1f3c 0%,#1a0d3c 50%,#0d2a1f 100%)", border: "1px solid rgba(0,240,255,0.2)", padding: "24px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,240,255,0.15) 0%,transparent 70%)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 11, color: "#00f0ff", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>
            <span className="live-dot" style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#00ff88", marginRight: 6, verticalAlign: "middle" }} />লাইভ গেমিং
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 6, lineHeight: 1.2 }}>
            <span className="hero-emoji">🎮</span> হাজারো গেম<br />এখনই খেলো!
          </div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16 }}>RAWG Database থেকে সরাসরি গেম</div>
          <button onClick={() => setActiveCategory(categories[0])} style={{ background: "linear-gradient(135deg,#00f0ff,#7b2fff)", border: "none", borderRadius: 20, padding: "10px 24px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>সব গেম দেখো →</button>
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: "0 16px 12px", overflowX: "auto", display: "flex", gap: 8 }}>
        {categories.map(cat => (
          <button key={cat.label} className="cat-btn" onClick={() => setActiveCategory(cat)} style={{ flexShrink: 0, background: activeCategory.label === cat.label ? "linear-gradient(135deg,#00f0ff,#7b2fff)" : "rgba(255,255,255,0.06)", border: activeCategory.label === cat.label ? "none" : "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "8px 16px", color: "#fff", fontSize: 12, fontFamily: "inherit", fontWeight: activeCategory.label === cat.label ? 700 : 400 }}>{cat.label}</button>
        ))}
      </div>

      {/* Games Grid */}
      <div style={{ padding: "0 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{searchQuery ? `"${searchQuery}" এর ফলাফল` : activeCategory.label === "সব" ? "সব গেম" : activeCategory.label}</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>{games.length}+ গেম</div>
        </div>

        {error && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
            <div style={{ color: "#ef4444", marginBottom: 12 }}>{error}</div>
            <button onClick={() => fetchGames(activeCategory.genre, searchQuery, 1)} style={{ background: "linear-gradient(135deg,#00f0ff,#7b2fff)", border: "none", borderRadius: 20, padding: "10px 24px", color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>আবার চেষ্টা করুন</button>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {games.map((game, i) => (
            <div key={game.id} className="game-card" onClick={() => handlePlay(game)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.3)", animationDelay: `${(i % 12) * 0.05}s` }}>
              <div style={{ height: 90, background: `hsl(${(i * 37) % 360},40%,12%)`, position: "relative", borderBottom: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
                {game.background_image
                  ? <img src={game.background_image} alt={game.name} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
                  : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 32 }}>🎮</div>
                }
                {game.rating >= 4 && <span style={{ position: "absolute", top: 5, left: 5, background: "#ff4444", color: "#fff", fontSize: 8, fontWeight: 700, borderRadius: 4, padding: "2px 5px" }}>HOT</span>}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent,rgba(0,0,0,0.7))", padding: "12px 6px 4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <span style={{ color: "#fbbf24", fontSize: 10 }}>★</span>
                    <span style={{ fontSize: 10, color: "#fff" }}>{game.rating?.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <div style={{ padding: "8px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, lineHeight: 1.2, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{game.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 9, color: "#64748b" }}>{game.genres?.[0]?.name || "Game"}</span>
                  <span style={{ fontSize: 9, color: "#00f0ff", background: "rgba(0,240,255,0.1)", borderRadius: 4, padding: "2px 5px" }}>খেলো ▶</span>
                </div>
              </div>
            </div>
          ))}
          {loading && Array.from({ length: 12 }).map((_, i) => <Skeleton key={`sk-${i}`} />)}
        </div>

        {!loading && hasMore && games.length > 0 && (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button onClick={loadMore} style={{ background: "rgba(0,240,255,0.1)", border: "1px solid rgba(0,240,255,0.3)", borderRadius: 20, padding: "12px 32px", color: "#00f0ff", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>আরো গেম দেখো ↓</button>
          </div>
        )}

        {!loading && games.length === 0 && !error && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#4b5563" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div>কোনো গেম পাওয়া যায়নি</div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(10,14,26,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(0,240,255,0.15)", display: "flex", justifyContent: "space-around", padding: "10px 0 14px", zIndex: 100 }}>
        {[{ icon: "🏠", label: "হোম" }, { icon: "🎮", label: "গেম" }, { icon: "🏆", label: "র‍্যাংকিং" }, { icon: "👤", label: "প্রোফাইল" }].map(tab => (
          <button key={tab.label} onClick={() => setActiveTab(tab.label)} style={{ background: "transparent", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", padding: "4px 16px" }}>
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span style={{ fontSize: 10, fontFamily: "inherit", color: activeTab === tab.label ? "#00f0ff" : "#64748b", fontWeight: activeTab === tab.label ? 700 : 400 }}>{tab.label}</span>
            {activeTab === tab.label && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#00f0ff" }} />}
          </button>
        ))}
      </div>
    </div>
  );
}
