import { useMemo, useState } from "react";
import { useOS } from "@/os/store";
import { cn } from "@/utils/cn";
import { Chevron, SearchGlyph } from "@/os/icons";

type Node = {
  name: string;
  kind: "folder" | "file";
  size?: string;
  date?: string;
  color?: string;
  children?: Node[];
  app?: string;
};

const FS: Record<string, Node[]> = {
  Desktop: [
    { name: "Screenshot 2026-03-14.png", kind: "file", size: "2.4 MB", date: "Mar 14, 2026" },
    { name: "Project Brief.pdf", kind: "file", size: "840 KB", date: "Mar 11, 2026" },
    { name: "Renders", kind: "folder", children: [] },
  ],
  Documents: [
    { name: "Resume.pages", kind: "file", size: "128 KB", date: "Feb 2, 2026" },
    { name: "Budget 2026.numbers", kind: "file", size: "96 KB", date: "Jan 19, 2026" },
    {
      name: "Work",
      kind: "folder",
      children: [
        { name: "Q1 Report.key", kind: "file", size: "12.1 MB", date: "Mar 1, 2026" },
        { name: "Roadmap.md", kind: "file", size: "7 KB", date: "Mar 3, 2026" },
      ],
    },
  ],
  Downloads: [
    { name: "macos-web.dmg", kind: "file", size: "1.2 GB", date: "Today" },
    { name: "wallpapers.zip", kind: "file", size: "318 MB", date: "Yesterday" },
    { name: "invoice-0391.pdf", kind: "file", size: "212 KB", date: "Mar 9, 2026" },
  ],
  Applications: [
    { name: "Safari", kind: "file", app: "safari" },
    { name: "Mail", kind: "file", app: "mail" },
    { name: "Notes", kind: "file", app: "notes" },
    { name: "Terminal", kind: "file", app: "terminal" },
    { name: "Music", kind: "file", app: "music" },
    { name: "Photos", kind: "file", app: "photos" },
    { name: "Calculator", kind: "file", app: "calculator" },
    { name: "System Settings", kind: "file", app: "settings" },
  ],
  Pictures: [
    { name: "Sunset.heic", kind: "file", size: "4.1 MB", date: "Mar 2, 2026" },
    { name: "Mountains.heic", kind: "file", size: "5.6 MB", date: "Feb 24, 2026" },
    { name: "Family", kind: "folder", children: [] },
  ],
  Movies: [{ name: "Demo Reel.mov", kind: "file", size: "740 MB", date: "Jan 8, 2026" }],
  Music: [{ name: "Playlists", kind: "folder", children: [] }],
  AirDrop: [],
  Recents: [
    { name: "Roadmap.md", kind: "file", size: "7 KB", date: "Today" },
    { name: "macos-web.dmg", kind: "file", size: "1.2 GB", date: "Today" },
    { name: "Screenshot 2026-03-14.png", kind: "file", size: "2.4 MB", date: "Today" },
  ],
  iCloud: [
    { name: "Shared", kind: "folder", children: [] },
    { name: "Archive 2025", kind: "folder", children: [] },
  ],
  "Macintosh HD": [
    { name: "Applications", kind: "folder", children: [] },
    { name: "Library", kind: "folder", children: [] },
    { name: "System", kind: "folder", children: [] },
    { name: "Users", kind: "folder", children: [{ name: "alex", kind: "folder", children: [] }] },
    { name: "VolumeInfo.plist", kind: "file", size: "4 KB", date: "Mar 1, 2026" },
  ],
  Network: [
    { name: "Office NAS", kind: "folder", children: [] },
    { name: "Time Capsule", kind: "folder", children: [] },
  ],
};

const SIDEBAR = [
  {
    label: "Favorites",
    items: ["AirDrop", "Recents", "Applications", "Desktop", "Documents", "Downloads"],
  },
  { label: "iCloud", items: ["iCloud"] },
  { label: "Locations", items: ["Macintosh HD", "Network"] },
];

function FileGlyph({ node }: { node: Node }) {
  if (node.kind === "folder")
    return (
      <svg viewBox="0 0 48 48" className="h-full w-full drop-shadow-sm">
        <path d="M4 14a3 3 0 0 1 3-3h11l4 4h19a3 3 0 0 1 3 3v19a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V14Z" fill="#6fc3f5" />
        <path d="M4 18h40v19a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V18Z" fill="#54aeea" />
      </svg>
    );
  const ext = node.name.split(".").pop() ?? "";
  const tint =
    { png: "#f06ea9", heic: "#f06ea9", pdf: "#ff5a5a", zip: "#a1a7b3", dmg: "#8d7bff", md: "#4aa8ff", mov: "#6a5cff" }[
      ext
    ] ?? "#9aa1ad";
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full drop-shadow-sm">
      <path d="M11 5h17l9 9v29a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" fill="#fff" stroke="#d0d5dd" strokeWidth="1.2" />
      <path d="M28 5l9 9h-9V5Z" fill="#e6eaef" />
      <rect x="9" y="28" width="28" height="11" rx="2" fill={tint} />
      <text x="23" y="36.4" textAnchor="middle" fontSize="7.4" fill="#fff" fontFamily="Inter, sans-serif" fontWeight="600">
        {(ext || "txt").toUpperCase().slice(0, 4)}
      </text>
    </svg>
  );
}

export default function Finder() {
  const { dark, openApp, addToTrash, accent } = useOS();
  const [path, setPath] = useState<string[]>(["Documents"]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<string[][]>([]);

  const items = useMemo(() => {
    let list = FS[path[0]] ?? [];
    for (let i = 1; i < path.length; i++) {
      const next = list.find((n) => n.name === path[i]);
      list = next?.children ?? [];
    }
    if (query) list = list.filter((n) => n.name.toLowerCase().includes(query.toLowerCase()));
    return list;
  }, [path, query]);

  const go = (p: string[]) => {
    setHistory((h) => [...h, path]);
    setPath(p);
    setSelected(null);
  };

  const open = (n: Node) => {
    if (n.kind === "folder") go([...path, n.name]);
    else if (n.app) openApp(n.app);
    else if (n.name.endsWith(".png") || n.name.endsWith(".heic")) openApp("photos");
    else if (n.name.endsWith(".md")) openApp("code");
    else openApp("preview", { file: n.name });
  };

  return (
    <div className={cn("flex h-full w-full", dark ? "bg-[#1e1f24]" : "bg-white")}>
      {/* sidebar */}
      <div
        className={cn(
          "mac-scroll w-[190px] shrink-0 overflow-y-auto border-r px-2 py-2 text-[13px]",
          dark ? "border-black/40 bg-[#26272c]/90 text-zinc-300" : "border-black/10 bg-[#ececee]/80 text-zinc-700",
        )}
      >
        {SIDEBAR.map((group) => (
          <div key={group.label} className="mb-3">
            <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide opacity-50">
              {group.label}
            </div>
            {group.items.map((it) => (
              <button
                key={it}
                onClick={() => (FS[it] ? go([it]) : null)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-[5px] text-left transition",
                  path[0] === it ? "text-white" : "hover:bg-black/5 dark:hover:bg-white/5",
                )}
                style={path[0] === it ? { background: accent } : undefined}
              >
                <span className="text-[13px]" style={{ color: path[0] === it ? "#fff" : accent }}>
                  {it === "AirDrop" ? "◉" : it === "Recents" ? "🕘" : it === "Applications" ? "🅰" : "📁"}
                </span>
                <span className="truncate">{it}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div
          className={cn(
            "flex h-[44px] shrink-0 items-center gap-2 border-b px-3",
            dark ? "border-black/40 bg-[#2a2c32]" : "border-black/10 bg-[#f6f6f7]",
          )}
        >
          <button
            onClick={() => {
              const prev = history[history.length - 1];
              if (prev) {
                setHistory((h) => h.slice(0, -1));
                setPath(prev);
              }
            }}
            className="rounded p-1 opacity-60 hover:bg-black/10 disabled:opacity-25"
            disabled={!history.length}
          >
            <Chevron dir="left" className="h-4 w-4" />
          </button>
          <button className="rounded p-1 opacity-25">
            <Chevron dir="right" className="h-4 w-4" />
          </button>
          <div className="ml-1 truncate text-[13px] font-semibold">{path[path.length - 1]}</div>
          <div className="flex-1" />
          <div className={cn("flex rounded-md p-[2px]", dark ? "bg-white/10" : "bg-black/5")}>
            {(["grid", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "rounded px-2 py-[2px] text-[12px]",
                  view === v && (dark ? "bg-white/15" : "bg-white shadow-sm"),
                )}
              >
                {v === "grid" ? "▦" : "☰"}
              </button>
            ))}
          </div>
          <div
            className={cn(
              "flex items-center gap-1 rounded-md px-2 py-1",
              dark ? "bg-white/10" : "bg-black/[0.06]",
            )}
          >
            <SearchGlyph className="h-3.5 w-3.5 opacity-50" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-24 bg-transparent text-[12px] outline-none placeholder:opacity-50"
            />
          </div>
        </div>

        <div className="mac-scroll flex-1 overflow-y-auto p-4" onClick={() => setSelected(null)}>
          {items.length === 0 && (
            <div className="flex h-full items-center justify-center text-sm opacity-40">
              This folder is empty
            </div>
          )}
          {view === "grid" ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-2">
              {items.map((n) => (
                <button
                  key={n.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(n.name);
                  }}
                  onDoubleClick={() => open(n)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg p-2 text-center transition",
                    selected === n.name && "bg-black/10 dark:bg-white/15",
                  )}
                >
                  <div className="h-12 w-12">
                    <FileGlyph node={n} />
                  </div>
                  <span
                    className={cn(
                      "line-clamp-2 rounded px-1 text-[11.5px] leading-tight",
                      selected === n.name ? "text-white" : dark ? "text-zinc-200" : "text-zinc-800",
                    )}
                    style={selected === n.name ? { background: accent } : undefined}
                  >
                    {n.name}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <table className="w-full text-[12.5px]">
              <thead className="opacity-50">
                <tr className="border-b border-current/10 text-left">
                  <th className="py-1 font-medium">Name</th>
                  <th className="font-medium">Date Modified</th>
                  <th className="font-medium">Size</th>
                </tr>
              </thead>
              <tbody>
                {items.map((n, i) => (
                  <tr
                    key={n.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(n.name);
                    }}
                    onDoubleClick={() => open(n)}
                    className={cn(
                      "cursor-default",
                      selected === n.name ? "text-white" : i % 2 ? (dark ? "bg-white/[0.03]" : "bg-black/[0.02]") : "",
                    )}
                    style={selected === n.name ? { background: accent } : undefined}
                  >
                    <td className="flex items-center gap-2 py-[5px]">
                      <span className="h-4 w-4">
                        <FileGlyph node={n} />
                      </span>
                      {n.name}
                    </td>
                    <td>{n.date ?? "—"}</td>
                    <td>{n.kind === "folder" ? "--" : (n.size ?? "—")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div
          className={cn(
            "flex h-[26px] shrink-0 items-center justify-center gap-3 border-t text-[11px]",
            dark ? "border-black/40 bg-[#26272c] text-zinc-400" : "border-black/10 bg-[#f6f6f7] text-zinc-500",
          )}
        >
          <span>{items.length} items</span>
          <span>·</span>
          <span>284.6 GB available</span>
          {selected && (
            <button
              onClick={() => {
                addToTrash(selected);
                setSelected(null);
              }}
              className="rounded px-2 py-[1px] text-[11px] hover:bg-black/10"
            >
              Move to Trash
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function TrashApp() {
  const { trash, emptyTrash, dark } = useOS();
  return (
    <div className={cn("flex h-full flex-col", dark ? "bg-[#1e1f24] text-zinc-200" : "bg-white text-zinc-800")}>
      <div
        className={cn(
          "flex h-11 items-center justify-between border-b px-4 text-[13px] font-semibold",
          dark ? "border-black/40 bg-[#2a2c32]" : "border-black/10 bg-[#f6f6f7]",
        )}
      >
        <span>Trash — {trash.length} items</span>
        <button
          onClick={emptyTrash}
          className={cn(
            "rounded-md px-3 py-1 text-[12px] font-medium",
            dark ? "bg-white/10 hover:bg-white/15" : "bg-black/[0.06] hover:bg-black/10",
          )}
        >
          Empty
        </button>
      </div>
      <div className="mac-scroll flex-1 overflow-y-auto p-5">
        {trash.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 opacity-40">
            <span className="text-4xl">🗑️</span>
            <span className="text-sm">Trash is empty</span>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-3">
            {trash.map((t, i) => (
              <div key={i} className="flex flex-col items-center gap-1 text-center">
                <div className="h-12 w-12">
                  <FileGlyph node={{ name: t, kind: t.includes(".") ? "file" : "folder" }} />
                </div>
                <span className="text-[11.5px] leading-tight opacity-80">{t}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
