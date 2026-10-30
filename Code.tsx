import { useMemo, useState } from "react";
import { cn } from "@/utils/cn";

const INITIAL: Record<string, string> = {
  "index.html": `<!doctype html>
<html>
  <head><link rel="stylesheet" href="styles.css"></head>
  <body>
    <div class="card">
      <h1>Hello from macOS Web 👋</h1>
      <p>Edit the code on the left — the preview updates live.</p>
      <button id="go">Click me</button>
      <p id="out"></p>
    </div>
    <script src="app.js"><\/script>
  </body>
</html>`,
  "styles.css": `body{
  margin:0;display:grid;place-items:center;height:100vh;
  font-family:Inter,system-ui,sans-serif;
  background:linear-gradient(135deg,#6a11cb,#2575fc);
}
.card{
  background:rgba(255,255,255,.92);padding:28px 32px;border-radius:18px;
  box-shadow:0 20px 50px rgba(0,0,0,.3);text-align:center;max-width:340px;
}
h1{font-size:20px;margin:0 0 8px}
p{font-size:13px;color:#444;margin:4px 0}
button{
  margin-top:10px;border:0;border-radius:999px;padding:8px 18px;
  background:#2575fc;color:#fff;font-weight:600;cursor:pointer;
}`,
  "app.js": `let n = 0;
document.getElementById('go').onclick = () => {
  n++;
  document.getElementById('out').textContent =
    'Clicked ' + n + (n === 1 ? ' time' : ' times');
};`,
};

const EXT_COLOR: Record<string, string> = { html: "#e34c26", css: "#2965f1", js: "#f0db4f" };

export default function Code() {
  const [files, setFiles] = useState(INITIAL);
  const [active, setActive] = useState("index.html");
  const [showPreview, setShowPreview] = useState(true);

  const srcDoc = useMemo(
    () =>
      files["index.html"]
        .replace('<link rel="stylesheet" href="styles.css">', `<style>${files["styles.css"]}</style>`)
        .replace('<script src="app.js"><\/script>', `<script>${files["app.js"]}<\/script>`),
    [files],
  );

  const lines = files[active].split("\n");

  return (
    <div className="flex h-full bg-[#1e1e1e] text-[#d4d4d4]">
      {/* activity bar */}
      <div className="flex w-11 shrink-0 flex-col items-center gap-4 border-r border-black/50 bg-[#2d2d30] py-3 text-lg">
        {["📄", "🔍", "⑂", "🐞", "🧩"].map((i, k) => (
          <span key={k} className={cn("cursor-pointer opacity-50 hover:opacity-100", k === 0 && "opacity-100")}>
            {i}
          </span>
        ))}
      </div>
      {/* explorer */}
      <div className="w-44 shrink-0 border-r border-black/50 bg-[#252526] py-2 text-[12.5px]">
        <div className="px-3 pb-2 text-[10.5px] font-semibold uppercase tracking-wide opacity-60">Explorer</div>
        <div className="px-2 pb-1 text-[11px] font-bold opacity-80">▾ MACOS-WEB</div>
        {Object.keys(files).map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={cn("flex w-full items-center gap-2 px-4 py-[3px] text-left", active === f ? "bg-[#37373d] text-white" : "hover:bg-white/5")}
          >
            <span className="h-2 w-2 rounded-sm" style={{ background: EXT_COLOR[f.split(".").pop()!] }} />
            {f}
          </button>
        ))}
      </div>
      {/* editor */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-9 shrink-0 items-center border-b border-black/50 bg-[#252526] text-[12px]">
          {Object.keys(files).map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={cn("h-full border-r border-black/40 px-3", active === f ? "bg-[#1e1e1e] text-white" : "opacity-60 hover:opacity-90")}
            >
              {f}
            </button>
          ))}
          <div className="flex-1" />
          <button
            onClick={() => setShowPreview((p) => !p)}
            className="mr-2 rounded bg-white/10 px-2 py-[2px] text-[11px] hover:bg-white/20"
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
        </div>
        <div className="flex min-h-0 flex-1">
          <div className="relative flex min-w-0 flex-1">
            <div className="font-mono-mac mac-scroll w-10 shrink-0 select-none overflow-hidden bg-[#1e1e1e] py-2 pr-2 text-right text-[12px] leading-[1.5] text-[#6b6b6b]">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              value={files[active]}
              onChange={(e) => setFiles((f) => ({ ...f, [active]: e.target.value }))}
              spellCheck={false}
              className="font-mono-mac mac-scroll flex-1 resize-none bg-[#1e1e1e] py-2 pr-3 text-[12px] leading-[1.5] text-[#d4d4d4] outline-none"
            />
          </div>
          {showPreview && (
            <div className="flex w-[44%] shrink-0 flex-col border-l border-black/50">
              <div className="flex h-7 items-center gap-2 bg-[#252526] px-3 text-[11px] opacity-70">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Live Preview
              </div>
              <iframe title="preview" srcDoc={srcDoc} sandbox="allow-scripts" className="flex-1 bg-white" />
            </div>
          )}
        </div>
        <div className="flex h-6 shrink-0 items-center gap-4 bg-[#007acc] px-3 text-[11px] text-white">
          <span>⑂ main</span>
          <span>✓ 0 errors</span>
          <div className="flex-1" />
          <span>Ln {lines.length}, Col 1</span>
          <span>UTF-8</span>
          <span>{active.split(".").pop()?.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}
