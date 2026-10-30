import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type Phase = "boot" | "login" | "desktop" | "lock" | "sleep" | "restart" | "shutdown";

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  prev?: { x: number; y: number; w: number; h: number };
  payload?: Record<string, unknown>;
}

export interface Wallpaper {
  id: string;
  name: string;
  dark: boolean;
  background: string;
  accent: string;
}

export const WALLPAPERS: Wallpaper[] = [
  {
    id: "sonoma",
    name: "Sonoma Horizon",
    dark: false,
    accent: "#f0792b",
    background:
      "radial-gradient(120% 90% at 18% 8%, #ffd36e 0%, rgba(255,211,110,0) 55%)," +
      "radial-gradient(100% 80% at 85% 15%, #ff7a59 0%, rgba(255,122,89,0) 60%)," +
      "radial-gradient(130% 110% at 50% 110%, #5b2a86 0%, rgba(91,42,134,0) 65%)," +
      "linear-gradient(170deg,#ff9a4d 0%,#f3603d 35%,#a4306c 65%,#3c1a5b 100%)",
  },
  {
    id: "ventura",
    name: "Ventura Swirl",
    dark: true,
    accent: "#2f7df6",
    background:
      "radial-gradient(90% 70% at 25% 20%, #4fc3f7 0%, rgba(79,195,247,0) 60%)," +
      "radial-gradient(80% 70% at 80% 30%, #6d5bf5 0%, rgba(109,91,245,0) 60%)," +
      "radial-gradient(120% 100% at 50% 100%, #0b1437 0%, rgba(11,20,55,0) 70%)," +
      "linear-gradient(160deg,#153a7a 0%,#1b2a6b 45%,#121537 100%)",
  },
  {
    id: "monterey",
    name: "Monterey Flow",
    dark: false,
    accent: "#d9478b",
    background:
      "radial-gradient(90% 80% at 15% 85%, #ff6fb5 0%, rgba(255,111,181,0) 60%)," +
      "radial-gradient(80% 70% at 85% 20%, #6ad1ff 0%, rgba(106,209,255,0) 60%)," +
      "radial-gradient(100% 90% at 50% 50%, #b06cf7 0%, rgba(176,108,247,0) 70%)," +
      "linear-gradient(145deg,#2b1b63 0%,#7332a8 50%,#ef5d8f 100%)",
  },
  {
    id: "graphite",
    name: "Graphite",
    dark: true,
    accent: "#8e8e93",
    background:
      "radial-gradient(90% 70% at 30% 10%, #4a4f57 0%, rgba(74,79,87,0) 60%)," +
      "radial-gradient(90% 80% at 80% 90%, #22252b 0%, rgba(34,37,43,0) 65%)," +
      "linear-gradient(160deg,#2c3037 0%,#15171b 60%,#0a0b0d 100%)",
  },
  {
    id: "aurora",
    name: "Aurora Mint",
    dark: false,
    accent: "#13b6a0",
    background:
      "radial-gradient(80% 70% at 20% 20%, #9bf6c4 0%, rgba(155,246,196,0) 60%)," +
      "radial-gradient(90% 70% at 85% 35%, #2ad9c6 0%, rgba(42,217,198,0) 60%)," +
      "radial-gradient(120% 100% at 50% 110%, #05485f 0%, rgba(5,72,95,0) 70%)," +
      "linear-gradient(165deg,#6ef0c8 0%,#13a9b5 45%,#0b3a63 100%)",
  },
  {
    id: "midnight",
    name: "Midnight Sierra",
    dark: true,
    accent: "#5e5ce6",
    background:
      "radial-gradient(70% 60% at 70% 15%, #3b2d8f 0%, rgba(59,45,143,0) 60%)," +
      "radial-gradient(90% 70% at 20% 70%, #10204f 0%, rgba(16,32,79,0) 65%)," +
      "linear-gradient(170deg,#0d1030 0%,#131a44 45%,#05060f 100%)",
  },
];

export interface Notif {
  id: string;
  app: string;
  title: string;
  body: string;
  time: string;
}

interface OSContextValue {
  phase: Phase;
  setPhase: (p: Phase) => void;
  windows: WindowState[];
  activeId: string | null;
  openApp: (appId: string, payload?: Record<string, unknown>) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  setBounds: (id: string, b: Partial<Pick<WindowState, "x" | "y" | "w" | "h">>) => void;
  setTitle: (id: string, title: string) => void;
  closeApp: (appId: string) => void;
  runningApps: string[];
  launchpad: boolean;
  setLaunchpad: (v: boolean) => void;
  spotlight: boolean;
  setSpotlight: (v: boolean) => void;
  mission: boolean;
  setMission: (v: boolean) => void;
  wallpaper: Wallpaper;
  wallpaperId: string;
  setWallpaperId: (id: string) => void;
  dark: boolean;
  setDark: (v: boolean) => void;
  accent: string;
  setAccent: (v: string) => void;
  volume: number;
  setVolume: (v: number) => void;
  brightness: number;
  setBrightness: (v: number) => void;
  wifi: boolean;
  setWifi: (v: boolean) => void;
  bluetooth: boolean;
  setBluetooth: (v: boolean) => void;
  dnd: boolean;
  setDnd: (v: boolean) => void;
  battery: number;
  charging: boolean;
  setCharging: (v: boolean) => void;
  notifications: Notif[];
  pushNotification: (n: Omit<Notif, "id" | "time">) => void;
  dismissNotification: (id: string) => void;
  dockPinned: string[];
  toggleDockPin: (id: string) => void;
  userName: string;
  setUserName: (v: string) => void;
  bootProgress: number;
  trash: string[];
  addToTrash: (name: string) => void;
  emptyTrash: () => void;
  notes: { id: string; title: string; body: string; date: string }[];
  setNotes: React.Dispatch<
    React.SetStateAction<{ id: string; title: string; body: string; date: string }[]>
  >;
}

const OSContext = createContext<OSContextValue | null>(null);

export const ACCENTS: { id: string; color: string; name: string }[] = [
  { id: "blue", color: "#0a84ff", name: "Blue" },
  { id: "purple", color: "#8944ea", name: "Purple" },
  { id: "pink", color: "#f0379a", name: "Pink" },
  { id: "red", color: "#ff453a", name: "Red" },
  { id: "orange", color: "#ff9f0a", name: "Orange" },
  { id: "green", color: "#30d158", name: "Green" },
  { id: "graphite", color: "#8e8e93", name: "Graphite" },
];

const DEFAULT_DOCK = [
  "finder",
  "launchpad",
  "safari",
  "mail",
  "messages",
  "maps",
  "photos",
  "notes",
  "music",
  "appstore",
  "code",
  "terminal",
  "calculator",
  "games",
  "settings",
];

let zCounter = 10;
let winCounter = 0;

export function OSProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("boot");
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [launchpad, setLaunchpad] = useState(false);
  const [spotlight, setSpotlight] = useState(false);
  const [mission, setMission] = useState(false);
  const [wallpaperId, setWallpaperId] = useState("sonoma");
  const [dark, setDark] = useState(false);
  const [accent, setAccent] = useState("#0a84ff");
  const [volume, setVolume] = useState(65);
  const [brightness, setBrightness] = useState(100);
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [dnd, setDnd] = useState(false);
  const [battery, setBattery] = useState(87);
  const [charging, setCharging] = useState(false);
  const [notifications, setNotifications] = useState<Notif[]>([
    {
      id: "n1",
      app: "Calendar",
      title: "Design Review",
      body: "Today at 3:00 PM — Conference Room 2",
      time: "9:41 AM",
    },
    {
      id: "n2",
      app: "App Store",
      title: "7 Updates Available",
      body: "Xcode, Keynote, Pages and 4 more",
      time: "8:12 AM",
    },
  ]);
  const [dockPinned, setDockPinned] = useState<string[]>(DEFAULT_DOCK);
  const [userName, setUserName] = useState("Alex Carter");
  const [bootProgress, setBootProgress] = useState(0);
  const [trash, setTrash] = useState<string[]>(["old-screenshot.png"]);
  const [notes, setNotes] = useState([
    {
      id: "note-1",
      title: "Welcome to macOS Web",
      body: "This is a full macOS desktop running right inside your browser.\n\n• Click the Launchpad to see every app\n• Press ⌘ + Space for Spotlight\n• Drag windows by their title bar\n• Right-click the desktop to change wallpaper\n\nEverything here works offline — no install needed.",
      date: "Today",
    },
    {
      id: "note-2",
      title: "Shortcuts",
      body: "⌘ + Space — Spotlight\n⌘ + Q — Quit app\n⌘ + M — Minimize\nF4 — Launchpad\nF3 — Mission Control",
      date: "Today",
    },
  ]);

  // boot sequence
  useEffect(() => {
    if (phase !== "boot") return;
    setBootProgress(0);
    let p = 0;
    const t = setInterval(() => {
      p += Math.random() * 11 + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(t);
        setTimeout(() => setPhase("login"), 480);
      }
      setBootProgress(p);
    }, 180);
    return () => clearInterval(t);
  }, [phase]);

  // battery simulation
  useEffect(() => {
    const t = setInterval(() => {
      setBattery((b) => {
        if (charging) return Math.min(100, b + 1);
        return b > 14 ? b - 1 : b;
      });
    }, 45000);
    return () => clearInterval(t);
  }, [charging]);

  const bump = () => ++zCounter;

  const focusWindow = useCallback((id: string) => {
    setWindows((ws) =>
      ws.map((w) => (w.id === id ? { ...w, z: bump(), minimized: false } : w)),
    );
    setActiveId(id);
  }, []);

  const openApp = useCallback(
    (appId: string, payload?: Record<string, unknown>) => {
      if (appId === "launchpad") {
        setLaunchpad(true);
        return;
      }
      setLaunchpad(false);
      setMission(false);
      setSpotlight(false);
      let found: WindowState | undefined;
      setWindows((ws) => {
        found = ws.find((w) => w.appId === appId);
        if (found) {
          const target = found.id;
          setActiveId(target);
          return ws.map((w) =>
            w.id === target
              ? { ...w, minimized: false, z: bump(), payload: payload ?? w.payload }
              : w,
          );
        }
        const def = APP_SIZES[appId] ?? { w: 880, h: 580 };
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const w = Math.min(def.w, vw - 60);
        const h = Math.min(def.h, vh - 140);
        const offset = (winCounter++ % 6) * 28;
        const id = `${appId}-${Date.now().toString(36)}`;
        setActiveId(id);
        return [
          ...ws,
          {
            id,
            appId,
            title: appId,
            x: Math.max(14, (vw - w) / 2 + offset - 70),
            y: Math.max(40, (vh - h) / 2 + offset - 60),
            w,
            h,
            z: bump(),
            minimized: false,
            maximized: false,
            payload,
          },
        ];
      });
    },
    [],
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((ws) => ws.filter((w) => w.id !== id));
  }, []);

  const closeApp = useCallback((appId: string) => {
    setWindows((ws) => ws.filter((w) => w.appId !== appId));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
    setActiveId(null);
  }, []);

  const toggleMaximize = useCallback((id: string) => {
    setWindows((ws) =>
      ws.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized && w.prev) {
          return { ...w, ...w.prev, maximized: false, prev: undefined, z: bump() };
        }
        return {
          ...w,
          prev: { x: w.x, y: w.y, w: w.w, h: w.h },
          x: 0,
          y: 28,
          w: window.innerWidth,
          h: window.innerHeight - 28 - 86,
          maximized: true,
          z: bump(),
        };
      }),
    );
  }, []);

  const setBounds = useCallback(
    (id: string, b: Partial<Pick<WindowState, "x" | "y" | "w" | "h">>) => {
      setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, ...b } : w)));
    },
    [],
  );

  const setTitle = useCallback((id: string, title: string) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, title } : w)));
  }, []);

  const pushNotification = useCallback((n: Omit<Notif, "id" | "time">) => {
    const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    setNotifications((prev) => [{ ...n, id: Math.random().toString(36).slice(2), time }, ...prev]);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const toggleDockPin = useCallback((id: string) => {
    setDockPinned((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }, []);

  const addToTrash = useCallback((name: string) => setTrash((t) => [...t, name]), []);
  const emptyTrash = useCallback(() => setTrash([]), []);

  const wallpaper = useMemo(
    () => WALLPAPERS.find((w) => w.id === wallpaperId) ?? WALLPAPERS[0],
    [wallpaperId],
  );

  const runningApps = useMemo(
    () => Array.from(new Set(windows.map((w) => w.appId))),
    [windows],
  );

  const value: OSContextValue = {
    phase,
    setPhase,
    windows,
    activeId,
    openApp,
    closeWindow,
    focusWindow,
    minimizeWindow,
    toggleMaximize,
    setBounds,
    setTitle,
    closeApp,
    runningApps,
    launchpad,
    setLaunchpad,
    spotlight,
    setSpotlight,
    mission,
    setMission,
    wallpaper,
    wallpaperId,
    setWallpaperId,
    dark,
    setDark,
    accent,
    setAccent,
    volume,
    setVolume,
    brightness,
    setBrightness,
    wifi,
    setWifi,
    bluetooth,
    setBluetooth,
    dnd,
    setDnd,
    battery,
    charging,
    setCharging,
    notifications,
    pushNotification,
    dismissNotification,
    dockPinned,
    toggleDockPin,
    userName,
    setUserName,
    bootProgress,
    trash,
    addToTrash,
    emptyTrash,
    notes,
    setNotes,
  };

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
}

export const APP_SIZES: Record<string, { w: number; h: number }> = {
  finder: { w: 900, h: 560 },
  safari: { w: 1020, h: 660 },
  terminal: { w: 740, h: 460 },
  notes: { w: 900, h: 580 },
  calculator: { w: 324, h: 500 },
  music: { w: 980, h: 620 },
  photos: { w: 960, h: 620 },
  settings: { w: 900, h: 600 },
  calendar: { w: 940, h: 620 },
  mail: { w: 1000, h: 620 },
  code: { w: 1000, h: 640 },
  maps: { w: 900, h: 600 },
  weather: { w: 420, h: 620 },
  appstore: { w: 940, h: 620 },
  about: { w: 640, h: 440 },
  trash: { w: 760, h: 480 },
  messages: { w: 900, h: 580 },
  reminders: { w: 820, h: 540 },
  games: { w: 560, h: 680 },
  preview: { w: 720, h: 560 },
};

export function useOS() {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error("useOS must be used inside OSProvider");
  return ctx;
}

export function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export function usePersistentRef<T>(initial: T) {
  const ref = useRef<T>(initial);
  return ref;
}
