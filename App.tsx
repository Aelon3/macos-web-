import { useEffect, useRef, useState } from "react";
import { OSProvider, useOS, type Notif } from "@/os/store";
import { getApp } from "@/os/registry";
import MenuBar from "@/components/MenuBar";
import Dock from "@/components/Dock";
import Desktop, { Wallpaper } from "@/components/Desktop";
import Launchpad from "@/components/Launchpad";
import Spotlight from "@/components/Spotlight";
import MissionControl from "@/components/MissionControl";
import WindowFrame from "@/components/WindowFrame";
import AppBoundary from "@/components/AppBoundary";
import {
  BootScreen,
  LockScreen,
  LoginScreen,
  RestartScreen,
  ShutdownScreen,
  SleepScreen,
} from "@/components/Screens";


function Windows() {
  const os = useOS();
  return (
    <>
      {os.windows.map((w) => {
        const def = getApp(w.appId);
        const Comp = def?.component;
        if (!Comp) return null;
        return (
          <WindowFrame key={w.id} win={w} active={os.activeId === w.id} title={def.name}>
            <AppBoundary name={def.name}>
              <Comp {...(w.payload ?? {})} />
            </AppBoundary>
          </WindowFrame>
        );
      })}
    </>
  );
}

function Toasts() {
  const os = useOS();
  const [visible, setVisible] = useState<Notif[]>([]);
  const latest = os.notifications[0];

  useEffect(() => {
    if (!latest || os.dnd) return;
    setVisible((v) => (v.some((x) => x.id === latest.id) ? v : [latest, ...v].slice(0, 3)));
    const t = setTimeout(() => setVisible((v) => v.filter((x) => x.id !== latest.id)), 4500);
    return () => clearTimeout(t);
  }, [latest, os.dnd]);

  return (
    <div className="pointer-events-none fixed right-3 top-9 z-[8900] w-[320px] space-y-2">
      {visible.map((n) => (
        <div key={n.id} className="anim-slide-right pointer-events-auto rounded-2xl bg-white/85 p-3 shadow-2xl backdrop-blur-2xl dark:bg-zinc-800/90">
          <div className="flex items-start gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg text-[13px] text-white" style={{ background: os.accent }}>
              {n.app[0]}
            </div>
            <div className="min-w-0 flex-1 text-zinc-900 dark:text-zinc-100">
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] font-semibold">{n.app}</span>
                <span className="text-[11px] opacity-50">{n.time}</span>
              </div>
              <div className="text-[13px] font-semibold">{n.title}</div>
              <div className="text-[12.5px] opacity-70">{n.body}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function HelpHint() {
  const os = useOS();
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 9000);
    return () => clearTimeout(t);
  }, []);
  if (!show || os.launchpad || os.spotlight) return null;
  return (
    <div className="anim-fade-in pointer-events-none fixed bottom-[96px] left-1/2 z-[7500] -translate-x-1/2 rounded-full bg-black/45 px-4 py-2 text-[12px] text-white/90 backdrop-blur-xl">
      Welcome to <b>macOS Web</b> — press <kbd className="rounded bg-white/20 px-1">⌘</kbd>
      <kbd className="rounded bg-white/20 px-1">Space</kbd> for Spotlight · <kbd className="rounded bg-white/20 px-1">F4</kbd> Launchpad ·
      right-click the desktop for wallpapers
    </div>
  );
}

function Shell() {
  const os = useOS();
  const welcomed = useRef(false);

  // open a couple of windows the first time the desktop appears
  const openRef = useRef(os.openApp);
  openRef.current = os.openApp;
  useEffect(() => {
    if (os.phase !== "desktop" || welcomed.current) return;
    welcomed.current = true;
    setTimeout(() => openRef.current("finder"), 300);
    setTimeout(() => openRef.current("notes"), 700);
  }, [os.phase]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.code === "Space") {
        e.preventDefault();
        os.setSpotlight(!os.spotlight);
        return;
      }
      if (e.key === "Escape") {
        if (os.spotlight) os.setSpotlight(false);
        else if (os.launchpad) os.setLaunchpad(false);
        else if (os.mission) os.setMission(false);
        return;
      }
      if (e.key === "F4") {
        e.preventDefault();
        os.setLaunchpad(!os.launchpad);
      }
      if (e.key === "F3") {
        e.preventDefault();
        os.setMission(!os.mission);
      }
      const tag = (e.target as HTMLElement)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA";
      if (meta && !typing) {
        if (e.key.toLowerCase() === "q" || e.key.toLowerCase() === "w") {
          e.preventDefault();
          if (os.activeId) os.closeWindow(os.activeId);
        }
        if (e.key.toLowerCase() === "m") {
          e.preventDefault();
          if (os.activeId) os.minimizeWindow(os.activeId);
        }
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [os]);

  if (os.phase === "boot") return <BootScreen />;
  if (os.phase === "login") return <LoginScreen />;
  if (os.phase === "lock") return <LockScreen />;
  if (os.phase === "sleep") return <SleepScreen />;
  if (os.phase === "restart") return <RestartScreen />;
  if (os.phase === "shutdown") return <ShutdownScreen />;

  return (
    <div className={os.dark ? "dark" : ""}>
      <div className="fixed inset-0 overflow-hidden">
        <Wallpaper />
        <Desktop />
        <Windows />
        <MenuBar />
        <Toasts />
        <Launchpad />
        <MissionControl />
        <Spotlight />
        <Dock />
        <HelpHint />

        {/* quick switcher hint for mission control */}
        <button
          onClick={() => os.setMission(!os.mission)}
          title="Mission Control (F3)"
          className="fixed bottom-[92px] right-3 z-[7900] hidden h-8 w-8 items-center justify-center rounded-lg bg-black/30 text-[13px] text-white/80 backdrop-blur-xl transition hover:bg-black/50 md:flex"
        >
          ▦
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <OSProvider>
      <Shell />
    </OSProvider>
  );
}
