import { useState } from "react";
import { useOS } from "@/os/store";
import { cn } from "@/utils/cn";

export default function Notes() {
  const { notes, setNotes, dark, accent } = useOS();
  const [activeId, setActiveId] = useState(notes[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const active = notes.find((n) => n.id === activeId) ?? notes[0];

  const update = (field: "title" | "body", value: string) =>
    setNotes((ns) => ns.map((n) => (n.id === active.id ? { ...n, [field]: value } : n)));

  const addNote = () => {
    const id = "note-" + Date.now();
    setNotes((ns) => [{ id, title: "New Note", body: "", date: "Today" }, ...ns]);
    setActiveId(id);
  };

  const del = () => {
    setNotes((ns) => ns.filter((n) => n.id !== active.id));
    setActiveId(notes.find((n) => n.id !== active.id)?.id ?? "");
  };

  const list = notes.filter(
    (n) =>
      !query ||
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      n.body.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className={cn("flex h-full", dark ? "bg-[#1e1f24] text-zinc-200" : "bg-white text-zinc-800")}>
      <div
        className={cn(
          "flex w-[150px] shrink-0 flex-col border-r px-2 py-3 text-[13px]",
          dark ? "border-black/40 bg-[#26272c]" : "border-black/10 bg-[#ececee]",
        )}
      >
        <div className="px-2 pb-1 text-[11px] font-semibold uppercase opacity-50">iCloud</div>
        {["All Notes", "Favourites", "Shared", "Recently Deleted"].map((f, i) => (
          <button
            key={f}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-[5px] text-left",
              i === 0 ? "text-white" : "hover:bg-black/5",
            )}
            style={i === 0 ? { background: accent } : undefined}
          >
            <span>📒</span>
            {f}
          </button>
        ))}
      </div>

      <div
        className={cn(
          "flex w-[250px] shrink-0 flex-col border-r",
          dark ? "border-black/40 bg-[#232429]" : "border-black/10 bg-[#f7f7f8]",
        )}
      >
        <div className="flex items-center gap-2 p-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className={cn(
              "flex-1 rounded-md px-2 py-1 text-[12px] outline-none",
              dark ? "bg-white/10" : "bg-black/[0.06]",
            )}
          />
          <button onClick={addNote} className="rounded px-1 text-lg leading-none opacity-70 hover:opacity-100" title="New note">
            ✎
          </button>
        </div>
        <div className="mac-scroll flex-1 overflow-y-auto px-2 pb-2">
          {list.map((n) => (
            <button
              key={n.id}
              onClick={() => setActiveId(n.id)}
              className={cn(
                "mb-1 block w-full rounded-lg px-3 py-2 text-left",
                n.id === active?.id ? "text-white" : "hover:bg-black/5",
              )}
              style={n.id === active?.id ? { background: accent } : undefined}
            >
              <div className="truncate text-[13px] font-semibold">{n.title || "New Note"}</div>
              <div className={cn("truncate text-[11.5px]", n.id === active?.id ? "opacity-80" : "opacity-50")}>
                <span className="mr-1">{n.date}</span>
                {n.body.split("\n")[0] || "No additional text"}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {active ? (
          <>
            <div className={cn("flex h-9 items-center gap-3 border-b px-4 text-[13px] opacity-60", dark ? "border-black/40" : "border-black/10")}>
              <button className="hover:opacity-100">Aa</button>
              <button className="hover:opacity-100">☑</button>
              <button className="hover:opacity-100">⊞</button>
              <button className="hover:opacity-100">🔗</button>
              <div className="flex-1" />
              <button onClick={del} className="hover:opacity-100">🗑</button>
            </div>
            <div className="mac-scroll flex-1 overflow-y-auto px-8 py-6">
              <div className="mb-3 text-center text-[11px] opacity-40">{active.date}</div>
              <input
                value={active.title}
                onChange={(e) => update("title", e.target.value)}
                className="w-full bg-transparent text-[21px] font-bold outline-none"
                placeholder="Title"
              />
              <textarea
                value={active.body}
                onChange={(e) => update("body", e.target.value)}
                placeholder="Start writing…"
                className="mt-3 h-[calc(100%-70px)] min-h-[260px] w-full resize-none bg-transparent text-[14px] leading-relaxed outline-none"
              />
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center opacity-40">No note selected</div>
        )}
      </div>
    </div>
  );
}
