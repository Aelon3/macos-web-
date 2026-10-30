import { useCallback, useEffect, useState } from "react";
import { cn } from "@/utils/cn";

type Grid = number[][];

const empty = (): Grid => Array.from({ length: 4 }, () => [0, 0, 0, 0]);

function addTile(g: Grid): Grid {
  const free: [number, number][] = [];
  g.forEach((row, r) => row.forEach((v, c) => !v && free.push([r, c])));
  if (!free.length) return g;
  const [r, c] = free[Math.floor(Math.random() * free.length)];
  const n = g.map((row) => [...row]);
  n[r][c] = Math.random() < 0.9 ? 2 : 4;
  return n;
}

function slide(row: number[]): { row: number[]; gained: number } {
  const vals = row.filter(Boolean);
  const out: number[] = [];
  let gained = 0;
  for (let i = 0; i < vals.length; i++) {
    if (vals[i] === vals[i + 1]) {
      out.push(vals[i] * 2);
      gained += vals[i] * 2;
      i++;
    } else out.push(vals[i]);
  }
  while (out.length < 4) out.push(0);
  return { row: out, gained };
}

const rotate = (g: Grid): Grid => g[0].map((_, c) => g.map((row) => row[c]).reverse());

const COLORS: Record<number, string> = {
  2: "#eee4da",
  4: "#ede0c8",
  8: "#f2b179",
  16: "#f59563",
  32: "#f67c5f",
  64: "#f65e3b",
  128: "#edcf72",
  256: "#edcc61",
  512: "#edc850",
  1024: "#edc53f",
  2048: "#edc22e",
};

export default function Games() {
  const [grid, setGrid] = useState<Grid>(() => addTile(addTile(empty())));
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [over, setOver] = useState(false);

  const move = useCallback(
    (dir: "up" | "down" | "left" | "right") => {
      setGrid((prev) => {
        let g = prev.map((r) => [...r]);
        const turns = { left: 0, up: 1, right: 2, down: 3 }[dir];
        for (let i = 0; i < turns; i++) g = rotate(g);
        let gained = 0;
        g = g.map((row) => {
          const s = slide(row);
          gained += s.gained;
          return s.row;
        });
        for (let i = 0; i < (4 - turns) % 4; i++) g = rotate(g);
        if (JSON.stringify(g) === JSON.stringify(prev)) return prev;
        const next = addTile(g);
        setScore((s) => {
          const ns = s + gained;
          setBest((b) => Math.max(b, ns));
          return ns;
        });
        const full = next.every((r) => r.every(Boolean));
        if (full) {
          const stuck = next.every((r, ri) =>
            r.every((v, ci) => (ri < 3 ? v !== next[ri + 1][ci] : true) && (ci < 3 ? v !== r[ci + 1] : true)),
          );
          if (stuck) setOver(true);
        }
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const map: Record<string, "up" | "down" | "left" | "right"> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right",
      };
      if (map[e.key]) {
        e.preventDefault();
        move(map[e.key]);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [move]);

  const reset = () => {
    setGrid(addTile(addTile(empty())));
    setScore(0);
    setOver(false);
  };

  return (
    <div className="flex h-full flex-col items-center gap-4 bg-gradient-to-b from-[#faf8ef] to-[#efe6d8] p-5 text-[#776e65]">
      <div className="flex w-full max-w-[420px] items-center justify-between">
        <div>
          <div className="text-[30px] font-extrabold leading-none">2048</div>
          <div className="text-[11.5px] opacity-70">Join the tiles — use arrow keys or WASD</div>
        </div>
        <div className="flex gap-2">
          {[
            ["SCORE", score],
            ["BEST", best],
          ].map(([l, v]) => (
            <div key={l as string} className="min-w-[72px] rounded-md bg-[#bbada0] px-3 py-1 text-center text-white">
              <div className="text-[10px] font-bold tracking-wide opacity-80">{l as string}</div>
              <div className="text-[17px] font-bold leading-tight">{v as number}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative aspect-square w-full max-w-[420px] rounded-xl bg-[#bbada0] p-[10px]">
        <div className="grid h-full grid-cols-4 grid-rows-4 gap-[10px]">
          {grid.flatMap((row, r) =>
            row.map((v, c) => (
              <div
                key={`${r}-${c}`}
                className={cn(
                  "flex items-center justify-center rounded-md font-bold transition-all",
                  v ? "" : "bg-[#cdc1b4]",
                  v > 4 ? "text-white" : "text-[#776e65]",
                )}
                style={{
                  background: v ? COLORS[v] ?? "#3c3a32" : undefined,
                  fontSize: v >= 1024 ? 22 : v >= 128 ? 28 : 34,
                }}
              >
                {v || ""}
              </div>
            )),
          )}
        </div>
        {over && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-white/70 backdrop-blur-sm">
            <div className="text-2xl font-extrabold">Game over!</div>
            <button onClick={reset} className="rounded-lg bg-[#8f7a66] px-4 py-2 text-[13px] font-bold text-white">
              Try again
            </button>
          </div>
        )}
      </div>

      <div className="flex w-full max-w-[420px] items-center justify-between">
        <button onClick={reset} className="rounded-lg bg-[#8f7a66] px-4 py-2 text-[13px] font-bold text-white hover:brightness-110">
          New Game
        </button>
        <div className="grid grid-cols-3 gap-1">
          <span />
          <button onClick={() => move("up")} className="rounded bg-[#bbada0] px-3 py-1 text-white">↑</button>
          <span />
          <button onClick={() => move("left")} className="rounded bg-[#bbada0] px-3 py-1 text-white">←</button>
          <button onClick={() => move("down")} className="rounded bg-[#bbada0] px-3 py-1 text-white">↓</button>
          <button onClick={() => move("right")} className="rounded bg-[#bbada0] px-3 py-1 text-white">→</button>
        </div>
      </div>
    </div>
  );
}
