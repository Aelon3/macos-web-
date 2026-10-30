import { useOS } from "@/os/store";
import { getApp } from "@/os/registry";
import { AppIcon } from "@/os/icons";
import { cn } from "@/utils/cn";

export default function MissionControl() {
  const os = useOS();
  if (!os.mission) return null;

  const wins = os.windows;

  return (
    <div
      className="anim-fade-in fixed inset-0 z-[8600] flex flex-col items-center gap-6 px-10 pt-16"
      style={{ background: os.wallpaper.background }}
      onClick={() => os.setMission(false)}
    >
      <div className="absolute inset-0 bg-black/45 backdrop-blur-2xl" />

      <div className="relative z-10 flex w-full max-w-5xl gap-3">
        {["Desktop 1", "Desktop 2"].map((d, i) => (
          <div
            key={d}
            className={cn(
              "flex h-16 flex-1 items-center justify-center rounded-lg border text-[12px] text-white/80",
              i === 0 ? "border-white/70 bg-white/15" : "border-white/20 bg-white/5",
            )}
            style={i === 0 ? { background: `${os.wallpaper.background}`, backgroundSize: "cover" } : undefined}
          >
            {d}
          </div>
        ))}
        <button className="flex h-16 w-16 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-2xl text-white/70 hover:bg-white/15">
          +
        </button>
      </div>

      <div className="relative z-10 grid w-full max-w-5xl grid-cols-2 gap-6 md:grid-cols-3">
        {wins.map((w) => {
          const app = getApp(w.appId);
          return (
            <button
              key={w.id}
              onClick={(e) => {
                e.stopPropagation();
                os.focusWindow(w.id);
                os.setMission(false);
              }}
              className="group flex flex-col items-center gap-2"
            >
              <div className="w-full overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-white/30 transition group-hover:scale-[1.03] dark:bg-zinc-800">
                <div className="flex h-5 items-center gap-1 bg-zinc-200 px-2 dark:bg-zinc-700">
                  <span className="h-[7px] w-[7px] rounded-full bg-[#ff5f57]" />
                  <span className="h-[7px] w-[7px] rounded-full bg-[#febc2e]" />
                  <span className="h-[7px] w-[7px] rounded-full bg-[#28c840]" />
                </div>
                <div className="flex h-28 items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-200 dark:from-zinc-700 dark:to-zinc-900">
                  <AppIcon id={w.appId} className="h-12 w-12 opacity-90" />
                </div>
              </div>
              <span className="text-[12.5px] text-white/90">{app?.name}</span>
            </button>
          );
        })}
        {!wins.length && (
          <div className="col-span-full py-16 text-center text-[14px] text-white/60">
            No open windows — press Esc to return to the desktop
          </div>
        )}
      </div>
    </div>
  );
}
