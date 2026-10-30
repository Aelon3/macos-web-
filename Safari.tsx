import { useState } from "react";
import { useOS } from "@/os/store";
import { cn } from "@/utils/cn";
import { Chevron } from "@/os/icons";

const FAVORITES = [
  { name: "Apple", host: "apple.com", bg: "linear-gradient(135deg,#55595f,#1d1f22)", glyph: "" },
  { name: "GitHub", host: "github.com", bg: "linear-gradient(135deg,#3b414b,#14161a)", glyph: "🐙" },
  { name: "YouTube", host: "youtube.com", bg: "linear-gradient(135deg,#ff5a5a,#c60000)", glyph: "▶" },
  { name: "Wikipedia", host: "wikipedia.org", bg: "linear-gradient(135deg,#f5f5f5,#d2d2d2)", glyph: "W" },
  { name: "Figma", host: "figma.com", bg: "linear-gradient(135deg,#ff7262,#a259ff)", glyph: "◉" },
  { name: "Reddit", host: "reddit.com", bg: "linear-gradient(135deg,#ff8a4c,#ff4500)", glyph: "👾" },
  { name: "Dribbble", host: "dribbble.com", bg: "linear-gradient(135deg,#ff7cb0,#ea4c89)", glyph: "🏀" },
  { name: "Maps", host: "maps.apple.com", bg: "linear-gradient(135deg,#9ee6a6,#2d9c5a)", glyph: "📍" },
];

const READING = [
  {
    title: "Apple unveils the new MacBook Pro with M4 Pro",
    source: "apple.com/newsroom",
    excerpt: "The most advanced laptop silicon ever — now with a 20-core GPU and all-day battery life.",
    tint: "#1d1f22",
  },
  {
    title: "The web is the new operating system",
    source: "theverge.com",
    excerpt: "Full desktop environments now run entirely client-side. We tried one that boots in under two seconds.",
    tint: "#5b2a86",
  },
  {
    title: "Designing with blur: the story of Aqua",
    source: "designsystems.io",
    excerpt: "From pinstripes to translucency, a visual history of the Mac interface across 24 years.",
    tint: "#1176f0",
  },
];

export default function Safari() {
  const { dark, accent } = useOS();
  const [url, setUrl] = useState("");
  const [page, setPage] = useState<"start" | "site">("start");
  const [host, setHost] = useState("");
  const [tabs, setTabs] = useState([{ id: 1, title: "Start Page" }]);
  const [activeTab, setActiveTab] = useState(1);

  const visit = (h: string) => {
    setHost(h);
    setUrl(h);
    setPage("site");
    setTabs((t) => t.map((tb) => (tb.id === activeTab ? { ...tb, title: h } : tb)));
  };

  const surface = dark ? "bg-[#1f2126] text-zinc-200" : "bg-white text-zinc-800";

  return (
    <div className={cn("flex h-full flex-col", surface)}>
      {/* toolbar */}
      <div
        className={cn(
          "flex h-[46px] shrink-0 items-center gap-2 border-b px-3",
          dark ? "border-black/40 bg-[#2a2c32]" : "border-black/10 bg-[#f3f3f5]",
        )}
      >
        <button
          onClick={() => setPage("start")}
          className="rounded p-1 opacity-60 hover:bg-black/10"
          title="Back"
        >
          <Chevron dir="left" className="h-4 w-4" />
        </button>
        <button className="rounded p-1 opacity-25">
          <Chevron dir="right" className="h-4 w-4" />
        </button>
        <div
          className={cn(
            "mx-2 flex h-[28px] flex-1 items-center gap-2 rounded-lg px-3 text-[12.5px]",
            dark ? "bg-white/10" : "bg-black/[0.07]",
          )}
        >
          <span className="opacity-50">🔒</span>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && url.trim()) visit(url.replace(/^https?:\/\//, "").trim());
            }}
            placeholder="Search or enter website name"
            className="flex-1 bg-transparent text-center outline-none placeholder:opacity-50 focus:text-left"
          />
          <button onClick={() => setPage("start")} className="opacity-50 hover:opacity-90">
            ⟳
          </button>
        </div>
        <button
          onClick={() => {
            const id = Date.now();
            setTabs((t) => [...t, { id, title: "Start Page" }]);
            setActiveTab(id);
            setPage("start");
            setUrl("");
          }}
          className="rounded px-2 pb-[3px] text-lg leading-none opacity-60 hover:bg-black/10"
        >
          +
        </button>
      </div>

      {/* tab bar */}
      {tabs.length > 1 && (
        <div className={cn("flex h-8 shrink-0 gap-1 px-2 pt-1", dark ? "bg-[#2a2c32]" : "bg-[#eaeaec]")}>
          {tabs.map((t) => (
            <div
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "flex w-44 cursor-default items-center gap-2 rounded-t-md px-3 text-[12px]",
                activeTab === t.id ? (dark ? "bg-[#1f2126]" : "bg-white") : "opacity-60 hover:bg-black/5",
              )}
            >
              <span className="truncate">{t.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTabs((ts) => (ts.length > 1 ? ts.filter((x) => x.id !== t.id) : ts));
                }}
                className="ml-auto opacity-50 hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mac-scroll flex-1 overflow-y-auto">
        {page === "start" ? (
          <div className="mx-auto max-w-3xl px-8 py-10">
            <h2 className="mb-4 text-[15px] font-semibold opacity-70">Favorites</h2>
            <div className="grid grid-cols-4 gap-5 sm:grid-cols-4">
              {FAVORITES.map((f) => (
                <button key={f.host} onClick={() => visit(f.host)} className="group flex flex-col items-center gap-2">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl text-white shadow-md transition group-hover:scale-105"
                    style={{ background: f.bg }}
                  >
                    {f.glyph}
                  </div>
                  <span className="text-[12px] opacity-70">{f.name}</span>
                </button>
              ))}
            </div>

            <h2 className="mb-3 mt-10 text-[15px] font-semibold opacity-70">Reading List</h2>
            <div className="space-y-3">
              {READING.map((r) => (
                <button
                  key={r.title}
                  onClick={() => visit(r.source)}
                  className={cn(
                    "flex w-full gap-4 rounded-xl p-3 text-left transition hover:scale-[1.005]",
                    dark ? "bg-white/5 hover:bg-white/10" : "bg-black/[0.035] hover:bg-black/[0.06]",
                  )}
                >
                  <div className="h-16 w-24 shrink-0 rounded-lg" style={{ background: `linear-gradient(135deg, ${r.tint}, #00000055)` }} />
                  <div className="min-w-0">
                    <div className="truncate text-[13.5px] font-semibold">{r.title}</div>
                    <div className="text-[11.5px] opacity-50">{r.source}</div>
                    <div className="mt-1 line-clamp-2 text-[12px] opacity-70">{r.excerpt}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-10 text-center text-[12px] opacity-40">
              Privacy Report · Safari prevented 23 trackers from profiling you
            </div>
          </div>
        ) : (
          <div className="px-10 py-10">
            <div className="mx-auto max-w-2xl">
              <div
                className="mb-6 flex h-40 items-center justify-center rounded-2xl text-5xl text-white"
                style={{ background: `linear-gradient(135deg, ${accent}, #00000066)` }}
              >
                {host.split(".")[0].slice(0, 1).toUpperCase()}
              </div>
              <h1 className="text-2xl font-bold">{host}</h1>
              <p className="mt-2 text-[13.5px] leading-relaxed opacity-70">
                This is a sandboxed preview of <b>{host}</b>. The macOS Web browser renders a local
                mock of the page because live external sites can't be framed inside this offline
                desktop environment.
              </p>
              <div className={cn("mt-6 space-y-3 rounded-xl p-5", dark ? "bg-white/5" : "bg-black/[0.035]")}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 w-1/3 rounded bg-current opacity-20" />
                    <div className="h-2 w-full rounded bg-current opacity-10" />
                    <div className="h-2 w-5/6 rounded bg-current opacity-10" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
