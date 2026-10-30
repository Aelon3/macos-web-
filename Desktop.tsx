import { useEffect, useState } from "react";
import { useClock, useOS, WALLPAPERS } from "@/os/store";
import { cn } from "@/utils/cn";

const DESKTOP_ICONS = [
  { id: "hd", label: "Macintosh HD", app: "finder", glyph: "💽" },
  { id: "docs", label: "Documents", app: "finder", glyph: "📁" },
  { id: "dmg", label: "macos-web.dmg", app: "about", glyph: "📀" },
];

export function Wallpaper() {
  const { wallpaper, brightness } = useOS();
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: wallpaper.background }}>
      <div className="anim-blob absolute -left-[12%] top-[8%] h-[46vh] w-[46vh] rounded-full bg-white/10 blur-3xl" />
      <div className="anim-blob absolute right-[6%] top-[22%] h-[36vh] w-[36vh] rounded-full bg-white/10 blur-3xl" style={{ animationDelay: "-7s" }} />
      <div className="anim-blob absolute bottom-[4%] left-[32%] h-[40vh] w-[60vh] rounded-full bg-black/10 blur-3xl" style={{ animationDelay: "-14s" }} />
      <div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: (100 - brightness) / 160 }} />
    </div>
  );
}

function Widgets() {
  const now = useClock();
  const os = useOS();
  const sec = now.getSeconds();
  const min = now.getMinutes();
  const hr = now.getHours() % 12;
  return (
    <div className="pointer-events-auto absolute left-6 top-10 hidden w-[160px] flex-col gap-4 lg:flex">
      <div className="rounded-3xl bg-white/20 p-4 shadow-xl backdrop-blur-2xl">
        <div className="relative mx-auto aspect-square w-full rounded-full bg-white/80 shadow-inner">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 h-[42%] w-[2px] origin-bottom"
              style={{ transform: `translate(-50%,-100%) rotate(${i * 30}deg)` }}
            >
              <span className="block h-[8%] w-full rounded bg-zinc-700/70" />
            </span>
          ))}
          <span className="absolute left-1/2 top-1/2 h-[28%] w-[3.5px] origin-bottom rounded bg-zinc-900" style={{ transform: `translate(-50%,-100%) rotate(${hr * 30 + min * 0.5}deg)` }} />
          <span className="absolute left-1/2 top-1/2 h-[38%] w-[2.5px] origin-bottom rounded bg-zinc-800" style={{ transform: `translate(-50%,-100%) rotate(${min * 6}deg)` }} />
          <span className="absolute left-1/2 top-1/2 h-[40%] w-[1.5px] origin-bottom rounded bg-orange-500" style={{ transform: `translate(-50%,-100%) rotate(${sec * 6}deg)` }} />
          <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-900" />
        </div>
      </div>
      <button
        onClick={() => os.openApp("weather")}
        className="rounded-3xl bg-gradient-to-b from-sky-400/80 to-blue-600/80 p-4 text-left text-white shadow-xl backdrop-blur-2xl transition hover:brightness-110"
      >
        <div className="text-[12px] opacity-90">Cupertino</div>
        <div className="text-[34px] font-thin leading-none">22°</div>
        <div className="mt-1 text-[11px] opacity-90">Mostly Sunny</div>
        <div className="text-[11px] opacity-75">H:24° L:14°</div>
      </button>
      <button
        onClick={() => os.openApp("calendar")}
        className="rounded-3xl bg-white/75 p-4 text-left shadow-xl backdrop-blur-2xl transition hover:bg-white/85"
      >
        <div className="text-[11px] font-bold uppercase tracking-wide text-red-500">
          {now.toLocaleDateString([], { weekday: "long" })}
        </div>
        <div className="text-[30px] font-light leading-none text-zinc-900">{now.getDate()}</div>
        <div className="mt-2 border-l-2 border-blue-500 pl-2 text-[11px] leading-tight text-zinc-700">
          Design Review
          <span className="block opacity-60">3:00 PM</span>
        </div>
      </button>
    </div>
  );
}

export default function Desktop() {
  const os = useOS();
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [sub, setSub] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const close = () => {
      setMenu(null);
      setSub(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <div
      className="absolute inset-0"
      onContextMenu={(e) => {
        e.preventDefault();
        setMenu({ x: Math.min(e.clientX, window.innerWidth - 230), y: Math.min(e.clientY, window.innerHeight - 320) });
      }}
      onClick={() => setSelected(null)}
    >
      <Widgets />

      {/* desktop icons */}
      <div className="absolute right-4 top-9 flex flex-col gap-1">
        {DESKTOP_ICONS.map((d) => (
          <button
            key={d.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelected(d.id);
            }}
            onDoubleClick={() => os.openApp(d.app)}
            className={cn(
              "flex w-[92px] flex-col items-center gap-1 rounded-lg p-2 text-center",
              selected === d.id && "bg-white/25 ring-1 ring-white/40",
            )}
          >
            <span className="text-[34px] leading-none drop-shadow-lg">{d.glyph}</span>
            <span
              className={cn(
                "rounded px-1 text-[11.5px] leading-tight text-white text-shadow-sm",
                selected === d.id && "bg-black/35",
              )}
            >
              {d.label}
            </span>
          </button>
        ))}
      </div>

      {menu && (
        <div
          className="anim-menu-in fixed z-[8700] w-[220px] rounded-lg border border-white/20 bg-white/80 p-1 text-[13px] text-zinc-900 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-800/90 dark:text-zinc-100"
          style={{ left: menu.x, top: menu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {[
            ["New Folder", () => os.openApp("finder")],
            ["Get Info", () => os.openApp("about")],
            ["-", null],
            ["Change Wallpaper…", () => os.openApp("settings")],
            ["Edit Widgets…", () => os.openApp("settings")],
            ["-", null],
            ["Use Stacks", null],
            ["Show View Options", null],
          ].map(([label, fn], i) =>
            label === "-" ? (
              <div key={i} className="my-1 h-px bg-black/10" />
            ) : (
              <button
                key={i}
                onClick={() => {
                  (fn as (() => void) | null)?.();
                  setMenu(null);
                }}
                className="block w-full rounded px-3 py-[4px] text-left hover:bg-blue-500 hover:text-white"
              >
                {label as string}
              </button>
            ),
          )}
          <div className="my-1 h-px bg-black/10" />
          <div
            className="relative"
            onMouseEnter={() => setSub(true)}
            onMouseLeave={() => setSub(false)}
          >
            <button className="flex w-full items-center justify-between rounded px-3 py-[4px] text-left hover:bg-blue-500 hover:text-white">
              Desktop Picture <span className="opacity-50">›</span>
            </button>
            {sub && (
              <div className="absolute left-full top-0 w-[180px] rounded-lg border border-white/20 bg-white/85 p-1 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-800/90">
                {WALLPAPERS.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => {
                      os.setWallpaperId(w.id);
                      setMenu(null);
                    }}
                    className="flex w-full items-center gap-2 rounded px-2 py-[4px] text-left hover:bg-blue-500 hover:text-white"
                  >
                    <span className="h-4 w-6 shrink-0 rounded-sm" style={{ background: w.background }} />
                    <span className="truncate">{w.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
