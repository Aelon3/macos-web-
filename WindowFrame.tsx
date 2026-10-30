import { useRef, type ReactNode } from "react";
import { useOS, type WindowState } from "@/os/store";
import { cn } from "@/utils/cn";

interface Props {
  win: WindowState;
  active: boolean;
  title: string;
  children: ReactNode;
  toolbar?: ReactNode;
  transparentHeader?: boolean;
  headerClass?: string;
}

const MIN_W = 320;
const MIN_H = 200;

export default function WindowFrame({
  win,
  active,
  title,
  children,
  toolbar,
  transparentHeader,
  headerClass,
}: Props) {
  const { focusWindow, closeWindow, minimizeWindow, toggleMaximize, setBounds, dark } = useOS();
  const ref = useRef<HTMLDivElement>(null);

  const startDrag = (e: React.PointerEvent) => {
    if (win.maximized) return;
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
    const el = ref.current!;
    const startX = e.clientX;
    const startY = e.clientY;
    const ox = win.x;
    const oy = win.y;
    let nx = ox;
    let ny = oy;
    el.style.transition = "none";
    document.body.classList.add("dragging-window");
    const move = (ev: PointerEvent) => {
      nx = ox + (ev.clientX - startX);
      ny = Math.max(28, oy + (ev.clientY - startY));
      nx = Math.min(Math.max(nx, -win.w + 120), window.innerWidth - 120);
      ny = Math.min(ny, window.innerHeight - 60);
      el.style.left = `${nx}px`;
      el.style.top = `${ny}px`;
    };
    const up = () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
      document.body.classList.remove("dragging-window");
      setBounds(win.id, { x: nx, y: ny });
    };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
    focusWindow(win.id);
  };

  const startResize = (e: React.PointerEvent, dir: string) => {
    e.stopPropagation();
    const el = ref.current!;
    const sx = e.clientX;
    const sy = e.clientY;
    const o = { x: win.x, y: win.y, w: win.w, h: win.h };
    const next = { ...o };
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - sx;
      const dy = ev.clientY - sy;
      if (dir.includes("e")) next.w = Math.max(MIN_W, o.w + dx);
      if (dir.includes("s")) next.h = Math.max(MIN_H, o.h + dy);
      if (dir.includes("w")) {
        next.w = Math.max(MIN_W, o.w - dx);
        next.x = o.x + (o.w - next.w);
      }
      if (dir.includes("n")) {
        next.h = Math.max(MIN_H, o.h - dy);
        next.y = Math.max(28, o.y + (o.h - next.h));
      }
      el.style.left = `${next.x}px`;
      el.style.top = `${next.y}px`;
      el.style.width = `${next.w}px`;
      el.style.height = `${next.h}px`;
    };
    const up = () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
      setBounds(win.id, next);
    };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
  };

  const handles: { dir: string; cls: string }[] = [
    { dir: "n", cls: "top-0 left-3 right-3 h-1.5 cursor-ns-resize" },
    { dir: "s", cls: "bottom-0 left-3 right-3 h-1.5 cursor-ns-resize" },
    { dir: "w", cls: "left-0 top-3 bottom-3 w-1.5 cursor-ew-resize" },
    { dir: "e", cls: "right-0 top-3 bottom-3 w-1.5 cursor-ew-resize" },
    { dir: "nw", cls: "left-0 top-0 h-3 w-3 cursor-nwse-resize" },
    { dir: "ne", cls: "right-0 top-0 h-3 w-3 cursor-nesw-resize" },
    { dir: "sw", cls: "left-0 bottom-0 h-3 w-3 cursor-nesw-resize" },
    { dir: "se", cls: "right-0 bottom-0 h-3 w-3 cursor-nwse-resize" },
  ];

  return (
    <div
      ref={ref}
      onPointerDown={() => focusWindow(win.id)}
      className={cn(
        "anim-window-in absolute flex flex-col overflow-hidden rounded-xl",
        active ? "mac-shadow" : "mac-shadow-sm",
        win.minimized && "pointer-events-none hidden",
        dark ? "bg-[#1e1f24] text-zinc-100" : "bg-white text-zinc-900",
      )}
      style={{
        left: win.x,
        top: win.y,
        width: win.w,
        height: win.h,
        zIndex: win.z,
        transition: win.maximized ? "all .18s ease" : undefined,
      }}
    >
      {/* title bar */}
      <div
        onPointerDown={startDrag}
        onDoubleClick={() => toggleMaximize(win.id)}
        className={cn(
          "group/title relative flex h-[38px] shrink-0 items-center gap-2 px-3",
          transparentHeader
            ? "absolute inset-x-0 top-0 z-20 bg-transparent"
            : dark
              ? "border-b border-black/40 bg-[#2a2c32]"
              : "border-b border-black/10 bg-[#f1f1f3]",
          headerClass,
        )}
      >
        <div className="flex items-center gap-2" data-no-drag>
          <button
            onClick={() => closeWindow(win.id)}
            className="group/btn flex h-[12px] w-[12px] items-center justify-center rounded-full bg-[#ff5f57] ring-[0.5px] ring-black/15 transition hover:brightness-95"
            title="Close"
          >
            <svg viewBox="0 0 10 10" className="h-[7px] w-[7px] opacity-0 group-hover/title:opacity-70">
              <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="#5b0000" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <button
            onClick={() => minimizeWindow(win.id)}
            className="flex h-[12px] w-[12px] items-center justify-center rounded-full bg-[#febc2e] ring-[0.5px] ring-black/15 transition hover:brightness-95"
            title="Minimize"
          >
            <svg viewBox="0 0 10 10" className="h-[7px] w-[7px] opacity-0 group-hover/title:opacity-70">
              <path d="M2 5h6" stroke="#5b3a00" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <button
            onClick={() => toggleMaximize(win.id)}
            className="flex h-[12px] w-[12px] items-center justify-center rounded-full bg-[#28c840] ring-[0.5px] ring-black/15 transition hover:brightness-95"
            title="Zoom"
          >
            <svg viewBox="0 0 10 10" className="h-[7px] w-[7px] opacity-0 group-hover/title:opacity-70">
              <path d="M2.6 6.2V7.4h1.2M7.4 3.8V2.6H6.2" stroke="#063d10" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            </svg>
          </button>
        </div>
        {toolbar ? (
          <div className="flex min-w-0 flex-1 items-center" data-no-drag>
            {toolbar}
          </div>
        ) : (
          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 text-center text-[13px] font-semibold",
              dark ? "text-zinc-200" : "text-zinc-700",
              !active && "opacity-50",
            )}
          >
            {title}
          </div>
        )}
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>

      {!win.maximized &&
        handles.map((h) => (
          <div
            key={h.dir}
            onPointerDown={(e) => startResize(e, h.dir)}
            className={cn("absolute z-30", h.cls)}
          />
        ))}
    </div>
  );
}
