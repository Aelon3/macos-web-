import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

type Op = "+" | "−" | "×" | "÷" | null;

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [acc, setAcc] = useState<number | null>(null);
  const [op, setOp] = useState<Op>(null);
  const [fresh, setFresh] = useState(true);
  const [tape, setTape] = useState("");

  const num = (d: string) => {
    if (fresh) {
      setDisplay(d === "." ? "0." : d);
      setFresh(false);
    } else {
      if (d === "." && display.includes(".")) return;
      setDisplay(display.length > 11 ? display : display === "0" && d !== "." ? d : display + d);
    }
  };

  const compute = (a: number, b: number, o: Op) => {
    switch (o) {
      case "+":
        return a + b;
      case "−":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        return b === 0 ? NaN : a / b;
      default:
        return b;
    }
  };

  const applyOp = (next: Op) => {
    const cur = parseFloat(display);
    if (acc !== null && op && !fresh) {
      const r = compute(acc, cur, op);
      setAcc(r);
      setDisplay(fmt(r));
      setTape(`${fmt(r)} ${next ?? ""}`);
    } else {
      setAcc(cur);
      setTape(`${fmt(cur)} ${next ?? ""}`);
    }
    setOp(next);
    setFresh(true);
  };

  const equals = () => {
    const cur = parseFloat(display);
    if (op && acc !== null) {
      const r = compute(acc, cur, op);
      setDisplay(fmt(r));
      setTape(`${fmt(acc)} ${op} ${fmt(cur)} =`);
      setAcc(null);
      setOp(null);
      setFresh(true);
    }
  };

  const clear = () => {
    setDisplay("0");
    setAcc(null);
    setOp(null);
    setFresh(true);
    setTape("");
  };

  const fmt = (n: number) => {
    if (!isFinite(n)) return "Error";
    const s = Math.abs(n) > 1e11 || (Math.abs(n) < 1e-6 && n !== 0) ? n.toExponential(5) : String(parseFloat(n.toPrecision(12)));
    return s;
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const k = e.key;
      if (/[0-9.]/.test(k) && k.length === 1) num(k);
      else if (k === "+") applyOp("+");
      else if (k === "-") applyOp("−");
      else if (k === "*") applyOp("×");
      else if (k === "/") {
        e.preventDefault();
        applyOp("÷");
      } else if (k === "Enter" || k === "=") equals();
      else if (k === "Escape") clear();
      else if (k === "Backspace") setDisplay((d) => (d.length > 1 ? d.slice(0, -1) : "0"));
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  const Btn = ({
    label,
    onClick,
    variant = "num",
    wide,
    activeOp,
  }: {
    label: string;
    onClick: () => void;
    variant?: "num" | "fn" | "op";
    wide?: boolean;
    activeOp?: boolean;
  }) => (
    <button
      onClick={onClick}
      className={cn(
        "flex h-full items-center justify-center rounded-full text-[19px] font-medium transition active:brightness-125",
        wide ? "col-span-2 justify-start pl-7" : "",
        variant === "num" && "bg-[#4b4c50] text-white hover:bg-[#5a5b60]",
        variant === "fn" && "bg-[#6f7075] text-white hover:bg-[#7d7e84]",
        variant === "op" && "bg-[#ff9f0a] text-white hover:brightness-110",
        activeOp && "bg-white !text-[#ff9f0a]",
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="flex h-full flex-col bg-[#28292c] p-3 pt-0">
      <div className="flex min-h-[82px] flex-col items-end justify-end px-3 pb-3">
        <div className="h-4 text-[12px] text-white/40">{tape}</div>
        <div
          className="w-full truncate text-right font-light text-white"
          style={{ fontSize: display.length > 9 ? 32 : display.length > 6 ? 42 : 54, lineHeight: 1.1 }}
        >
          {display}
        </div>
      </div>
      <div className="grid flex-1 grid-cols-4 grid-rows-5 gap-[7px]">
        <Btn label={fresh && display === "0" ? "AC" : "C"} variant="fn" onClick={clear} />
        <Btn label="+/−" variant="fn" onClick={() => setDisplay((d) => (d.startsWith("-") ? d.slice(1) : "-" + d))} />
        <Btn label="%" variant="fn" onClick={() => setDisplay((d) => fmt(parseFloat(d) / 100))} />
        <Btn label="÷" variant="op" activeOp={op === "÷" && fresh} onClick={() => applyOp("÷")} />
        {["7", "8", "9"].map((n) => (
          <Btn key={n} label={n} onClick={() => num(n)} />
        ))}
        <Btn label="×" variant="op" activeOp={op === "×" && fresh} onClick={() => applyOp("×")} />
        {["4", "5", "6"].map((n) => (
          <Btn key={n} label={n} onClick={() => num(n)} />
        ))}
        <Btn label="−" variant="op" activeOp={op === "−" && fresh} onClick={() => applyOp("−")} />
        {["1", "2", "3"].map((n) => (
          <Btn key={n} label={n} onClick={() => num(n)} />
        ))}
        <Btn label="+" variant="op" activeOp={op === "+" && fresh} onClick={() => applyOp("+")} />
        <Btn label="0" wide onClick={() => num("0")} />
        <Btn label="." onClick={() => num(".")} />
        <Btn label="=" variant="op" onClick={equals} />
      </div>
    </div>
  );
}
