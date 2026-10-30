import { useEffect, useState } from "react";
import { useClock, useOS } from "@/os/store";
import { AppleLogo } from "@/os/icons";
import { cn } from "@/utils/cn";

export function BootScreen() {
  const { bootProgress } = useOS();
  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black">
      <AppleLogo className="mb-10 h-20 w-20 text-white" />
      <div className="h-[5px] w-[220px] overflow-hidden rounded-full bg-white/20">
        <div className="h-full rounded-full bg-white transition-all duration-200" style={{ width: `${bootProgress}%` }} />
      </div>
      <div className="mt-6 text-[12px] text-white/40">macOS Web 15.4</div>
    </div>
  );
}

export function LoginScreen() {
  const os = useOS();
  const now = useClock();
  const [pw, setPw] = useState("");
  const [shake, setShake] = useState(false);

  const login = () => {
    setShake(true);
    setTimeout(() => {
      setShake(false);
      os.setPhase("desktop");
    }, 260);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center" style={{ background: os.wallpaper.background }}>
      <div className="absolute inset-0 backdrop-blur-[60px]" style={{ background: "rgba(0,0,0,.25)" }} />
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-4 text-center text-white">
          <div className="text-[15px] font-medium opacity-80">
            {now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
          </div>
          <div className="text-[66px] font-thin leading-none tracking-tight">
            {now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
          </div>
        </div>
        <div
          className={cn(
            "flex h-[96px] w-[96px] items-center justify-center rounded-full bg-white/25 text-[34px] font-semibold text-white shadow-xl backdrop-blur-xl",
            shake && "animate-pulse",
          )}
        >
          {os.userName.split(" ").map((n) => n[0]).join("")}
        </div>
        <div className="mt-3 text-[17px] font-medium text-white">{os.userName}</div>
        <div className="mt-3 flex items-center gap-2">
          <input
            autoFocus
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Enter Password"
            className="w-[210px] rounded-full border border-white/30 bg-white/20 px-4 py-[7px] text-center text-[13px] text-white placeholder:text-white/60 focus:outline-none"
          />
          <button onClick={login} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white hover:bg-white/40">
            →
          </button>
        </div>
        <button onClick={login} className="mt-3 text-[12px] text-white/70 hover:text-white">
          Touch ID or press Enter to log in
        </button>
      </div>

      <div className="absolute bottom-8 flex gap-10 text-[12px] text-white/80">
        {[
          ["Sleep", () => os.setPhase("sleep")],
          ["Restart", () => os.setPhase("restart")],
          ["Shut Down", () => os.setPhase("shutdown")],
        ].map(([l, fn]) => (
          <button key={l as string} onClick={fn as () => void} className="flex flex-col items-center gap-1 hover:text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-[15px] backdrop-blur">
              {l === "Sleep" ? "☾" : l === "Restart" ? "⟳" : "⏻"}
            </span>
            {l as string}
          </button>
        ))}
      </div>
    </div>
  );
}

export function LockScreen() {
  const os = useOS();
  const now = useClock();
  return (
    <div
      className="fixed inset-0 z-[10000] flex cursor-pointer flex-col items-center justify-start pt-[12vh]"
      style={{ background: os.wallpaper.background }}
      onClick={() => os.setPhase("login")}
    >
      <div className="absolute inset-0 backdrop-blur-[40px]" style={{ background: "rgba(0,0,0,.2)" }} />
      <div className="relative z-10 text-center text-white">
        <div className="text-[17px] opacity-80">
          {now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
        </div>
        <div className="text-[96px] font-thin leading-none tracking-tighter">
          {now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
        </div>
        <div className="mt-[40vh] animate-pulse text-[13px] opacity-70">Click anywhere to unlock</div>
      </div>
    </div>
  );
}

export function SleepScreen() {
  const os = useOS();
  return (
    <div
      className="fixed inset-0 z-[10000] cursor-pointer bg-black"
      onClick={() => os.setPhase("desktop")}
      onKeyDown={() => os.setPhase("desktop")}
    >
      <div className="flex h-full items-center justify-center text-[13px] text-white/25">
        Click anywhere to wake your Mac
      </div>
    </div>
  );
}

export function RestartScreen() {
  const os = useOS();
  useEffect(() => {
    const t = setTimeout(() => os.setPhase("boot"), 1800);
    return () => clearTimeout(t);
  }, [os]);
  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-6 bg-black">
      <AppleLogo className="h-16 w-16 text-white" />
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
    </div>
  );
}

export function ShutdownScreen() {
  const os = useOS();
  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-8 bg-black">
      <button
        onClick={() => os.setPhase("boot")}
        className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 text-[26px] text-white/70 transition hover:bg-white/10 hover:text-white"
        title="Power on"
      >
        ⏻
      </button>
      <div className="text-[13px] text-white/40">Your Mac is off. Press the power button to start it up.</div>
    </div>
  );
}
