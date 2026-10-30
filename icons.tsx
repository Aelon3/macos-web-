import type { ReactNode } from "react";

const S = ({ children, vb = "0 0 24 24" }: { children: ReactNode; vb?: string }) => (
  <svg viewBox={vb} className="h-[58%] w-[58%]" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

interface TileProps {
  bg: string;
  children?: ReactNode;
  inner?: ReactNode;
  pad?: boolean;
}

function Tile({ bg, children, inner }: TileProps) {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[23%]"
      style={{
        background: bg,
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,.45), inset 0 -1px 0 rgba(0,0,0,.18), 0 2px 6px rgba(0,0,0,.28)",
      }}
    >
      {inner}
      {children}
    </div>
  );
}

export const ICON_META: Record<string, { bg: string }> = {};

export function AppIcon({ id, className = "" }: { id: string; className?: string }) {
  return <div className={className}>{renderIcon(id)}</div>;
}

function renderIcon(id: string): ReactNode {
  switch (id) {
    case "finder":
      return (
        <Tile bg="linear-gradient(180deg,#39b3f8 0%,#1676e8 100%)">
          <div className="absolute inset-0 flex">
            <div className="h-full w-1/2" style={{ background: "linear-gradient(180deg,#e8f4ff,#bcd9f5)" }} />
          </div>
          <svg viewBox="0 0 48 48" className="relative h-full w-full">
            <path d="M15 19v5" stroke="#1b2838" strokeWidth={2.6} strokeLinecap="round" />
            <path d="M33 19v5" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" />
            <path d="M17 32c2.6 2.2 5.2 3.2 7 3.2s4.4-1 7-3.2" stroke="#1b2838" strokeWidth={2.4} strokeLinecap="round" fill="none" />
          </svg>
        </Tile>
      );
    case "launchpad":
      return (
        <Tile bg="linear-gradient(180deg,#fdfdfd 0%,#dfe3ea 100%)">
          <div className="grid grid-cols-3 gap-[9%] p-[20%]">
            {["#ff6a5a", "#ffb02e", "#58d16a", "#4aa8ff", "#b07cff", "#ff79b8", "#5ad1c6", "#ffd24a", "#9aa3ad"].map(
              (c, i) => (
                <span key={i} className="block aspect-square w-full rounded-full" style={{ background: c }} />
              ),
            )}
          </div>
        </Tile>
      );
    case "safari":
      return (
        <Tile bg="radial-gradient(circle at 50% 42%, #ffffff 0 24%, #e9f4ff 25%, #1b9df0 48%, #0b63c9 100%)">
          <svg viewBox="0 0 48 48" className="h-full w-full">
            <circle cx="24" cy="24" r="17" fill="none" stroke="rgba(255,255,255,.75)" strokeWidth="1.4" />
            {Array.from({ length: 24 }).map((_, i) => {
              const a = (i * Math.PI) / 12;
              return (
                <line
                  key={i}
                  x1={24 + Math.cos(a) * 14.4}
                  y1={24 + Math.sin(a) * 14.4}
                  x2={24 + Math.cos(a) * (i % 2 ? 15.6 : 16.6)}
                  y2={24 + Math.sin(a) * (i % 2 ? 15.6 : 16.6)}
                  stroke="rgba(255,255,255,.9)"
                  strokeWidth="1"
                />
              );
            })}
            <polygon points="33,15 21.5,21.5 15,33 26.5,26.5" fill="#ff4b3e" />
            <polygon points="15,33 26.5,26.5 21.5,21.5" fill="#f4f6f8" />
          </svg>
        </Tile>
      );
    case "mail":
      return (
        <Tile bg="linear-gradient(180deg,#45c4ff 0%,#1176f0 100%)">
          <S vb="0 0 24 24">
            <rect x="2.6" y="5.5" width="18.8" height="13" rx="2.4" />
            <path d="M3 7.6 12 14l9-6.4" />
          </S>
        </Tile>
      );
    case "messages":
      return (
        <Tile bg="linear-gradient(180deg,#6ff07a 0%,#17c13e 100%)">
          <S vb="0 0 24 24">
            <path d="M21 11.6c0 4.2-4 7.6-9 7.6-1 0-2-.15-2.9-.4L4 20.5l1.3-3.3C3.85 15.8 3 13.8 3 11.6 3 7.4 7 4 12 4s9 3.4 9 7.6Z" fill="white" stroke="none" />
          </S>
        </Tile>
      );
    case "maps":
      return (
        <Tile bg="linear-gradient(180deg,#e8f7e0 0%,#bfe7c9 100%)">
          <svg viewBox="0 0 48 48" className="h-full w-full">
            <rect width="48" height="48" fill="#dff0dc" />
            <path d="M0 30h48v6H0z" fill="#a8dbb3" />
            <path d="M8 0h5v48H8z" fill="#fff" opacity=".9" />
            <path d="M0 14h48v4H0z" fill="#fff" opacity=".9" />
            <path d="M28 0l8 48" stroke="#ffd34a" strokeWidth="4" fill="none" />
            <circle cx="30" cy="20" r="7" fill="#ff4b3e" />
            <circle cx="30" cy="20" r="2.6" fill="#fff" />
          </svg>
        </Tile>
      );
    case "photos":
      return (
        <Tile bg="linear-gradient(180deg,#ffffff 0%,#eef0f4 100%)">
          <svg viewBox="0 0 48 48" className="h-[76%] w-[76%]">
            {[
              ["#ff5a5a", 0],
              ["#ffb02e", 45],
              ["#ffe24a", 90],
              ["#5fd36a", 135],
              ["#39c6f0", 180],
              ["#4a7bff", 225],
              ["#9b5cf6", 270],
              ["#ff5ab0", 315],
            ].map(([c, a], i) => (
              <ellipse
                key={i}
                cx="24"
                cy="14.5"
                rx="6.2"
                ry="10.5"
                fill={c as string}
                opacity="0.78"
                transform={`rotate(${a} 24 24)`}
              />
            ))}
          </svg>
        </Tile>
      );
    case "notes":
      return (
        <Tile bg="linear-gradient(180deg,#ffffff 0%,#ffffff 22%,#ffe066 22%,#ffd12e 100%)">
          <svg viewBox="0 0 48 48" className="h-full w-full">
            <path d="M0 11h48" stroke="#e0a81e" strokeWidth="1" />
            {[20, 26, 32, 38].map((y) => (
              <path key={y} d={`M9 ${y}h30`} stroke="rgba(120,85,0,.35)" strokeWidth="2" strokeLinecap="round" />
            ))}
          </svg>
        </Tile>
      );
    case "music":
      return (
        <Tile bg="linear-gradient(180deg,#fc5c7d 0%,#f0245c 60%,#e01040 100%)">
          <S vb="0 0 24 24">
            <path d="M9 18V6.6l9-1.9V16" stroke="white" strokeWidth="1.6" fill="none" />
            <circle cx="6.8" cy="18" r="2.4" fill="white" stroke="none" />
            <circle cx="15.8" cy="16" r="2.4" fill="white" stroke="none" />
          </S>
        </Tile>
      );
    case "appstore":
      return (
        <Tile bg="linear-gradient(180deg,#3fb9ff 0%,#0a6ff0 100%)">
          <S vb="0 0 24 24">
            <path d="M7 16.5 12.2 7.3 17.4 16.5M5 16.5h3.4M15.4 16.5H19M9.6 13.2h5.2" strokeWidth="1.7" />
          </S>
        </Tile>
      );
    case "code":
      return (
        <Tile bg="linear-gradient(180deg,#2c6fd1 0%,#1b4f9e 100%)">
          <S vb="0 0 24 24">
            <path d="m9 8-5 4 5 4M15 8l5 4-5 4" strokeWidth="1.9" />
          </S>
        </Tile>
      );
    case "terminal":
      return (
        <Tile bg="linear-gradient(180deg,#43474d 0%,#15171a 100%)">
          <svg viewBox="0 0 48 48" className="h-full w-full">
            <rect x="3" y="3" width="42" height="42" rx="10" fill="#111317" />
            <rect x="3" y="3" width="42" height="9" rx="5" fill="#2c3036" />
            <path d="m12 22 6 5-6 5" stroke="#4dff88" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 33h12" stroke="#4dff88" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </Tile>
      );
    case "calculator":
      return (
        <Tile bg="linear-gradient(180deg,#5c6068 0%,#2b2e34 100%)">
          <svg viewBox="0 0 48 48" className="h-full w-full">
            <rect x="9" y="8" width="30" height="9" rx="2.5" fill="#1d1f24" />
            <text x="35" y="15.3" textAnchor="end" fill="#8fe39a" fontSize="7" fontFamily="monospace">
              0
            </text>
            {[0, 1, 2].map((r) =>
              [0, 1, 2].map((c) => (
                <rect key={`${r}${c}`} x={9 + c * 8} y={21 + r * 7} width="6.4" height="5.6" rx="1.6" fill="#8d9199" />
              )),
            )}
            <rect x="33" y="21" width="6" height="19.6" rx="1.8" fill="#ff9f0a" />
          </svg>
        </Tile>
      );
    case "settings":
      return (
        <Tile bg="linear-gradient(180deg,#9aa0a9 0%,#5c6169 100%)">
          <svg viewBox="0 0 48 48" className="h-[70%] w-[70%]">
            <path
              d="M24 15.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm0 5.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"
              fill="#f1f2f4"
            />
            {Array.from({ length: 10 }).map((_, i) => {
              const a = (i * Math.PI) / 5;
              return (
                <rect
                  key={i}
                  x="22"
                  y="5.5"
                  width="4"
                  height="8"
                  rx="1.6"
                  fill="#f1f2f4"
                  transform={`rotate(${(a * 180) / Math.PI} 24 24)`}
                />
              );
            })}
          </svg>
        </Tile>
      );
    case "calendar": {
      const d = new Date();
      return (
        <Tile bg="linear-gradient(180deg,#ffffff 0%,#f0f1f4 100%)">
          <div className="absolute inset-x-0 top-0 flex h-[26%] items-center justify-center bg-[#ff3b30] text-[26%] font-semibold uppercase tracking-wide text-white">
            {d.toLocaleDateString(undefined, { month: "short" })}
          </div>
          <span className="mt-[16%] text-[46%] font-light leading-none text-[#1c1c1e]">{d.getDate()}</span>
        </Tile>
      );
    }
    case "weather":
      return (
        <Tile bg="linear-gradient(180deg,#4aa8ff 0%,#1264d6 100%)">
          <svg viewBox="0 0 48 48" className="h-full w-full">
            <circle cx="19" cy="19" r="7" fill="#ffd84a" />
            <path
              d="M17 36c-4 0-7-2.8-7-6.4 0-3.3 2.6-6 6-6.4 1-3.4 4.2-5.8 8-5.8 4.6 0 8.4 3.5 8.4 7.9v.3c3 .4 5.2 2.8 5.2 5.6 0 3-2.6 5.5-5.8 5.5H17Z"
              fill="#fff"
            />
          </svg>
        </Tile>
      );
    case "trash":
      return (
        <div className="relative flex h-full w-full items-end justify-center">
          <svg viewBox="0 0 48 48" className="h-full w-full">
            <path d="M14 6h20" stroke="rgba(230,240,255,.85)" strokeWidth="2.4" strokeLinecap="round" />
            <path
              d="M11 13h26l-2.4 28.2A3.4 3.4 0 0 1 31.2 44H16.8a3.4 3.4 0 0 1-3.4-2.8L11 13Z"
              fill="rgba(215,232,248,.42)"
              stroke="rgba(235,245,255,.85)"
              strokeWidth="1.6"
            />
            {[18, 24, 30].map((x) => (
              <path key={x} d={`M${x} 18v20`} stroke="rgba(245,250,255,.65)" strokeWidth="1.5" strokeLinecap="round" />
            ))}
          </svg>
        </div>
      );
    case "games":
      return (
        <Tile bg="linear-gradient(180deg,#a86bff 0%,#5b28c9 100%)">
          <S vb="0 0 24 24">
            <path d="M7.5 9h9a4.5 4.5 0 0 1 4.4 5.4l-.5 2.4A2.6 2.6 0 0 1 16 18l-1.4-1.6h-5.2L8 18a2.6 2.6 0 0 1-4.4-1.2l-.5-2.4A4.5 4.5 0 0 1 7.5 9Z" fill="white" stroke="none" />
            <path d="M7 12.2v2.2M5.9 13.3h2.2" stroke="#6b2bd1" strokeWidth="1.5" />
            <circle cx="16" cy="12.6" r="1" fill="#6b2bd1" stroke="none" />
            <circle cx="17.8" cy="14.4" r="1" fill="#6b2bd1" stroke="none" />
          </S>
        </Tile>
      );
    case "reminders":
      return (
        <Tile bg="linear-gradient(180deg,#ffffff 0%,#eceef2 100%)">
          <div className="flex w-[62%] flex-col gap-[10%]">
            {["#ff6a5a", "#4aa8ff", "#ffb02e"].map((c, i) => (
              <div key={i} className="flex items-center gap-[8%]">
                <span className="aspect-square w-[22%] rounded-full" style={{ background: c }} />
                <span className="h-[12%] min-h-[2px] flex-1 rounded-full bg-[#c7ccd4]" />
              </div>
            ))}
          </div>
        </Tile>
      );
    case "preview":
      return (
        <Tile bg="linear-gradient(180deg,#ffffff 0%,#e9ecf1 100%)">
          <svg viewBox="0 0 48 48" className="h-full w-full">
            <rect x="11" y="7" width="26" height="34" rx="3" fill="#fff" stroke="#c3c8d0" strokeWidth="1.4" />
            <circle cx="21" cy="19" r="4" fill="#ffd34a" />
            <path d="M14 34l7-9 5 6 4-4 4 7H14Z" fill="#6cc46f" />
          </svg>
        </Tile>
      );
    case "about":
      return (
        <Tile bg="linear-gradient(180deg,#d8dbe1 0%,#9fa5ae 100%)">
          <svg viewBox="0 0 24 24" className="h-[62%] w-[62%]" fill="#2a2d33">
            <path d="M16.2 12.6c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-2.9-.8-1.5 0-2.9.9-3.7 2.2-1.6 2.7-.4 6.8 1.1 9 .8 1.1 1.7 2.3 2.9 2.2 1.1 0 1.6-.7 3-.7s1.8.7 3 .7c1.2 0 2-1.1 2.8-2.2.9-1.3 1.2-2.5 1.2-2.6-.1 0-2.4-.9-2.4-3.5ZM14 5.7c.6-.8 1-1.8.9-2.9-.9 0-2 .6-2.6 1.4-.6.7-1.1 1.7-.9 2.7 1 .1 2-.5 2.6-1.2Z" />
          </svg>
        </Tile>
      );
    default:
      return (
        <Tile bg="linear-gradient(180deg,#b9bec6 0%,#7a8089 100%)">
          <S>
            <circle cx="12" cy="12" r="7" />
          </S>
        </Tile>
      );
  }
}

/* ------------ system / UI glyphs ------------- */
export const AppleLogo = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M16.2 12.6c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-2.9-.8-1.5 0-2.9.9-3.7 2.2-1.6 2.7-.4 6.8 1.1 9 .8 1.1 1.7 2.3 2.9 2.2 1.1 0 1.6-.7 3-.7s1.8.7 3 .7c1.2 0 2-1.1 2.8-2.2.9-1.3 1.2-2.5 1.2-2.6-.1 0-2.4-.9-2.4-3.5ZM14 5.7c.6-.8 1-1.8.9-2.9-.9 0-2 .6-2.6 1.4-.6.7-1.1 1.7-.9 2.7 1 .1 2-.5 2.6-1.2Z" />
  </svg>
);

export const WifiGlyph = ({ on = true, className = "h-4 w-4" }: { on?: boolean; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round">
    <path d="M2.5 9.2a14 14 0 0 1 19 0" opacity={on ? 1 : 0.3} />
    <path d="M6 12.8a9 9 0 0 1 12 0" opacity={on ? 1 : 0.3} />
    <path d="M9.4 16.3a4.2 4.2 0 0 1 5.2 0" opacity={on ? 1 : 0.3} />
    <circle cx="12" cy="19.4" r="1.1" fill="currentColor" stroke="none" />
    {!on && <path d="M3 3l18 18" strokeWidth={1.6} />}
  </svg>
);

export const BatteryGlyph = ({ level, charging }: { level: number; charging: boolean }) => (
  <div className="flex items-center gap-1">
    <div className="relative h-[13px] w-[25px] rounded-[4px] border border-current opacity-90">
      <div
        className="absolute inset-y-[1.5px] left-[1.5px] rounded-[2px]"
        style={{
          width: `calc(${Math.max(4, level)}% - 3px)`,
          background: charging ? "#30d158" : level < 20 ? "#ff453a" : "currentColor",
        }}
      />
      {charging && (
        <svg viewBox="0 0 24 24" className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2" fill="#0b3d17">
          <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
        </svg>
      )}
    </div>
    <div className="h-[5px] w-[2px] rounded-r-sm bg-current opacity-60" />
  </div>
);

export const SearchGlyph = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
);

export const ControlCenterGlyph = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
    <rect x="3" y="3" width="18" height="8" rx="4" />
    <rect x="3" y="13" width="18" height="8" rx="4" />
    <circle cx="9" cy="7" r="1.8" fill="currentColor" />
    <circle cx="15" cy="17" r="1.8" fill="currentColor" />
  </svg>
);

export const Chevron = ({ dir = "right", className = "h-4 w-4" }: { dir?: "left" | "right" | "up" | "down"; className?: string }) => {
  const rot = { right: 0, left: 180, up: -90, down: 90 }[dir];
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${rot}deg)` }}>
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
};
