import { useEffect, useMemo, useState } from "react";
import { useOS } from "@/os/store";
import { APPS } from "@/os/registry";
import { AppIcon, SearchGlyph } from "@/os/icons";
import { cn } from "@/utils/cn";

interface Result {
  id: string;
  label: string;
  sub: string;
  kind: "app" | "calc" | "web" | "file" | "action";
  action: () => void;
}

const FILES = ["Project Brief.pdf", "Resume.pages", "Roadmap.md", "Budget 2026.numbers", "Demo Reel.mov"];

function evaluate(expr: string): string | null {
  if (!/^[-+*/(). \d%^]+$/.test(expr) || !/\d/.test(expr) || !/[-+*/]/.test(expr)) return null;
  try {
    // eslint-disable-next-line no-new-func
    const v = Function(`"use strict";return (${expr.replace(/\^/g, "**")})`)();
    return typeof v === "number" && isFinite(v) ? String(parseFloat(v.toPrecision(12))) : null;
  } catch {
    return null;
  }
}

export default function Spotlight() {
  const os = useOS();
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!os.spotlight) {
      setQ("");
      setIdx(0);
    }
  }, [os.spotlight]);

  const results = useMemo<Result[]>(() => {
    const out: Result[] = [];
    const calc = evaluate(q.trim());
    if (calc !== null)
      out.push({
        id: "calc",
        label: `${q.trim()} = ${calc}`,
        sub: "Calculator",
        kind: "calc",
        action: () => os.openApp("calculator"),
      });
    APPS.filter((a) => !a.hideInLaunchpad || a.id === "about")
      .filter((a) => a.name.toLowerCase().includes(q.toLowerCase()))
      .forEach((a) =>
        out.push({ id: a.id, label: a.name, sub: "Application", kind: "app", action: () => os.openApp(a.id) }),
      );
    if (q.trim())
      FILES.filter((f) => f.toLowerCase().includes(q.toLowerCase())).forEach((f) =>
        out.push({ id: f, label: f, sub: "Document", kind: "file", action: () => os.openApp("preview", { file: f }) }),
      );
    if (q.trim()) {
      out.push({
        id: "web",
        label: `Search the web for “${q}”`,
        sub: "Safari",
        kind: "web",
        action: () => os.openApp("safari"),
      });
      ["Sleep", "Restart", "Lock Screen", "Empty Trash"].filter((a) => a.toLowerCase().includes(q.toLowerCase())).forEach((a) =>
        out.push({
          id: a,
          label: a,
          sub: "System Action",
          kind: "action",
          action: () => {
            if (a === "Sleep") os.setPhase("sleep");
            if (a === "Restart") os.setPhase("restart");
            if (a === "Lock Screen") os.setPhase("lock");
            if (a === "Empty Trash") os.emptyTrash();
          },
        }),
      );
    }
    return out.slice(0, 9);
  }, [q, os]);

  if (!os.spotlight) return null;

  const pick = (r?: Result) => {
    if (!r) return;
    r.action();
    os.setSpotlight(false);
  };

  return (
    <div
      className="fixed inset-0 z-[8800] flex items-start justify-center bg-black/20 pt-[16vh] backdrop-blur-[2px]"
      onClick={() => os.setSpotlight(false)}
    >
      <div
        className="anim-pop-in w-[620px] max-w-[92vw] overflow-hidden rounded-2xl border border-white/25 bg-white/70 shadow-2xl backdrop-blur-3xl dark:bg-zinc-800/70"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <SearchGlyph className="h-6 w-6 opacity-40" />
          <input
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setIdx(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") os.setSpotlight(false);
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setIdx((i) => Math.min(results.length - 1, i + 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setIdx((i) => Math.max(0, i - 1));
              }
              if (e.key === "Enter") pick(results[idx]);
            }}
            placeholder="Spotlight Search"
            className="flex-1 bg-transparent text-[22px] font-light text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-white"
          />
        </div>

        {results.length > 0 && (
          <div className="max-h-[52vh] overflow-y-auto border-t border-black/10 p-2">
            {results.map((r, i) => (
              <button
                key={r.id + i}
                onMouseEnter={() => setIdx(i)}
                onClick={() => pick(r)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left",
                  i === idx ? "text-white" : "text-zinc-800 dark:text-zinc-100",
                )}
                style={i === idx ? { background: os.accent } : undefined}
              >
                {r.kind === "app" ? (
                  <AppIcon id={r.id} className="h-7 w-7 shrink-0" />
                ) : (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-black/10 text-[14px]">
                    {{ calc: "=", web: "🌐", file: "📄", action: "⚙️" }[r.kind as "calc" | "web" | "file" | "action"]}
                  </span>
                )}
                <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium">{r.label}</span>
                <span className={cn("text-[11.5px]", i === idx ? "opacity-80" : "opacity-45")}>{r.sub}</span>
              </button>
            ))}
          </div>
        )}
        {!results.length && q && (
          <div className="border-t border-black/10 p-6 text-center text-[13px] opacity-50">No results</div>
        )}
      </div>
    </div>
  );
}
