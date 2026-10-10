"use client";

import { motion, useReducedMotion } from "framer-motion";

type Line = { kind: "cmd" | "out"; text: string };

const LINES: Line[] = [
  { kind: "cmd", text: "whoami" },
  { kind: "out", text: "avisek ray (biisal)" },
  { kind: "cmd", text: "cat role.txt" },
  { kind: "out", text: "Software Engineer @ EnhanceAI Art" },
  { kind: "cmd", text: "ls focus/" },
  { kind: "out", text: "database/  backend-design/  frontend-eng/" },
  { kind: "cmd", text: "echo $STACK" },
  { kind: "out", text: "python · go · typescript · postgres" },
  { kind: "cmd", text: "cat goal.txt" },
  { kind: "out", text: "cat: goal.txt: it's in my .env" },
];

export const TerminalWindow = () => {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="overflow-hidden rounded-xl border border-border bg-sidebar/80 shadow-[0_0_60px_-20px_rgba(223,187,125,0.3)] backdrop-blur"
      role="img"
      aria-label="Terminal window summarising Avisek Ray's role and stack"
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-destructive" />
        <span className="h-3 w-3 rounded-full bg-primary" />
        <span className="h-3 w-3 rounded-full bg-chart-2" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">
          avisek@codeltix: ~
        </span>
      </div>

      <div className="flex flex-col gap-1 p-5 font-mono text-[13px] leading-6">
        {LINES.map((line, i) => (
          <motion.p
            key={`${line.kind}-${i}`}
            initial={reduceMotion ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.28, duration: 0.3 }}
            className={
              line.kind === "cmd"
                ? "text-foreground"
                : "pl-4 text-muted-foreground"
            }
          >
            {line.kind === "cmd" ? (
              <>
                <span className="mr-2 text-primary">$</span>
                {line.text}
              </>
            ) : (
              line.text
            )}
          </motion.p>
        ))}

        <motion.p
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 + LINES.length * 0.28 }}
          className="flex items-center text-foreground"
        >
          <span className="mr-2 text-primary">$</span>
          <span className="h-4 w-2 animate-pulse bg-foreground/60" />
        </motion.p>
      </div>
    </div>
  );
};
