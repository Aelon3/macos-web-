import { useState } from "react";
import { ACCENTS, useOS, WALLPAPERS } from "@/os/store";
import { cn } from "@/utils/cn";

const PANES = [
  { id: "general", name: "General", icon: "⚙️" },
  { id: "appearance", name: "Appearance", icon: "🎨" },
  { id: "wallpaper", name: "Wallpaper", icon: "🖼" },
  { id: "dock", name: "Desktop & Dock", icon: "🧰" },
  { id: "network", name: "Network", icon: "🌐" },
  { id: "sound", name: "Sound", icon: "🔊" },
  { id: "battery", name: "Battery", icon: "🔋" },
  { id: "users", name: "Users & Groups", icon: "👤" },
  { id: "about", name: "About", icon: "💻" },
];

function Row({ label, children, desc }: { label: string; children: React.ReactNode; desc?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-current/10 py-3 last:border-0">
      <div>
        <div className="text-[13px] font-medium">{label}</div>
        {desc && <div className="text-[11.5px] opacity-50">{desc}</div>}
      </div>
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  const { accent } = useOS();
  return (
    <button
      onClick={() => onChange(!on)}
      className="relative h-[24px] w-[42px] rounded-full transition"
      style={{ background: on ? accent : "rgba(130,130,140,.35)" }}
    >
      <span
        className="absolute top-[2px] h-5 w-5 rounded-full bg-white shadow transition-all"
        style={{ left: on ? 20 : 2 }}
      />
    </button>
  );
}

export default function Settings() {
  const os = useOS();
  const { dark, accent } = os;
  const [pane, setPane] = useState("appearance");

  return (
    <div className={cn("flex h-full", dark ? "bg-[#1e1f24] text-zinc-200" : "bg-white text-zinc-800")}>
      <div className={cn("mac-scroll w-[210px] shrink-0 overflow-y-auto border-r p-2 text-[13px]", dark ? "border-black/40 bg-[#26272c]" : "border-black/10 bg-[#ececee]")}>
        <div className="mb-3 flex items-center gap-3 rounded-lg p-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full text-[15px] font-semibold text-white" style={{ background: accent }}>
            {os.userName[0]}
          </div>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-semibold">{os.userName}</div>
            <div className="truncate text-[11px] opacity-50">Apple Account</div>
          </div>
        </div>
        {PANES.map((p) => (
          <button
            key={p.id}
            onClick={() => setPane(p.id)}
            className={cn("mb-[2px] flex w-full items-center gap-2 rounded-md px-2 py-[6px] text-left", pane === p.id ? "text-white" : "hover:bg-black/5")}
            style={pane === p.id ? { background: accent } : undefined}
          >
            <span>{p.icon}</span>
            {p.name}
          </button>
        ))}
      </div>

      <div className="mac-scroll flex-1 overflow-y-auto px-8 py-6">
        <h2 className="mb-4 text-[20px] font-bold">{PANES.find((p) => p.id === pane)?.name}</h2>

        {pane === "appearance" && (
          <div className="max-w-xl">
            <div className="mb-5">
              <div className="mb-2 text-[13px] font-medium">Appearance</div>
              <div className="flex gap-4">
                {[false, true].map((d) => (
                  <button key={String(d)} onClick={() => os.setDark(d)} className="flex flex-col items-center gap-2">
                    <div
                      className={cn("h-16 w-24 overflow-hidden rounded-lg ring-2", os.dark === d ? "" : "ring-transparent")}
                      style={{ boxShadow: os.dark === d ? `0 0 0 2px ${accent}` : undefined, background: d ? "#2b2d33" : "#f3f4f6" }}
                    >
                      <div className={cn("h-3 w-full", d ? "bg-black/40" : "bg-white")} />
                      <div className="p-2">
                        <div className={cn("h-2 w-12 rounded", d ? "bg-white/30" : "bg-zinc-300")} />
                        <div className={cn("mt-1 h-2 w-16 rounded", d ? "bg-white/20" : "bg-zinc-200")} />
                      </div>
                    </div>
                    <span className="text-[12px]">{d ? "Dark" : "Light"}</span>
                  </button>
                ))}
              </div>
            </div>
            <Row label="Accent colour">
              <div className="flex gap-2">
                {ACCENTS.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => os.setAccent(a.color)}
                    title={a.name}
                    className={cn("h-5 w-5 rounded-full ring-offset-2 transition", accent === a.color && "ring-2")}
                    style={{ background: a.color, boxShadow: accent === a.color ? `0 0 0 2px ${a.color}66` : undefined }}
                  />
                ))}
              </div>
            </Row>
            <Row label="Allow wallpaper tinting in windows" desc="Blends window chrome with the desktop picture">
              <Toggle on={true} onChange={() => {}} />
            </Row>
            <Row label="Show scroll bars" desc="Automatically based on mouse or trackpad">
              <select className={cn("rounded-md px-2 py-1 text-[12px]", dark ? "bg-white/10" : "bg-black/[0.06]")}>
                <option>Automatically</option>
                <option>When scrolling</option>
                <option>Always</option>
              </select>
            </Row>
          </div>
        )}

        {pane === "wallpaper" && (
          <div className="grid max-w-2xl grid-cols-3 gap-4">
            {WALLPAPERS.map((w) => (
              <button key={w.id} onClick={() => os.setWallpaperId(w.id)} className="group text-left">
                <div
                  className={cn("aspect-[16/10] w-full rounded-lg ring-offset-2 transition group-hover:scale-[1.02]", os.wallpaperId === w.id && "ring-2")}
                  style={{ background: w.background, boxShadow: os.wallpaperId === w.id ? `0 0 0 2px ${accent}` : undefined }}
                />
                <div className="mt-1 text-[12px]">{w.name}</div>
              </button>
            ))}
          </div>
        )}

        {pane === "dock" && (
          <div className="max-w-xl">
            <Row label="Magnification" desc="Dock icons enlarge on hover">
              <Toggle on onChange={() => {}} />
            </Row>
            <Row label="Minimise windows into application icon">
              <Toggle on={false} onChange={() => {}} />
            </Row>
            <Row label="Automatically hide and show the Dock">
              <Toggle on={false} onChange={() => {}} />
            </Row>
            <Row label="Show recent applications in Dock">
              <Toggle on onChange={() => {}} />
            </Row>
            <Row label="Pinned apps" desc="Click an app to pin or unpin it from the Dock">
              <span className="text-[11px] opacity-50">{os.dockPinned.length} pinned</span>
            </Row>
            <div className="mt-3 flex flex-wrap gap-2">
              {["finder", "safari", "mail", "messages", "maps", "photos", "notes", "music", "appstore", "code", "terminal", "calculator", "calendar", "reminders", "weather", "games", "settings"].map((id) => (
                <button
                  key={id}
                  onClick={() => os.toggleDockPin(id)}
                  className={cn(
                    "rounded-md px-2 py-1 text-[11.5px] capitalize ring-1 transition",
                    os.dockPinned.includes(id) ? "text-white ring-transparent" : "opacity-60 ring-current/20",
                  )}
                  style={os.dockPinned.includes(id) ? { background: accent } : undefined}
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        )}

        {pane === "network" && (
          <div className="max-w-xl">
            <Row label="Wi-Fi" desc={os.wifi ? "Connected to “Cupertino 5G”" : "Turned off"}>
              <Toggle on={os.wifi} onChange={os.setWifi} />
            </Row>
            <Row label="Bluetooth" desc={os.bluetooth ? "2 devices connected" : "Turned off"}>
              <Toggle on={os.bluetooth} onChange={os.setBluetooth} />
            </Row>
            <Row label="AirDrop" desc="Contacts only">
              <Toggle on onChange={() => {}} />
            </Row>
            <div className="mt-4 rounded-lg p-3 text-[12px]" style={{ background: dark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)" }}>
              <div className="mb-2 font-semibold">Known networks</div>
              {["Cupertino 5G", "Starbucks Wi-Fi", "iPhone Hotspot", "Home Fibre"].map((n, i) => (
                <div key={n} className="flex items-center justify-between py-1">
                  <span>{i === 0 ? "✓ " : ""}{n}</span>
                  <span className="opacity-50">{["▂▄▆█", "▂▄▆", "▂▄", "▂▄▆█"][i]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {pane === "sound" && (
          <div className="max-w-xl">
            <Row label="Output volume">
              <input type="range" min={0} max={100} value={os.volume} onChange={(e) => os.setVolume(+e.target.value)} className="w-56" style={{ accentColor: accent }} />
              <span className="w-8 text-right text-[12px]">{os.volume}</span>
            </Row>
            <Row label="Mute">
              <Toggle on={os.volume === 0} onChange={(v) => os.setVolume(v ? 0 : 55)} />
            </Row>
            <Row label="Alert sound">
              <select className={cn("rounded-md px-2 py-1 text-[12px]", dark ? "bg-white/10" : "bg-black/[0.06]")}>
                <option>Boop</option>
                <option>Funk</option>
                <option>Submarine</option>
                <option>Sosumi</option>
              </select>
            </Row>
            <Row label="Play sound on startup">
              <Toggle on onChange={() => {}} />
            </Row>
          </div>
        )}

        {pane === "battery" && (
          <div className="max-w-xl">
            <div className="mb-4 flex items-end gap-3">
              <div className="text-[44px] font-light leading-none">{os.battery}%</div>
              <div className="pb-2 text-[12.5px] opacity-60">{os.charging ? "Charging · 42 min to full" : "On battery · 6:12 remaining"}</div>
            </div>
            <div className="mb-5 h-3 w-full overflow-hidden rounded-full bg-current/15">
              <div className="h-full rounded-full transition-all" style={{ width: `${os.battery}%`, background: os.charging ? "#30d158" : accent }} />
            </div>
            <Row label="Power adapter connected">
              <Toggle on={os.charging} onChange={os.setCharging} />
            </Row>
            <Row label="Low Power Mode">
              <Toggle on={false} onChange={() => {}} />
            </Row>
            <Row label="Display brightness">
              <input type="range" min={40} max={100} value={os.brightness} onChange={(e) => os.setBrightness(+e.target.value)} className="w-56" style={{ accentColor: accent }} />
            </Row>
          </div>
        )}

        {pane === "users" && (
          <div className="max-w-xl">
            <Row label="Full name">
              <input
                value={os.userName}
                onChange={(e) => os.setUserName(e.target.value)}
                className={cn("rounded-md px-3 py-1 text-[13px] outline-none", dark ? "bg-white/10" : "bg-black/[0.06]")}
              />
            </Row>
            <Row label="Account type">
              <span className="text-[12.5px] opacity-70">Administrator</span>
            </Row>
            <Row label="Automatic login">
              <Toggle on={false} onChange={() => {}} />
            </Row>
            <Row label="Lock screen">
              <button onClick={() => os.setPhase("lock")} className="rounded-md px-3 py-1 text-[12px] text-white" style={{ background: accent }}>
                Lock now
              </button>
            </Row>
          </div>
        )}

        {pane === "general" && (
          <div className="max-w-xl">
            <Row label="Computer name">
              <span className="text-[12.5px] opacity-70">MacBook Pro 16"</span>
            </Row>
            <Row label="Software Update" desc="macOS Web 15.4 — your Mac is up to date">
              <button className={cn("rounded-md px-3 py-1 text-[12px]", dark ? "bg-white/10" : "bg-black/[0.06]")}>Check Now</button>
            </Row>
            <Row label="Storage" desc="284.6 GB available of 1 TB">
              <div className="flex h-3 w-56 overflow-hidden rounded-full">
                {[["#0a84ff", 34], ["#bf5af2", 14], ["#ff9f0a", 9], ["#30d158", 7], ["rgba(140,140,150,.3)", 36]].map(([c, w], i) => (
                  <div key={i} style={{ background: c as string, width: `${w}%` }} />
                ))}
              </div>
            </Row>
            <Row label="Time Machine">
              <Toggle on onChange={() => {}} />
            </Row>
            <Row label="Restart / Shut Down">
              <button onClick={() => os.setPhase("restart")} className={cn("rounded-md px-3 py-1 text-[12px]", dark ? "bg-white/10" : "bg-black/[0.06]")}>Restart</button>
              <button onClick={() => os.setPhase("shutdown")} className="rounded-md bg-red-500 px-3 py-1 text-[12px] text-white">Shut Down</button>
            </Row>
          </div>
        )}

        {pane === "about" && (
          <div className="max-w-xl text-[13px] leading-relaxed">
            <p className="opacity-80">
              <b>macOS Web</b> is a complete desktop experience that runs entirely in your browser —
              on a Mac, a Windows laptop, a Chromebook or a tablet. Nothing to install, nothing to
              download, and it is 100% free.
            </p>
            <div className="mt-4 space-y-1 opacity-70">
              <div>Version 15.4 (Build 26A101)</div>
              <div>Engine: React 19 · Vite · Tailwind CSS</div>
              <div>Apps installed: 18</div>
            </div>
            <button onClick={() => os.openApp("about")} className="mt-5 rounded-md px-3 py-1 text-[12px] text-white" style={{ background: accent }}>
              About This Mac
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
