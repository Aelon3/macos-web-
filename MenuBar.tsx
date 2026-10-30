import { useEffect, useRef, useState } from "react";
import { useClock, useOS } from "@/os/store";
import { getApp } from "@/os/registry";
import { AppleLogo, BatteryGlyph, ControlCenterGlyph, SearchGlyph, WifiGlyph } from "@/os/icons";
import { cn } from "@/utils/cn";

const APPLE_MENU = [
  ["About This Mac", "about"],
  ["-", ""],
  ["System Settings…", "settings"],
  ["App Store…", "appstore"],
  ["-", ""],
  ["Recent Items", ""],
  ["Force Quit…", "forcequit"],
  ["-", ""],
  ["Sleep", "sleep"],
  ["Restart…", "restart"],
  ["Shut Down…", "shutdown"],
  ["-", ""],
  ["Lock Screen", "lock"],
  ["Log Out…", "logout"],
] as const;

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "anim-menu-in absolute top-[26px] z-[9999] rounded-xl border border-white/20 bg-white/80 p-1 text-[13px] text-zinc-900 shadow-2xl backdrop-blur-2xl",
        "dark:border-white/10 dark:bg-zinc-800/85 dark:text-zinc-100",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default function MenuBar() {
  const os = useOS();
  const now = useClock();
  const [open, setOpen] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const activeWin = os.windows.find((w) => w.id === os.activeId && !w.minimized);
  const activeApp = activeWin ? getApp(activeWin.appId) : null;
  const appName = activeApp?.name ?? "Finder";
  const menus = activeApp?.menus ?? ["File", "Edit", "View", "Go", "Window", "Help"];

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const appleAction = (id: string) => {
    setOpen(null);
    if (!id) return;
    if (["about", "settings", "appstore"].includes(id)) os.openApp(id);
    else if (id === "sleep") os.setPhase("sleep");
    else if (id === "restart") os.setPhase("restart");
    else if (id === "shutdown") os.setPhase("shutdown");
    else if (id === "lock") os.setPhase("lock");
    else if (id === "logout") os.setPhase("login");
    else if (id === "forcequit" && os.activeId) os.closeWindow(os.activeId);
  };

  const unread = os.notifications.length;

  return (
    <div
      ref={barRef}
      className="fixed inset-x-0 top-0 z-[9000] flex h-[28px] items-center gap-[2px] px-2 text-[13px] text-white backdrop-blur-2xl"
      style={{ background: os.dark ? "rgba(22,22,26,.55)" : "rgba(30,30,36,.35)" }}
    >
      {/* apple */}
      <button
        onMouseDown={() => setOpen(open === "apple" ? null : "apple")}
        onMouseEnter={() => open && setOpen("apple")}
        className={cn("relative rounded px-2 py-[2px]", open === "apple" && "bg-white/25")}
      >
        <AppleLogo className="h-[15px] w-[15px] drop-shadow" />
      </button>
      {open === "apple" && (
        <Panel className="left-1 w-60">
          {APPLE_MENU.map(([label, id], i) =>
            label === "-" ? (
              <div key={i} className="my-1 h-px bg-black/10" />
            ) : (
              <button
                key={i}
                onClick={() => appleAction(id)}
                className="flex w-full items-center justify-between rounded-md px-3 py-[4px] text-left hover:bg-blue-500 hover:text-white"
              >
                {label}
                {label === "Recent Items" && <span className="opacity-50">›</span>}
              </button>
            ),
          )}
        </Panel>
      )}

      {/* app name */}
      <button
        onMouseDown={() => setOpen(open === "app" ? null : "app")}
        onMouseEnter={() => open && setOpen("app")}
        className={cn("rounded px-2 py-[2px] font-bold", open === "app" && "bg-white/25")}
      >
        {appName}
      </button>
      {open === "app" && (
        <Panel className="left-12 w-56">
          {[`About ${appName}`, "-", "Settings…", "-", "Hide", "Hide Others", "-", `Quit ${appName}`].map((l, i) =>
            l === "-" ? (
              <div key={i} className="my-1 h-px bg-black/10" />
            ) : (
              <button
                key={i}
                onClick={() => {
                  setOpen(null);
                  if (l.startsWith("Quit") && activeWin) os.closeWindow(activeWin.id);
                  if (l === "Hide" && activeWin) os.minimizeWindow(activeWin.id);
                  if (l === "Settings…") os.openApp("settings");
                  if (l.startsWith("About")) os.openApp("about");
                }}
                className="flex w-full justify-between rounded-md px-3 py-[4px] text-left hover:bg-blue-500 hover:text-white"
              >
                {l}
                {l.startsWith("Quit") && <span className="opacity-50">⌘Q</span>}
                {l === "Hide" && <span className="opacity-50">⌘H</span>}
              </button>
            ),
          )}
        </Panel>
      )}

      {menus.map((m) => (
        <button
          key={m}
          onMouseDown={() => setOpen(open === m ? null : m)}
          onMouseEnter={() => open && setOpen(m)}
          className={cn("hidden rounded px-2 py-[2px] sm:block", open === m && "bg-white/25")}
        >
          {m}
        </button>
      ))}
      {menus.includes(open ?? "") && (
        <Panel className="left-32 w-52">
          {["New Window", "Open…", "-", "Close", "Save", "Duplicate", "-", "Print…"].map((l, i) =>
            l === "-" ? (
              <div key={i} className="my-1 h-px bg-black/10" />
            ) : (
              <button key={i} onClick={() => setOpen(null)} className="block w-full rounded-md px-3 py-[4px] text-left hover:bg-blue-500 hover:text-white">
                {l}
              </button>
            ),
          )}
        </Panel>
      )}

      <div className="flex-1" />

      {/* status items */}
      <div className="flex items-center gap-[10px] pr-1">
        <span className="hidden text-[12px] opacity-90 md:inline">{os.battery}%</span>
        <BatteryGlyph level={os.battery} charging={os.charging} />
        <button onMouseDown={() => setOpen(open === "wifi" ? null : "wifi")} className={cn("rounded px-1 py-[2px]", open === "wifi" && "bg-white/25")}>
          <WifiGlyph on={os.wifi} className="h-[15px] w-[15px]" />
        </button>
        <button onMouseDown={() => os.setSpotlight(true)} className="rounded px-1 py-[2px] hover:bg-white/20">
          <SearchGlyph className="h-[15px] w-[15px]" />
        </button>
        <button onMouseDown={() => setOpen(open === "cc" ? null : "cc")} className={cn("rounded px-1 py-[2px]", open === "cc" && "bg-white/25")}>
          <ControlCenterGlyph className="h-[15px] w-[15px]" />
        </button>
        <button
          onMouseDown={() => setOpen(open === "notif" ? null : "notif")}
          className={cn("relative flex items-center gap-2 rounded px-2 py-[2px] tabular-nums", open === "notif" && "bg-white/25")}
        >
          <span className="hidden sm:inline">
            {now.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })}
          </span>
          <span>{now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
          {unread > 0 && !os.dnd && <span className="absolute -right-0 top-[2px] h-[5px] w-[5px] rounded-full bg-red-500" />}
        </button>
      </div>

      {open === "wifi" && (
        <Panel className="right-24 w-64">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="font-semibold">Wi-Fi</span>
            <button
              onClick={() => os.setWifi(!os.wifi)}
              className={cn("h-[22px] w-[38px] rounded-full transition", os.wifi ? "bg-blue-500" : "bg-zinc-400")}
            >
              <span className={cn("block h-[18px] w-[18px] rounded-full bg-white transition-all", os.wifi ? "ml-[18px]" : "ml-[2px]")} />
            </button>
          </div>
          <div className="my-1 h-px bg-black/10" />
          <div className="px-3 pb-1 text-[11px] font-semibold uppercase opacity-50">Networks</div>
          {["Cupertino 5G", "Starbucks Wi-Fi", "iPhone Hotspot"].map((n, i) => (
            <button key={n} className="flex w-full items-center gap-2 rounded-md px-3 py-[4px] text-left hover:bg-blue-500 hover:text-white">
              <span>{i === 0 && os.wifi ? "✓" : "\u00A0"}</span>
              <span className="flex-1">{n}</span>
              <WifiGlyph className="h-3.5 w-3.5" />
            </button>
          ))}
        </Panel>
      )}

      {open === "cc" && <ControlCenter onClose={() => setOpen(null)} />}
      {open === "notif" && <NotificationCenter />}
    </div>
  );
}

function Tile({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={cn("rounded-2xl bg-white/55 p-3 shadow-sm backdrop-blur-xl dark:bg-white/10", className)}
    >
      {children}
    </div>
  );
}

function ControlCenter({ onClose }: { onClose: () => void }) {
  const os = useOS();
  const pill = (on: boolean) =>
    cn("flex h-9 w-9 items-center justify-center rounded-full text-[15px] transition", on ? "text-white" : "bg-zinc-300/70 text-zinc-600");
  return (
    <Panel className="right-10 w-[320px] !bg-white/70 p-3 dark:!bg-zinc-800/80">
      <div className="grid grid-cols-2 gap-3">
        <Tile className="col-span-1 space-y-2">
          {[
            ["Wi-Fi", os.wifi, () => os.setWifi(!os.wifi), "📶"],
            ["Bluetooth", os.bluetooth, () => os.setBluetooth(!os.bluetooth), "🔵"],
            ["AirDrop", true, () => {}, "📡"],
          ].map(([label, on, fn, icon]) => (
            <button key={label as string} onClick={fn as () => void} className="flex w-full items-center gap-2 text-left">
              <span className={pill(on as boolean)} style={(on as boolean) ? { background: os.accent } : undefined}>
                {icon as string}
              </span>
              <span className="text-[12px] leading-tight">
                <b className="block">{label as string}</b>
                <span className="opacity-60">{(on as boolean) ? "On" : "Off"}</span>
              </span>
            </button>
          ))}
        </Tile>
        <div className="col-span-1 flex flex-col gap-3">
          <Tile onClick={() => os.setDnd(!os.dnd)} className="flex cursor-pointer items-center gap-2">
            <span className={pill(os.dnd)} style={os.dnd ? { background: os.accent } : undefined}>🌙</span>
            <span className="text-[12px] font-semibold">Focus</span>
          </Tile>
          <Tile className="flex items-center gap-3">
            <button onClick={() => os.setDark(!os.dark)} className="flex w-full items-center gap-2 text-left">
              <span className={pill(os.dark)} style={os.dark ? { background: os.accent } : undefined}>◐</span>
              <span className="text-[12px] font-semibold">
                {os.dark ? "Dark" : "Light"}
                <span className="block font-normal opacity-60">Appearance</span>
              </span>
            </button>
          </Tile>
        </div>
      </div>

      <Tile className="mt-3">
        <div className="mb-1 text-[12px] font-semibold">Display</div>
        <div className="flex items-center gap-2">
          <span className="text-[13px]">☀</span>
          <input type="range" min={40} max={100} value={os.brightness} onChange={(e) => os.setBrightness(+e.target.value)} className="w-full" style={{ accentColor: os.accent }} />
        </div>
      </Tile>
      <Tile className="mt-3">
        <div className="mb-1 text-[12px] font-semibold">Sound</div>
        <div className="flex items-center gap-2">
          <span className="text-[13px]">🔈</span>
          <input type="range" min={0} max={100} value={os.volume} onChange={(e) => os.setVolume(+e.target.value)} className="w-full" style={{ accentColor: os.accent }} />
        </div>
      </Tile>
      <Tile className="mt-3 flex items-center gap-3">
        <div className="h-9 w-9 rounded-md" style={{ background: "linear-gradient(135deg,#ff6a5a,#8e2de2)" }} />
        <div className="min-w-0 flex-1 text-[12px]">
          <div className="truncate font-semibold">Midnight Commute</div>
          <div className="truncate opacity-60">Neon District</div>
        </div>
        <button onClick={() => { os.openApp("music"); onClose(); }} className="text-[16px]">▶</button>
      </Tile>
    </Panel>
  );
}

function NotificationCenter() {
  const os = useOS();
  const now = useClock();
  return (
    <Panel className="right-2 w-[330px] !bg-transparent !shadow-none !backdrop-blur-none !border-0 p-0">
      <div className="anim-slide-right max-h-[75vh] space-y-3 overflow-y-auto p-1 pr-1">
        {os.notifications.map((n) => (
          <div key={n.id} className="group relative rounded-2xl bg-white/80 p-3 text-zinc-900 shadow-lg backdrop-blur-2xl dark:bg-zinc-800/85 dark:text-zinc-100">
            <div className="flex items-start gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg text-[13px] text-white" style={{ background: os.accent }}>
                {n.app[0]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-[12px] font-semibold">{n.app}</span>
                  <span className="text-[11px] opacity-50">{n.time}</span>
                </div>
                <div className="text-[13px] font-semibold">{n.title}</div>
                <div className="text-[12.5px] opacity-70">{n.body}</div>
              </div>
            </div>
            <button
              onClick={() => os.dismissNotification(n.id)}
              className="absolute -left-1 -top-1 hidden h-5 w-5 rounded-full bg-zinc-500 text-[11px] text-white group-hover:block"
            >
              ×
            </button>
          </div>
        ))}
        <div className="rounded-2xl bg-white/80 p-4 text-center text-zinc-900 shadow-lg backdrop-blur-2xl dark:bg-zinc-800/85 dark:text-zinc-100">
          <div className="text-[13px] font-semibold opacity-60">
            {now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
          </div>
          <div className="text-[34px] font-light leading-tight">
            {now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
          </div>
          <div className="mt-1 text-[12px] opacity-60">
            {os.notifications.length ? `${os.notifications.length} notifications` : "No new notifications"}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 p-3 text-white shadow-lg">
            <div className="text-[12px] opacity-90">Cupertino</div>
            <div className="text-[28px] font-light leading-tight">22°</div>
            <div className="text-[11px] opacity-90">Mostly Sunny · H:24 L:14</div>
          </div>
          <div className="rounded-2xl bg-white/80 p-3 text-zinc-900 shadow-lg backdrop-blur-2xl dark:bg-zinc-800/85 dark:text-zinc-100">
            <div className="text-[11px] font-semibold uppercase text-red-500">
              {now.toLocaleDateString([], { weekday: "short" })}
            </div>
            <div className="text-[26px] font-light leading-tight">{now.getDate()}</div>
            <div className="text-[11px] opacity-60">Design Review · 3 PM</div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
