import { useLayoutEffect, useRef, useState } from "react";
import { useOS } from "@/os/store";
import { getApp } from "@/os/registry";
import { AppIcon } from "@/os/icons";
import { cn } from "@/utils/cn";

const BASE = 52;
const MAX_EXTRA = 34;
const RANGE = 110;

export default function Dock() {
  const os = useOS();
  const ref = useRef<HTMLDivElement>(null);
  const bases = useRef<Record<string, number>>({});
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [bouncing, setBouncing] = useState<string | null>(null);

  /** capture idle (un-magnified) icon centres so magnification can't feed back on itself */
  const captureBases = () => {
    const map: Record<string, number> = {};
    ref.current?.querySelectorAll<HTMLElement>("[data-dock]").forEach((el) => {
      const r = el.getBoundingClientRect();
      map[el.dataset.dock!] = r.left + r.width / 2;
    });
    bases.current = map;
  };

  useLayoutEffect(() => {
    if (mouseX === null) captureBases();
  });

  useLayoutEffect(() => {
    const onResize = () => captureBases();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const items = [
    ...os.dockPinned,
    ...os.runningApps.filter((a) => !os.dockPinned.includes(a) && a !== "trash"),
  ];

  const launch = (id: string) => {
    if (!os.runningApps.includes(id) && id !== "launchpad") {
      setBouncing(id);
      setTimeout(() => setBouncing(null), 1300);
    }
    if (id === "launchpad") os.setLaunchpad(!os.launchpad);
    else os.openApp(id);
  };

  const sizeFor = (centerX: number) => {
    if (mouseX === null) return BASE;
    const d = Math.abs(mouseX - centerX);
    if (d > RANGE) return BASE;
    const t = Math.cos((d / RANGE) * (Math.PI / 2));
    return BASE + MAX_EXTRA * t * t;
  };

  const renderItem = (id: string, key: string) => {
    const center = bases.current[key] ?? -9999;
    const size = sizeFor(center);
    const running = os.runningApps.includes(id);
    const app = getApp(id);
    return (
      <button
        key={key}
        data-dock={key}
        onClick={() => launch(id)}
        onMouseEnter={() => setHover(key)}
        onMouseLeave={() => setHover(null)}
        className="group relative flex items-end justify-center"
        style={{ width: size, height: size, transition: mouseX === null ? "all .18s ease" : "none" }}
      >
        {hover === key && (
          <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-zinc-800/85 px-2 py-[3px] text-[12px] text-white shadow-lg backdrop-blur">
            {id === "trash" ? "Trash" : (app?.name ?? id)}
          </span>
        )}
        <span className={cn("block h-full w-full", bouncing === id && "anim-dock-bounce")}>
          <AppIcon id={id} className="h-full w-full drop-shadow-md" />
        </span>
        {running && (
          <span className="absolute -bottom-[7px] h-[4px] w-[4px] rounded-full bg-zinc-800/80 dark:bg-white/80" />
        )}
      </button>
    );
  };

  const minimized = os.windows.filter((w) => w.minimized);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[8000] flex justify-center pb-[6px]">
      <div
        ref={ref}
        onMouseEnter={() => captureBases()}
        onMouseMove={(e) => setMouseX(e.clientX)}
        onMouseLeave={() => {
          setMouseX(null);
          setHover(null);
        }}
        className="pointer-events-auto flex max-w-[94vw] items-end gap-[6px] overflow-visible rounded-[22px] border border-white/25 px-[10px] pb-[8px] pt-[6px] shadow-[0_18px_50px_rgba(0,0,0,.45)] backdrop-blur-2xl"
        style={{ background: os.dark ? "rgba(40,40,46,.55)" : "rgba(245,245,250,.35)" }}
      >
        {items.map((id) => renderItem(id, id))}

        {minimized.length > 0 && <div className="mx-1 h-12 w-px self-center bg-white/25" />}
        {minimized.map((w) => (
          <button
            key={w.id}
            data-dock={`min-${w.id}`}
            onClick={() => os.focusWindow(w.id)}
            onMouseEnter={() => setHover(`min-${w.id}`)}
            onMouseLeave={() => setHover(null)}
            className="relative flex items-end justify-center"
            style={{ width: BASE * 0.86, height: BASE * 0.86 }}
          >
            {hover === `min-${w.id}` && (
              <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-zinc-800/85 px-2 py-[3px] text-[12px] text-white">
                {getApp(w.appId)?.name}
              </span>
            )}
            <span className="block h-full w-full overflow-hidden rounded-md ring-1 ring-white/40">
              <AppIcon id={w.appId} className="h-full w-full opacity-90" />
            </span>
          </button>
        ))}

        <div className="mx-1 h-12 w-px self-center bg-white/25" />
        {renderItem("trash", "trash")}
      </div>
    </div>
  );
}
