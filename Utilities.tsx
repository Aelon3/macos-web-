import { useState } from "react";
import { useOS } from "@/os/store";
import { cn } from "@/utils/cn";
import { AppIcon, AppleLogo } from "@/os/icons";

/* ----------------------------- WEATHER ----------------------------- */
const CITIES = [
  { city: "Cupertino", temp: 22, cond: "Mostly Sunny", hi: 24, lo: 14, sky: "linear-gradient(180deg,#4aa8ff,#1264d6)" },
  { city: "London", temp: 12, cond: "Light Rain", hi: 14, lo: 8, sky: "linear-gradient(180deg,#6b7a90,#2e3a4d)" },
  { city: "Tokyo", temp: 18, cond: "Cloudy", hi: 19, lo: 12, sky: "linear-gradient(180deg,#8ba3bd,#3f5872)" },
  { city: "Dubai", temp: 34, cond: "Clear", hi: 37, lo: 26, sky: "linear-gradient(180deg,#ffb347,#e2641f)" },
];

export function Weather() {
  const [i, setI] = useState(0);
  const c = CITIES[i];
  const hours = Array.from({ length: 8 }, (_, h) => ({
    h: `${((new Date().getHours() + h) % 24).toString().padStart(2, "0")}:00`,
    t: Math.round(c.temp + Math.sin(h / 1.6) * 3),
    icon: ["☀️", "🌤", "⛅️", "🌥", "🌙", "☁️", "🌧", "⛅️"][h % 8],
  }));
  return (
    <div className="flex h-full flex-col text-white" style={{ background: c.sky }}>
      <div className="pt-8 text-center">
        <div className="text-[22px] font-medium">{c.city}</div>
        <div className="text-[76px] font-thin leading-none">{c.temp}°</div>
        <div className="text-[15px] opacity-90">{c.cond}</div>
        <div className="text-[13px] opacity-75">H:{c.hi}° L:{c.lo}°</div>
      </div>
      <div className="mx-4 mt-6 rounded-2xl bg-white/15 p-3 backdrop-blur-md">
        <div className="mb-2 border-b border-white/20 pb-1 text-[11px] uppercase opacity-80">Hourly Forecast</div>
        <div className="no-scroll flex gap-4 overflow-x-auto">
          {hours.map((h) => (
            <div key={h.h} className="flex min-w-[42px] flex-col items-center gap-1 text-[12px]">
              <span className="opacity-80">{h.h}</span>
              <span className="text-lg">{h.icon}</span>
              <span className="font-semibold">{h.t}°</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-4 mt-3 flex-1 overflow-hidden rounded-2xl bg-white/15 p-3 backdrop-blur-md">
        <div className="mb-1 border-b border-white/20 pb-1 text-[11px] uppercase opacity-80">Other Cities</div>
        {CITIES.map((x, idx) => (
          <button key={x.city} onClick={() => setI(idx)} className="flex w-full items-center justify-between py-[7px] text-[13px] hover:opacity-80">
            <span>{x.city}</span>
            <span className="opacity-80">{x.cond}</span>
            <span className="font-semibold">{x.temp}°</span>
          </button>
        ))}
      </div>
      <div className="p-3 text-center text-[11px] opacity-70">Weather for macOS Web · simulated data</div>
    </div>
  );
}

/* ----------------------------- MAPS ----------------------------- */
export function Maps() {
  const { dark, accent } = useOS();
  const [q, setQ] = useState("Apple Park, Cupertino");
  const [zoom, setZoom] = useState(1);
  return (
    <div className={cn("relative h-full overflow-hidden", dark ? "bg-[#1b2a22]" : "bg-[#e7f1e4]")}>
      <svg viewBox="0 0 800 600" className="h-full w-full" style={{ transform: `scale(${zoom})`, transition: "transform .3s" }}>
        <rect width="800" height="600" fill={dark ? "#20302a" : "#e4f0e2"} />
        <path d="M0 420h800v40H0z" fill={dark ? "#1a2a3d" : "#bcdcf2"} />
        <circle cx="620" cy="160" r="120" fill={dark ? "#24392e" : "#cfe8c9"} />
        {[80, 200, 320, 500, 660].map((y) => (
          <rect key={y} x="0" y={y} width="800" height="14" fill={dark ? "#33383d" : "#ffffff"} />
        ))}
        {[90, 240, 420, 560, 710].map((x) => (
          <rect key={x} x={x} y="0" width="14" height="600" fill={dark ? "#33383d" : "#ffffff"} />
        ))}
        <path d="M0 540 Q 250 480 420 520 T 800 470" stroke="#f6c343" strokeWidth="10" fill="none" />
        <circle cx="430" cy="300" r="70" fill="none" stroke={dark ? "#4d7c63" : "#9ccf93"} strokeWidth="26" />
        <text x="430" y="305" textAnchor="middle" fontSize="15" fill={dark ? "#cfe8c9" : "#3c5c36"} fontFamily="Inter">
          Apple Park
        </text>
        <g>
          <circle cx="430" cy="300" r="9" fill={accent} stroke="#fff" strokeWidth="3" />
          <circle cx="430" cy="300" r="22" fill={accent} opacity="0.22" />
        </g>
      </svg>

      <div className="absolute left-3 top-3 w-[260px] rounded-xl bg-white/85 p-2 shadow-lg backdrop-blur-xl dark:bg-black/60">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full rounded-lg bg-black/[0.06] px-3 py-[6px] text-[13px] text-zinc-800 outline-none"
          placeholder="Search Maps"
        />
        <div className="mt-2 space-y-1 text-[12.5px] text-zinc-700">
          {["Apple Park — 1 Apple Park Way", "Infinite Loop — Cupertino", "Stanford University", "Golden Gate Bridge"].map((s) => (
            <button key={s} onClick={() => setQ(s)} className="block w-full truncate rounded px-2 py-1 text-left hover:bg-black/5">
              📍 {s}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 right-4 flex flex-col overflow-hidden rounded-lg bg-white/90 text-lg shadow-lg">
        <button onClick={() => setZoom((z) => Math.min(2.4, z + 0.2))} className="px-3 py-1 hover:bg-black/5">＋</button>
        <button onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))} className="border-t px-3 py-1 hover:bg-black/5">－</button>
      </div>
      <div className="absolute bottom-4 left-4 rounded-lg bg-white/85 px-3 py-2 text-[12px] text-zinc-700 shadow-lg">
        <b>{q}</b>
        <div className="opacity-60">Directions · 12 min drive · 4.6 mi</div>
      </div>
    </div>
  );
}

/* ----------------------------- APP STORE ----------------------------- */
const STORE_APPS = [
  { id: "code", name: "Xcode Lite", sub: "Developer Tools", price: "Get" },
  { id: "music", name: "Logic Groove", sub: "Music Production", price: "$4.99" },
  { id: "photos", name: "Pixelmator X", sub: "Photo Editing", price: "Get" },
  { id: "games", name: "Tile Rush 2048", sub: "Puzzle Game", price: "Get" },
  { id: "notes", name: "Journal Pro", sub: "Productivity", price: "$1.99" },
  { id: "weather", name: "Storm Radar", sub: "Weather", price: "Get" },
];

export function AppStore() {
  const { dark, openApp, accent, pushNotification } = useOS();
  const [installing, setInstalling] = useState<string | null>(null);
  const [installed, setInstalled] = useState<string[]>([]);

  const install = (a: (typeof STORE_APPS)[number]) => {
    if (installed.includes(a.id)) return openApp(a.id);
    setInstalling(a.id);
    setTimeout(() => {
      setInstalling(null);
      setInstalled((x) => [...x, a.id]);
      pushNotification({ app: "App Store", title: `${a.name} installed`, body: "Tap to open from Launchpad." });
    }, 1600);
  };

  return (
    <div className={cn("flex h-full", dark ? "bg-[#1b1c20] text-zinc-200" : "bg-white text-zinc-800")}>
      <div className={cn("w-[180px] shrink-0 border-r p-3 text-[13px]", dark ? "border-black/40 bg-[#232429]" : "border-black/10 bg-[#f4f4f6]")}>
        {["Discover", "Arcade", "Create", "Work", "Play", "Develop", "Categories", "Updates"].map((x, i) => (
          <button key={x} className={cn("flex w-full items-center gap-2 rounded-md px-2 py-[5px]", i === 0 ? "text-white" : "hover:bg-black/5")} style={i === 0 ? { background: accent } : undefined}>
            <span>{["✨", "🕹", "🎨", "💼", "🎮", "⌨️", "🗂", "⬆️"][i]}</span> {x}
          </button>
        ))}
      </div>
      <div className="mac-scroll flex-1 overflow-y-auto p-6">
        <div className="mb-6 overflow-hidden rounded-2xl p-6 text-white" style={{ background: "linear-gradient(120deg,#6a11cb,#2575fc)" }}>
          <div className="text-[11px] uppercase tracking-widest opacity-80">Featured</div>
          <div className="mt-1 text-[26px] font-bold leading-tight">macOS Web Essentials</div>
          <p className="mt-1 max-w-md text-[13px] opacity-90">
            Everything you need to be productive in the browser — free, forever, no install required.
          </p>
          <button onClick={() => openApp("launchpad")} className="mt-4 rounded-full bg-white/90 px-4 py-[6px] text-[13px] font-semibold text-zinc-900">
            Open Launchpad
          </button>
        </div>
        <h2 className="mb-3 text-[17px] font-bold">Top Free Apps</h2>
        <div className="grid grid-cols-2 gap-3">
          {STORE_APPS.map((a) => (
            <div key={a.id} className={cn("flex items-center gap-3 rounded-xl p-3", dark ? "bg-white/5" : "bg-black/[0.035]")}>
              <AppIcon id={a.id} className="h-14 w-14 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13.5px] font-semibold">{a.name}</div>
                <div className="truncate text-[12px] opacity-60">{a.sub}</div>
                <div className="text-[11px] opacity-50">★★★★☆ 4.8 · 12.4K ratings</div>
              </div>
              <button
                onClick={() => install(a)}
                className="rounded-full px-4 py-1 text-[12px] font-bold text-white"
                style={{ background: accent }}
              >
                {installing === a.id ? "···" : installed.includes(a.id) ? "Open" : a.price}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- PREVIEW ----------------------------- */
export function Preview({ file }: { file?: string }) {
  const { dark } = useOS();
  return (
    <div className={cn("flex h-full flex-col items-center justify-center gap-4 p-8", dark ? "bg-[#1b1c20] text-zinc-300" : "bg-[#f2f3f5] text-zinc-700")}>
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
        <div className="mb-4 h-3 w-1/3 rounded bg-zinc-800/80" />
        <div className="space-y-2">
          {[100, 92, 96, 70, 88, 60].map((w, i) => (
            <div key={i} className="h-2 rounded bg-zinc-300" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="mt-6 h-24 rounded-lg bg-gradient-to-br from-sky-200 to-indigo-300" />
      </div>
      <div className="text-[12.5px] opacity-60">{file ?? "Document.pdf"} — Page 1 of 3 · 100%</div>
    </div>
  );
}

/* ----------------------------- ABOUT THIS MAC ----------------------------- */
export function About() {
  const { dark, openApp } = useOS();
  return (
    <div className={cn("flex h-full", dark ? "bg-[#232429] text-zinc-200" : "bg-[#f3f3f5] text-zinc-800")}>
      <div className="flex w-[240px] flex-col items-center justify-center gap-3 p-6">
        <div className={cn("relative flex h-28 w-40 items-end justify-center")}>
          <div className={cn("h-[72px] w-[116px] rounded-md border-[3px]", dark ? "border-zinc-400 bg-zinc-800" : "border-zinc-500 bg-zinc-200")}>
            <div className="flex h-full w-full items-center justify-center">
              <AppleLogo className={cn("h-6 w-6", dark ? "text-zinc-300" : "text-zinc-500")} />
            </div>
          </div>
          <div className={cn("absolute bottom-[6px] h-[6px] w-[150px] rounded-b-lg", dark ? "bg-zinc-500" : "bg-zinc-400")} />
        </div>
        <div className="text-center">
          <div className="text-[17px] font-semibold">MacBook Pro</div>
          <div className="text-[12px] opacity-60">16-inch, 2026</div>
        </div>
      </div>
      <div className="flex-1 space-y-[6px] py-8 pr-8 text-[12.5px]">
        <div className="mb-3 text-[15px] font-semibold">macOS Web · Version 15.4</div>
        {[
          ["Chip", "Apple M3 Pro (12-core CPU, 18-core GPU)"],
          ["Memory", "18 GB unified"],
          ["Startup disk", "Macintosh HD"],
          ["Display", `${window.innerWidth} × ${window.innerHeight} Liquid Retina XDR`],
          ["Serial number", "C02WEB2026MAC"],
          ["Renderer", navigator.userAgent.includes("Chrome") ? "Blink / WebGL" : "Browser Engine"],
        ].map(([k, v]) => (
          <div key={k} className="flex gap-3">
            <div className="w-32 shrink-0 text-right font-semibold opacity-70">{k}</div>
            <div className="opacity-80">{v}</div>
          </div>
        ))}
        <div className="flex gap-2 pt-5">
          <button onClick={() => openApp("settings")} className="rounded-md bg-white px-3 py-[5px] text-[12px] shadow ring-1 ring-black/10 dark:bg-white/10">
            System Settings…
          </button>
          <button onClick={() => openApp("terminal")} className="rounded-md bg-white px-3 py-[5px] text-[12px] shadow ring-1 ring-black/10 dark:bg-white/10">
            System Report…
          </button>
        </div>
        <div className="pt-4 text-[10.5px] opacity-40">
          ™ and © 2026 macOS Web. A love letter to the Mac, built with React. Not affiliated with Apple Inc.
        </div>
      </div>
    </div>
  );
}
