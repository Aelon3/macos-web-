import { useEffect, useRef, useState } from "react";
import { useOS } from "@/os/store";

interface Line {
  type: "in" | "out";
  text: string;
}

const BANNER = [
  "Last login: " + new Date().toLocaleString(),
  "macOS Web 15.4 (Build 26A101) — type `help` for a list of commands",
  "",
];

const FILES: Record<string, string> = {
  "readme.md":
    "# macOS Web\nA complete macOS desktop that runs in any browser.\nNo install. No download. 100% free.",
  "notes.txt": "Remember: ⌘+Space opens Spotlight, F4 opens Launchpad.",
  ".zshrc": 'export PS1="%n@macbook %1~ %# "\nalias ll="ls -la"',
};

export default function Terminal() {
  const { openApp, userName, battery, wallpaper, setDark, dark } = useOS();
  const [lines, setLines] = useState<Line[]>(BANNER.map((t) => ({ type: "out", text: t })));
  const [value, setValue] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const [cwd, setCwd] = useState("~");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ block: "end" });
  }, [lines]);

  const print = (text: string | string[]) =>
    setLines((l) => [...l, ...(Array.isArray(text) ? text : [text]).map((t) => ({ type: "out" as const, text: t }))]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    setLines((l) => [...l, { type: "in", text: `${userName.split(" ")[0].toLowerCase()}@macbook ${cwd} % ${cmd}` }]);
    if (!cmd) return;
    setHist((h) => [cmd, ...h]);
    const [name, ...args] = cmd.split(/\s+/);
    switch (name) {
      case "help":
        print([
          "Available commands:",
          "  ls, cd, pwd, cat <file>, echo <text>, whoami, date",
          "  open <app>      launch an app (safari, notes, music, code…)",
          "  neofetch        show system info",
          "  battery         battery status",
          "  theme <dark|light>",
          "  clear, history, uname, sudo, exit",
          "",
        ]);
        break;
      case "ls":
        print(Object.keys(FILES).join("    ") + "    Desktop  Documents  Downloads  Pictures");
        break;
      case "pwd":
        print(cwd === "~" ? "/Users/" + userName.split(" ")[0].toLowerCase() : cwd);
        break;
      case "cd":
        setCwd(!args[0] || args[0] === "~" ? "~" : args[0].replace(/\/$/, ""));
        break;
      case "cat":
        print(FILES[args[0]] ? FILES[args[0]].split("\n") : [`cat: ${args[0] ?? ""}: No such file or directory`]);
        break;
      case "echo":
        print(args.join(" "));
        break;
      case "whoami":
        print(userName.split(" ")[0].toLowerCase());
        break;
      case "date":
        print(new Date().toString());
        break;
      case "uname":
        print("Darwin macbook-web 24.4.0 arm64 Apple M3 Pro");
        break;
      case "battery":
        print(`Battery: ${battery}% — ${battery > 40 ? "Good" : "Consider charging"}`);
        break;
      case "theme":
        if (args[0] === "dark") {
          setDark(true);
          print("Appearance set to Dark.");
        } else if (args[0] === "light") {
          setDark(false);
          print("Appearance set to Light.");
        } else print(`Current appearance: ${dark ? "dark" : "light"}`);
        break;
      case "open":
        if (!args[0]) print("usage: open <app>");
        else {
          openApp(args[0].toLowerCase());
          print(`Launching ${args[0]}…`);
        }
        break;
      case "neofetch":
        print([
          "                    'c.          " + userName.split(" ")[0].toLowerCase() + "@macbook",
          "                 ,xNMM.          ------------------",
          "               .OMMMMo           OS: macOS Web 15.4",
          "               lMM\"              Host: MacBook Pro 16\" (M3 Pro)",
          "     .;loddo:.  .olloddol;.      Kernel: Darwin 24.4.0",
          "   cKMMMMMMMMMMNWMMMMMMMMMM0:    Shell: zsh 5.9",
          " .KMMMMMMMMMMMMMMMMMMMMMMMWd.    Resolution: " + window.innerWidth + "x" + window.innerHeight,
          " XMMMMMMMMMMMMMMMMMMMMMMMX.      DE: Aqua",
          ";MMMMMMMMMMMMMMMMMMMMMMMM:       WM: Quartz Compositor",
          ":MMMMMMMMMMMMMMMMMMMMMMMM:       Wallpaper: " + wallpaper.name,
          ".MMMMMMMMMMMMMMMMMMMMMMMMX.      Memory: 18 GB Unified",
          " kMMMMMMMMMMMMMMMMMMMMMMMMWd.    Battery: " + battery + "%",
          "  .XMMMMMMMMMMMMMMMMMMMMMMMMMMk  ",
          "    .XMMMMMMMMMMMMMMMMMMMMMMMMK. ",
          "      kMMMMMMMMMMMMMMMMMMMMMMd   ",
          "       ;KMMMMMMMWXXWMMMMMMMk.    ",
          "         \"cooc*\"    \"*coo'\"      ",
          "",
        ]);
        break;
      case "sudo":
        print(args.length ? `Password: \nSorry, try again. (just kidding — ${args.join(" ")} executed 😄)` : "usage: sudo <command>");
        break;
      case "history":
        print([...hist].reverse().map((h, i) => `  ${i + 1}  ${h}`));
        break;
      case "clear":
        setLines([]);
        break;
      case "exit":
        print("Saving session… logout");
        break;
      default:
        print(`zsh: command not found: ${name}`);
    }
  };

  return (
    <div
      className="mac-scroll font-mono-mac h-full overflow-y-auto bg-[#10121a]/95 p-3 text-[12.5px] leading-[1.45] text-[#e6e8ea]"
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((l, i) => (
        <div key={i} className={l.type === "in" ? "text-[#8ef2a3]" : "whitespace-pre-wrap text-[#dfe3e6]"}>
          {l.text || "\u00A0"}
        </div>
      ))}
      <div className="flex items-center gap-1">
        <span className="shrink-0 text-[#8ef2a3]">
          {userName.split(" ")[0].toLowerCase()}@macbook {cwd} %
        </span>
        <input
          ref={inputRef}
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              run(value);
              setValue("");
              setHi(-1);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              const n = Math.min(hi + 1, hist.length - 1);
              setHi(n);
              setValue(hist[n] ?? "");
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              const n = Math.max(hi - 1, -1);
              setHi(n);
              setValue(n === -1 ? "" : (hist[n] ?? ""));
            }
          }}
          className="flex-1 bg-transparent text-[#e6e8ea] caret-[#8ef2a3] outline-none"
          spellCheck={false}
        />
      </div>
      <div ref={endRef} />
    </div>
  );
}
