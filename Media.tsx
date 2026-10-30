import { useEffect, useMemo, useState } from "react";
import { useOS } from "@/os/store";
import { cn } from "@/utils/cn";

/* ----------------------------- MUSIC ----------------------------- */
const TRACKS = [
  { title: "Midnight Commute", artist: "Neon District", album: "Afterglow", len: 214, art: "linear-gradient(135deg,#ff6a5a,#8e2de2)" },
  { title: "Retina Dreams", artist: "Studio Aqua", album: "Pixel Perfect", len: 186, art: "linear-gradient(135deg,#43c6ac,#191654)" },
  { title: "Cupertino Sunrise", artist: "M. Silicon", album: "Unified", len: 243, art: "linear-gradient(135deg,#ffd86f,#fc6262)" },
  { title: "Liquid Glass", artist: "Aurora Shift", album: "Translucent", len: 198, art: "linear-gradient(135deg,#6a11cb,#2575fc)" },
  { title: "Terminal Velocity", artist: "Zsh Collective", album: "Shell", len: 227, art: "linear-gradient(135deg,#0f2027,#2c5364)" },
  { title: "Spotlight", artist: "Command Space", album: "Shortcut", len: 171, art: "linear-gradient(135deg,#f7971e,#ffd200)" },
];

const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function Music() {
  const { dark, volume, setVolume, accent } = useOS();
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const track = TRACKS[idx];

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setPos((p) => {
        if (p + 1 >= track.len) {
          setIdx((i) => (i + 1) % TRACKS.length);
          return 0;
        }
        return p + 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [playing, track.len]);

  const select = (i: number) => {
    setIdx(i);
    setPos(0);
    setPlaying(true);
  };

  return (
    <div className={cn("flex h-full", dark ? "bg-[#1b1c20] text-zinc-200" : "bg-white text-zinc-800")}>
      <div className={cn("w-[190px] shrink-0 border-r p-3 text-[13px]", dark ? "border-black/40 bg-[#232429]" : "border-black/10 bg-[#f4f4f6]")}>
        <div className="pb-1 text-[11px] font-semibold uppercase opacity-50">Apple Music</div>
        {["Listen Now", "Browse", "Radio"].map((x, i) => (
          <button key={x} className={cn("flex w-full items-center gap-2 rounded-md px-2 py-[5px]", i === 0 ? "text-white" : "hover:bg-black/5")} style={i === 0 ? { background: accent } : undefined}>
            <span>{["▶", "🧭", "📻"][i]}</span> {x}
          </button>
        ))}
        <div className="mt-4 pb-1 text-[11px] font-semibold uppercase opacity-50">Library</div>
        {["Recently Added", "Artists", "Albums", "Songs"].map((x) => (
          <button key={x} className="flex w-full items-center gap-2 rounded-md px-2 py-[5px] hover:bg-black/5">
            <span className="opacity-60">♪</span> {x}
          </button>
        ))}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* now playing bar */}
        <div className={cn("flex h-[66px] shrink-0 items-center gap-4 border-b px-4", dark ? "border-black/40 bg-[#26272c]" : "border-black/10 bg-[#fafafb]")}>
          <div className="flex items-center gap-2">
            <button onClick={() => select((idx - 1 + TRACKS.length) % TRACKS.length)} className="text-lg opacity-70 hover:opacity-100">⏮</button>
            <button
              onClick={() => setPlaying((p) => !p)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white shadow"
              style={{ background: accent }}
            >
              {playing ? "❚❚" : "▶"}
            </button>
            <button onClick={() => select((idx + 1) % TRACKS.length)} className="text-lg opacity-70 hover:opacity-100">⏭</button>
          </div>
          <div className={cn("flex flex-1 items-center gap-3 rounded-lg px-3 py-[6px]", dark ? "bg-white/5" : "bg-black/[0.05]")}>
            <div className="h-9 w-9 shrink-0 rounded" style={{ background: track.art }} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-center text-[12.5px] font-semibold">{track.title}</div>
              <div className="truncate text-center text-[11px] opacity-60">{track.artist} — {track.album}</div>
              <div className="mt-1 flex items-center gap-2 text-[10px] opacity-60">
                <span>{fmtTime(pos)}</span>
                <div className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-current/20">
                  <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(pos / track.len) * 100}%`, background: accent }} />
                </div>
                <span>-{fmtTime(track.len - pos)}</span>
              </div>
            </div>
          </div>
          <div className="flex w-28 items-center gap-2 text-[11px] opacity-70">
            🔈
            <input type="range" min={0} max={100} value={volume} onChange={(e) => setVolume(+e.target.value)} className="w-full accent-current" />
          </div>
        </div>

        <div className="mac-scroll flex-1 overflow-y-auto p-5">
          <h2 className="mb-3 text-[19px] font-bold">Listen Now</h2>
          <div className="mb-6 grid grid-cols-3 gap-4">
            {TRACKS.slice(0, 3).map((t, i) => (
              <button key={t.title} onClick={() => select(i)} className="group text-left">
                <div className="aspect-square w-full rounded-xl shadow-md transition group-hover:scale-[1.02]" style={{ background: t.art }} />
                <div className="mt-2 truncate text-[13px] font-semibold">{t.album}</div>
                <div className="truncate text-[12px] opacity-60">{t.artist}</div>
              </button>
            ))}
          </div>
          <h3 className="mb-2 text-[15px] font-semibold">Songs</h3>
          <div className="overflow-hidden rounded-lg">
            {TRACKS.map((t, i) => (
              <button
                key={t.title}
                onClick={() => select(i)}
                className={cn(
                  "flex w-full items-center gap-3 px-3 py-2 text-left text-[13px]",
                  i === idx ? "text-white" : i % 2 ? (dark ? "bg-white/[0.03]" : "bg-black/[0.02]") : "",
                )}
                style={i === idx ? { background: accent } : undefined}
              >
                <span className="w-4 text-[11px] opacity-60">{i === idx && playing ? "♪" : i + 1}</span>
                <span className="h-7 w-7 shrink-0 rounded" style={{ background: t.art }} />
                <span className="flex-1 truncate font-medium">{t.title}</span>
                <span className="w-40 truncate opacity-60">{t.artist}</span>
                <span className="opacity-60">{fmtTime(t.len)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- PHOTOS ----------------------------- */
const GRADS = [
  "linear-gradient(160deg,#ff9966,#ff5e62)",
  "linear-gradient(160deg,#36d1dc,#5b86e5)",
  "linear-gradient(160deg,#f7971e,#ffd200)",
  "linear-gradient(160deg,#11998e,#38ef7d)",
  "linear-gradient(160deg,#8e2de2,#4a00e0)",
  "linear-gradient(160deg,#f953c6,#b91d73)",
  "linear-gradient(160deg,#0f2027,#2c5364)",
  "linear-gradient(160deg,#ffafbd,#ffc3a0)",
  "linear-gradient(160deg,#2193b0,#6dd5ed)",
  "linear-gradient(160deg,#cc2b5e,#753a88)",
  "linear-gradient(160deg,#ddd6f3,#faaca8)",
  "linear-gradient(160deg,#42275a,#734b6d)",
];
const TITLES = ["Sunset Ridge", "Harbor Fog", "Golden Hour", "Pine Trail", "Night Market", "Bloom", "Deep Blue", "Soft Dunes", "Lagoon", "Berry Sky", "Pastel Drift", "Velvet Hills"];

export function Photos() {
  const { dark, accent } = useOS();
  const [sel, setSel] = useState<number | null>(null);
  const [tab, setTab] = useState("Library");
  const photos = useMemo(
    () => GRADS.map((g, i) => ({ g, title: TITLES[i], date: `Mar ${2 + i}, 2026` })),
    [],
  );

  return (
    <div className={cn("flex h-full", dark ? "bg-[#1b1c20] text-zinc-200" : "bg-white text-zinc-800")}>
      <div className={cn("w-[180px] shrink-0 border-r p-3 text-[13px]", dark ? "border-black/40 bg-[#232429]" : "border-black/10 bg-[#f4f4f6]")}>
        <div className="pb-1 text-[11px] font-semibold uppercase opacity-50">Photos</div>
        {["Library", "Memories", "People", "Places", "Favourites", "Recents"].map((x) => (
          <button
            key={x}
            onClick={() => setTab(x)}
            className={cn("flex w-full items-center gap-2 rounded-md px-2 py-[5px]", tab === x ? "text-white" : "hover:bg-black/5")}
            style={tab === x ? { background: accent } : undefined}
          >
            <span>🖼</span> {x}
          </button>
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className={cn("flex h-11 shrink-0 items-center justify-between border-b px-4", dark ? "border-black/40" : "border-black/10")}>
          <div className="text-[14px] font-semibold">{tab}</div>
          <div className="text-[12px] opacity-50">{photos.length} photos · 0 videos</div>
        </div>
        <div className="mac-scroll grid flex-1 auto-rows-min grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-[6px] overflow-y-auto p-4">
          {photos.map((p, i) => (
            <button
              key={i}
              onClick={() => setSel(i)}
              className="group relative aspect-square overflow-hidden rounded-md"
              style={{ background: p.g }}
            >
              <span className="absolute inset-x-0 bottom-0 translate-y-full bg-black/40 p-1 text-[10px] text-white transition group-hover:translate-y-0">
                {p.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {sel !== null && (
        <div className="anim-fade-in absolute inset-0 z-30 flex flex-col bg-black/90 backdrop-blur-xl" onClick={() => setSel(null)}>
          <div className="flex h-11 items-center justify-between px-4 text-[13px] text-white/80">
            <button onClick={() => setSel(null)}>‹ Library</button>
            <span>{photos[sel].title} — {photos[sel].date}</span>
            <span className="opacity-60">♡ ⓘ ⤴</span>
          </div>
          <div className="flex flex-1 items-center justify-center p-8">
            <div className="h-full w-full max-w-3xl rounded-xl shadow-2xl" style={{ background: photos[sel].g }} />
          </div>
          <div className="flex justify-center gap-1 p-3">
            {photos.map((p, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setSel(i);
                }}
                className={cn("h-9 w-9 rounded", i === sel && "ring-2 ring-white")}
                style={{ background: p.g }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
