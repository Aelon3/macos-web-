import { useEffect, useMemo, useState } from "react";
import { useOS } from "@/os/store";
import { APPS } from "@/os/registry";
import { AppIcon, SearchGlyph } from "@/os/icons";
import { cn } from "@/utils/cn";

const PER_PAGE = 24;

export default function Launchpad() {
  const os = useOS();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (!os.launchpad) {
      setQ("");
      setPage(0);
    }
  }, [os.launchpad]);

  const apps = useMemo(
    () =>
      APPS.filter((a) => !a.hideInLaunchpad).filter((a) => a.name.toLowerCase().includes(q.toLowerCase())),
    [q],
  );
  const pages = Math.max(1, Math.ceil(apps.length / PER_PAGE));
  const shown = apps.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  if (!os.launchpad) return null;

  return (
    <div
      className="anim-pop-in fixed inset-0 z-[8500] flex flex-col items-center pt-12"
      style={{ background: os.wallpaper.background, backgroundSize: "cover" }}
      onClick={() => os.setLaunchpad(false)}
      onWheel={(e) => {
        if (e.deltaY > 30) setPage((p) => Math.min(pages - 1, p + 1));
        if (e.deltaY < -30) setPage((p) => Math.max(0, p - 1));
      }}
    >
      <div className="absolute inset-0 bg-black/35 backdrop-blur-[38px]" />

      <div className="relative z-10 flex w-full flex-1 flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <div className="mb-8 flex w-[280px] items-center gap-2 rounded-lg bg-white/20 px-3 py-[6px] text-white backdrop-blur-xl">
          <SearchGlyph className="h-4 w-4 opacity-80" />
          <input
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") os.setLaunchpad(false);
              if (e.key === "Enter" && shown[0]) os.openApp(shown[0].id);
            }}
            placeholder="Search"
            className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-white/60"
          />
        </div>

        <div className="grid w-full max-w-[1000px] grid-cols-4 gap-y-8 px-10 sm:grid-cols-6 md:grid-cols-8">
          {shown.map((a) => (
            <button
              key={a.id}
              onClick={() => os.openApp(a.id)}
              className="group flex flex-col items-center gap-[6px]"
            >
              <AppIcon id={a.id} className="h-[70px] w-[70px] drop-shadow-xl transition group-hover:scale-110 group-active:scale-95" />
              <span className="max-w-[92px] truncate text-[12.5px] text-white text-shadow-sm">{a.name}</span>
            </button>
          ))}
        </div>

        {!shown.length && <div className="mt-20 text-white/70">No results for “{q}”</div>}

        <div className="flex-1" />
        <div className="mb-8 flex items-center gap-2">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={cn("h-[7px] w-[7px] rounded-full transition", i === page ? "bg-white" : "bg-white/35")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
