import { useMemo, useRef, useState } from "react";
import { useOS } from "@/os/store";
import { cn } from "@/utils/cn";

/* ----------------------------- CALENDAR ----------------------------- */
const EVENTS: Record<number, { t: string; time: string; color: string }[]> = {
  3: [{ t: "Standup", time: "9:30 AM", color: "#ff453a" }],
  7: [
    { t: "Design Review", time: "3:00 PM", color: "#0a84ff" },
    { t: "1:1 with Sam", time: "4:30 PM", color: "#30d158" },
  ],
  12: [{ t: "Ship macOS Web", time: "All day", color: "#bf5af2" }],
  18: [{ t: "Flight to SFO", time: "6:15 AM", color: "#ff9f0a" }],
  22: [{ t: "WWDC Keynote", time: "10:00 AM", color: "#ff375f" }],
  27: [{ t: "Team Offsite", time: "All day", color: "#64d2ff" }],
};

export function Calendar() {
  const { dark, accent } = useOS();
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [sel, setSel] = useState(today.getDate());

  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = i - first + 1;
    return d > 0 && d <= days ? d : null;
  });

  const shift = (n: number) => {
    const m = month + n;
    if (m < 0) {
      setMonth(11);
      setYear(year - 1);
    } else if (m > 11) {
      setMonth(0);
      setYear(year + 1);
    } else setMonth(m);
  };

  return (
    <div className={cn("flex h-full", dark ? "bg-[#1b1c20] text-zinc-200" : "bg-white text-zinc-800")}>
      <div className={cn("w-[180px] shrink-0 border-r p-3 text-[13px]", dark ? "border-black/40 bg-[#232429]" : "border-black/10 bg-[#f4f4f6]")}>
        <div className="pb-1 text-[11px] font-semibold uppercase opacity-50">iCloud</div>
        {[
          ["Home", "#ff453a"],
          ["Work", "#0a84ff"],
          ["Travel", "#ff9f0a"],
          ["Birthdays", "#bf5af2"],
        ].map(([n, c]) => (
          <label key={n} className="flex items-center gap-2 rounded-md px-2 py-[5px] hover:bg-black/5">
            <input type="checkbox" defaultChecked style={{ accentColor: c }} />
            {n}
          </label>
        ))}
        <div className="mt-5 text-[11px] font-semibold uppercase opacity-50">Events on {month + 1}/{sel}</div>
        <div className="mt-2 space-y-2">
          {(EVENTS[sel] ?? []).map((e) => (
            <div key={e.t} className="rounded-lg p-2 text-[12px]" style={{ background: e.color + "22", borderLeft: `3px solid ${e.color}` }}>
              <div className="font-semibold">{e.t}</div>
              <div className="opacity-60">{e.time}</div>
            </div>
          ))}
          {!(EVENTS[sel] ?? []).length && <div className="text-[12px] opacity-40">No events</div>}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className={cn("flex h-12 shrink-0 items-center gap-3 border-b px-4", dark ? "border-black/40" : "border-black/10")}>
          <div className="text-[18px] font-bold">
            {new Date(year, month).toLocaleDateString(undefined, { month: "long" })}{" "}
            <span className="font-light opacity-60">{year}</span>
          </div>
          <div className="flex-1" />
          <div className={cn("flex overflow-hidden rounded-md text-[12px]", dark ? "bg-white/10" : "bg-black/[0.06]")}>
            <button onClick={() => shift(-1)} className="px-3 py-1 hover:bg-black/10">‹</button>
            <button
              onClick={() => {
                setMonth(today.getMonth());
                setYear(today.getFullYear());
                setSel(today.getDate());
              }}
              className="border-x border-black/10 px-3 py-1 hover:bg-black/10"
            >
              Today
            </button>
            <button onClick={() => shift(1)} className="px-3 py-1 hover:bg-black/10">›</button>
          </div>
        </div>
        <div className={cn("grid grid-cols-7 border-b text-center text-[11px] font-semibold uppercase opacity-50", dark ? "border-black/40" : "border-black/10")}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>
        <div className="grid flex-1 grid-cols-7 grid-rows-6">
          {cells.map((d, i) => {
            const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            return (
              <button
                key={i}
                onClick={() => d && setSel(d)}
                className={cn(
                  "flex flex-col items-start gap-[2px] border-b border-r p-1 text-left text-[12px]",
                  dark ? "border-black/30" : "border-black/[0.07]",
                  d === sel && (dark ? "bg-white/[0.06]" : "bg-black/[0.035]"),
                  !d && "pointer-events-none opacity-30",
                )}
              >
                <span
                  className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[11.5px]", isToday && "font-bold text-white")}
                  style={isToday ? { background: accent } : undefined}
                >
                  {d ?? ""}
                </span>
                {d &&
                  (EVENTS[d] ?? []).map((e) => (
                    <span key={e.t} className="w-full truncate rounded px-1 text-[10px] text-white" style={{ background: e.color }}>
                      {e.t}
                    </span>
                  ))}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- MAIL ----------------------------- */
const MAILS = [
  {
    from: "Apple",
    subject: "Your receipt from the App Store",
    time: "9:41 AM",
    preview: "Thanks for your purchase. Order ID MX9281JQ.",
    body: "Hello,\n\nThank you for your recent purchase from the App Store. Your order has been processed and the apps are now available on all of your devices.\n\nOrder ID: MX9281JQ\nTotal: $0.00 (Free)\n\n— The App Store Team",
    unread: true,
  },
  {
    from: "Sam Patel",
    subject: "Re: macOS Web launch plan",
    time: "8:20 AM",
    preview: "Looks great! I added some notes to the roadmap doc…",
    body: "Hey,\n\nLooks great! I added some notes to the roadmap doc — mostly around the Launchpad animation timing and the dock magnification curve.\n\nCan we sync at 3pm?\n\nSam",
    unread: true,
  },
  {
    from: "GitHub",
    subject: "[macos-web] 4 new pull requests",
    time: "Yesterday",
    preview: "feat: add mission control, fix: window resize on edge…",
    body: "4 new pull requests in macos-web:\n\n#128 feat: add mission control\n#129 fix: window resize on edge handles\n#130 perf: memoize dock magnification\n#131 docs: keyboard shortcuts",
    unread: false,
  },
  {
    from: "Figma",
    subject: "Alex shared “Aqua UI Kit” with you",
    time: "Yesterday",
    preview: "You now have edit access to the file.",
    body: "Alex shared a file with you.\n\nAqua UI Kit — 248 components, 36 styles.\n\nOpen in Figma to start editing.",
    unread: false,
  },
  {
    from: "Swiss Air",
    subject: "Check-in open for flight LX38",
    time: "Mar 12",
    preview: "Your flight departs in 24 hours.",
    body: "Check-in is now open for LX38 ZRH → SFO.\n\nSeat 14A · Boarding 10:25 · Gate E42",
    unread: false,
  },
];

export function Mail() {
  const { dark, accent } = useOS();
  const [sel, setSel] = useState(0);
  const m = MAILS[sel];
  return (
    <div className={cn("flex h-full", dark ? "bg-[#1b1c20] text-zinc-200" : "bg-white text-zinc-800")}>
      <div className={cn("w-[170px] shrink-0 border-r p-3 text-[13px]", dark ? "border-black/40 bg-[#232429]" : "border-black/10 bg-[#f4f4f6]")}>
        <div className="pb-1 text-[11px] font-semibold uppercase opacity-50">Mailboxes</div>
        {[
          ["Inbox", "📥", 2],
          ["VIP", "⭐", 0],
          ["Flagged", "🚩", 1],
          ["Drafts", "📝", 0],
          ["Sent", "📤", 0],
          ["Junk", "🗑", 0],
        ].map(([n, g, c], i) => (
          <button key={n as string} className={cn("flex w-full items-center gap-2 rounded-md px-2 py-[5px]", i === 0 ? "text-white" : "hover:bg-black/5")} style={i === 0 ? { background: accent } : undefined}>
            <span>{g as string}</span>
            <span className="flex-1 text-left">{n as string}</span>
            {(c as number) > 0 && <span className="text-[11px] opacity-70">{c as number}</span>}
          </button>
        ))}
      </div>
      <div className={cn("mac-scroll w-[280px] shrink-0 overflow-y-auto border-r", dark ? "border-black/40 bg-[#1f2024]" : "border-black/10 bg-[#fafafb]")}>
        {MAILS.map((x, i) => (
          <button
            key={i}
            onClick={() => setSel(i)}
            className={cn("block w-full border-b px-3 py-2 text-left", dark ? "border-black/30" : "border-black/[0.06]", i === sel ? "text-white" : "hover:bg-black/[0.04]")}
            style={i === sel ? { background: accent } : undefined}
          >
            <div className="flex items-center gap-2">
              {x.unread && <span className="h-[7px] w-[7px] rounded-full" style={{ background: i === sel ? "#fff" : accent }} />}
              <span className="flex-1 truncate text-[13px] font-semibold">{x.from}</span>
              <span className={cn("text-[11px]", i === sel ? "opacity-80" : "opacity-50")}>{x.time}</span>
            </div>
            <div className="truncate text-[12.5px]">{x.subject}</div>
            <div className={cn("line-clamp-2 text-[11.5px]", i === sel ? "opacity-80" : "opacity-55")}>{x.preview}</div>
          </button>
        ))}
      </div>
      <div className="mac-scroll min-w-0 flex-1 overflow-y-auto">
        <div className={cn("border-b p-5", dark ? "border-black/40" : "border-black/10")}>
          <div className="text-[17px] font-bold">{m.subject}</div>
          <div className="mt-2 flex items-center gap-2 text-[12.5px]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full text-white" style={{ background: accent }}>
              {m.from[0]}
            </div>
            <div>
              <div className="font-semibold">{m.from}</div>
              <div className="opacity-50">To: me</div>
            </div>
            <div className="flex-1" />
            <div className="opacity-50">{m.time}</div>
          </div>
        </div>
        <pre className="whitespace-pre-wrap p-6 font-[inherit] text-[13.5px] leading-relaxed">{m.body}</pre>
      </div>
    </div>
  );
}

/* ----------------------------- MESSAGES ----------------------------- */
const CHATS = [
  { name: "Sam Patel", color: "#0a84ff", msgs: [["in", "did you see the new launchpad?"], ["out", "yes! the blur is perfect 🤩"], ["in", "ship it today?"]] },
  { name: "Mum", color: "#ff2d55", msgs: [["in", "Call me when you land ❤️"], ["out", "Will do!"]] },
  { name: "Design Team", color: "#30d158", msgs: [["in", "New dock icons in Figma"], ["out", "On it"]] },
  { name: "Jordan", color: "#ff9f0a", msgs: [["in", "lunch at 1?"]] },
];

export function Messages() {
  const { dark, accent } = useOS();
  const [sel, setSel] = useState(0);
  const [threads, setThreads] = useState(CHATS.map((c) => c.msgs as [string, string][]));
  const [text, setText] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  const send = () => {
    if (!text.trim()) return;
    const t = text;
    setThreads((th) => th.map((m, i) => (i === sel ? [...m, ["out", t]] : m)));
    setText("");
    setTimeout(() => {
      const replies = ["👍", "Sounds good!", "haha nice", "On my way", "Let's do it", "💯"];
      setThreads((th) => th.map((m, i) => (i === sel ? [...m, ["in", replies[Math.floor(Math.random() * replies.length)]]] : m)));
      scroller.current?.scrollTo({ top: 99999, behavior: "smooth" });
    }, 900);
    setTimeout(() => scroller.current?.scrollTo({ top: 99999, behavior: "smooth" }), 50);
  };

  return (
    <div className={cn("flex h-full", dark ? "bg-[#1b1c20] text-zinc-200" : "bg-white text-zinc-800")}>
      <div className={cn("mac-scroll w-[230px] shrink-0 overflow-y-auto border-r p-2", dark ? "border-black/40 bg-[#232429]" : "border-black/10 bg-[#f4f4f6]")}>
        {CHATS.map((c, i) => (
          <button
            key={c.name}
            onClick={() => setSel(i)}
            className={cn("mb-1 flex w-full items-center gap-2 rounded-lg p-2 text-left", i === sel ? "text-white" : "hover:bg-black/5")}
            style={i === sel ? { background: accent } : undefined}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white" style={{ background: c.color }}>
              {c.name[0]}
            </div>
            <div className="min-w-0">
              <div className="truncate text-[13px] font-semibold">{c.name}</div>
              <div className={cn("truncate text-[11.5px]", i === sel ? "opacity-80" : "opacity-55")}>
                {threads[i][threads[i].length - 1]?.[1]}
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className={cn("flex h-11 shrink-0 items-center justify-center border-b text-[13px] font-semibold", dark ? "border-black/40" : "border-black/10")}>
          {CHATS[sel].name}
        </div>
        <div ref={scroller} className="mac-scroll flex-1 space-y-2 overflow-y-auto p-4">
          {threads[sel].map(([dir, msg], i) => (
            <div key={i} className={cn("flex", dir === "out" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[70%] rounded-2xl px-3 py-[6px] text-[13.5px]",
                  dir === "out" ? "text-white" : dark ? "bg-white/10" : "bg-black/[0.07]",
                )}
                style={dir === "out" ? { background: "#2aa3f0" } : undefined}
              >
                {msg}
              </div>
            </div>
          ))}
        </div>
        <div className={cn("flex shrink-0 items-center gap-2 border-t p-2", dark ? "border-black/40" : "border-black/10")}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="iMessage"
            className={cn("flex-1 rounded-full border px-3 py-[6px] text-[13px] outline-none", dark ? "border-white/15 bg-white/5" : "border-black/15")}
          />
          <button onClick={send} className="flex h-7 w-7 items-center justify-center rounded-full text-white" style={{ background: "#2aa3f0" }}>
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- REMINDERS ----------------------------- */
export function Reminders() {
  const { dark, accent } = useOS();
  const [items, setItems] = useState([
    { t: "Finish macOS Web dock animation", done: true, list: "Work" },
    { t: "Reply to Sam about launch plan", done: false, list: "Work" },
    { t: "Buy oat milk 🥛", done: false, list: "Home" },
    { t: "Book flights for WWDC", done: false, list: "Travel" },
    { t: "Water the monstera", done: true, list: "Home" },
  ]);
  const [draft, setDraft] = useState("");
  const [list, setList] = useState("All");
  const lists = useMemo(() => ["All", "Work", "Home", "Travel"], []);
  const shown = items.filter((i) => list === "All" || i.list === list);

  return (
    <div className={cn("flex h-full", dark ? "bg-[#1b1c20] text-zinc-200" : "bg-white text-zinc-800")}>
      <div className={cn("w-[170px] shrink-0 border-r p-3 text-[13px]", dark ? "border-black/40 bg-[#232429]" : "border-black/10 bg-[#f4f4f6]")}>
        {lists.map((l) => (
          <button
            key={l}
            onClick={() => setList(l)}
            className={cn("flex w-full items-center gap-2 rounded-md px-2 py-[6px]", list === l ? "text-white" : "hover:bg-black/5")}
            style={list === l ? { background: accent } : undefined}
          >
            <span className="h-3 w-3 rounded-full" style={{ background: { All: "#8e8e93", Work: "#0a84ff", Home: "#30d158", Travel: "#ff9f0a" }[l] }} />
            <span className="flex-1 text-left">{l}</span>
            <span className="text-[11px] opacity-60">{items.filter((i) => l === "All" || i.list === l).length}</span>
          </button>
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-5">
        <h2 className="mb-3 text-[22px] font-bold" style={{ color: accent }}>{list}</h2>
        <div className="mac-scroll flex-1 overflow-y-auto">
          {shown.map((it) => {
            const idx = items.indexOf(it);
            return (
              <label key={idx} className={cn("flex items-center gap-3 border-b py-2 text-[13.5px]", dark ? "border-white/10" : "border-black/[0.08]")}>
                <input
                  type="checkbox"
                  checked={it.done}
                  onChange={() => setItems((xs) => xs.map((x, i) => (i === idx ? { ...x, done: !x.done } : x)))}
                  className="h-4 w-4"
                  style={{ accentColor: accent }}
                />
                <span className={cn("flex-1", it.done && "line-through opacity-40")}>{it.t}</span>
                <span className="text-[11px] opacity-40">{it.list}</span>
              </label>
            );
          })}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && draft.trim()) {
                setItems((xs) => [...xs, { t: draft, done: false, list: list === "All" ? "Work" : list }]);
                setDraft("");
              }
            }}
            placeholder="+ New Reminder"
            className={cn("flex-1 rounded-lg px-3 py-2 text-[13px] outline-none", dark ? "bg-white/10" : "bg-black/[0.05]")}
          />
        </div>
      </div>
    </div>
  );
}
