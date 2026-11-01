"use client";

import { Volume2, VolumeX } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  approach,
  createFigure,
  type Env,
  type Figure,
  step,
  TUNING,
} from "@/lib/stickman/engine";
import { measurePlatforms } from "@/lib/stickman/measure";
import { computePose, type Limb, type Pt } from "@/lib/stickman/pose";
import { StickSound } from "@/lib/stickman/sound";

const MUTE_KEY = "stickman-muted";
/** Most landing-dust puffs alive at once. */
const DUST_POOL = 8;
/** Time without scrolling before the figure sits down. */
const SIT_AFTER_MS = 4000;

/** Pages where the figure stays away. */
const HIDDEN_ON = ["/login", "/blog/editor", "/api"];

const pts = (l: Limb) =>
  l.map((p: Pt) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

/**
 * A stick figure that walks along headings and lines as the page scrolls and
 * hops between them. All motion is written straight to SVG attributes from a
 * requestAnimationFrame loop that sleeps whenever the page is still.
 */
export function ScrollStickman() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const [sound] = useState(() => new StickSound());
  const [muted, setMuted] = useState(false);

  const group = useRef<SVGGElement>(null);
  const legNear = useRef<SVGPolylineElement>(null);
  const legFar = useRef<SVGPolylineElement>(null);
  const armNear = useRef<SVGPolylineElement>(null);
  const armFar = useRef<SVGPolylineElement>(null);
  const torso = useRef<SVGPolylineElement>(null);
  const head = useRef<SVGCircleElement>(null);
  const dust = useRef<(SVGCircleElement | null)[]>([]);

  const hidden = HIDDEN_ON.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(!mq.matches && !hidden);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [hidden]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(MUTE_KEY) === "1";
      sound.muted = saved;
      setMuted(saved);
    } catch {}
    return () => sound.dispose();
  }, [sound]);

  const toggleMute = () => {
    const next = !muted;
    sound.muted = next;
    sound.unlock(); // the click is a valid gesture
    setMuted(next);
    try {
      localStorage.setItem(MUTE_KEY, next ? "1" : "0");
    } catch {}
  };

  useEffect(() => {
    if (!enabled) return;

    let raf = 0;
    let measureRaf = 0;
    let lastTime = 0;
    let lastScrollY = window.scrollY;
    let lastScrollAt = performance.now();
    let velocity = 0;
    let facingVis = 1;
    let platforms = measurePlatforms();
    let figure: Figure | null = null;
    let gesture: {
      kind: "look" | "stretch";
      start: number;
      dur: number;
    } | null = null;
    let idleTimer = 0;
    let sitTimer = 0;
    let sitTarget = 0; // 1 once it has been left alone long enough to sit
    let sitAmt = 0;
    const puffs: {
      x: number;
      docY: number;
      vx: number;
      vy: number;
      age: number;
    }[] = [];
    const PUFF_LIFE = 450;

    const makeEnv = (dt: number, dScroll: number): Env => {
      const floorY = window.innerHeight - TUNING.floorOffset;
      return {
        scrollY: window.scrollY,
        dt,
        dScroll,
        velocity,
        floorY,
        floor: platforms.floor,
        platforms: platforms.platforms,
      };
    };

    /** Turn state changes between two frames into sound effects. */
    const playSounds = (a: Figure, b: Figure) => {
      if (a.phase !== "air" && b.phase === "air") {
        sound.play(b.fall ? "fall" : "jump");
      } else if (a.phase === "air" && b.phase === "land") {
        sound.play("land");
      } else if (
        b.phase === "walk" &&
        b.walkAmt > 0.3 &&
        Math.floor(a.walkPhase / Math.PI) !== Math.floor(b.walkPhase / Math.PI)
      ) {
        sound.play("step"); // one footfall every half gait cycle
      }
    };

    const spawnDust = (x: number, y: number) => {
      for (let i = 0; i < 5 && puffs.length < DUST_POOL; i++) {
        const dir = i % 2 ? 1 : -1;
        puffs.push({
          x,
          docY: y + window.scrollY,
          vx: dir * (20 + Math.random() * 45),
          vy: -(8 + Math.random() * 22),
          age: 0,
        });
      }
    };

    const drawDust = (dt: number) => {
      for (const p of puffs) {
        p.age += dt;
        p.x += (p.vx * dt) / 1000;
        p.docY += (p.vy * dt) / 1000;
      }
      for (let i = puffs.length - 1; i >= 0; i--) {
        if (puffs[i].age >= PUFF_LIFE) puffs.splice(i, 1);
      }
      const sy = window.scrollY;
      dust.current.forEach((c, i) => {
        if (!c) return;
        const p = puffs[i];
        if (!p) {
          c.setAttribute("opacity", "0");
          return;
        }
        const u = p.age / PUFF_LIFE;
        c.setAttribute("cx", p.x.toFixed(1));
        c.setAttribute("cy", (p.docY - sy).toFixed(1));
        c.setAttribute("r", (2.2 + u * 2.2).toFixed(1));
        c.setAttribute("opacity", (0.55 * (1 - u)).toFixed(2));
      });
    };

    /** Left alone for a while: sit down, bored. */
    const scheduleSit = () => {
      if (sitTimer || sitTarget) return;
      sitTimer = window.setTimeout(() => {
        sitTimer = 0;
        if (document.hidden) return;
        sitTarget = 1;
        wake();
      }, SIT_AFTER_MS);
    };

    const scheduleIdle = () => {
      if (idleTimer || gesture || sitTarget) return;
      idleTimer = window.setTimeout(
        () => {
          idleTimer = 0;
          if (document.hidden) return;
          const kind = Math.random() < 0.5 ? "look" : "stretch";
          gesture = {
            kind,
            start: performance.now(),
            dur: kind === "look" ? 1600 : 2000,
          };
          wake();
        },
        3000 + Math.random() * 4000
      );
    };

    const draw = (f: Figure, now: number) => {
      const k =
        f.phase === "crouch"
          ? f.t / TUNING.crouchMs
          : f.phase === "air"
            ? f.t / f.airMs
            : f.phase === "land"
              ? f.t / TUNING.landMs
              : 0;
      const pose = computePose({
        phase: f.phase,
        walkPhase: f.walkPhase,
        walkAmt: f.walkAmt,
        k,
        vyNorm: (k - 0.5) * 2,
        fall: f.fall,
        lean: Math.min(0.3, (Math.abs(velocity) / 4000) * 0.3),
        sit: sitAmt,
        idle: gesture
          ? { kind: gesture.kind, k: (now - gesture.start) / gesture.dur }
          : undefined,
      });

      // Turn around over a few frames instead of popping.
      facingVis += (f.facing - facingVis) * 0.3;
      if (Math.abs(f.facing - facingVis) < 0.02) facingVis = f.facing;
      const scale = window.innerWidth < 640 ? 1.05 : 1.3;

      // Squash on landing, easing back to normal.
      const squash = f.phase === "land" ? (1 - Math.min(1, k)) * 0.14 : 0;
      const sx = facingVis * scale * (1 + squash * 0.6);
      const sy = scale * (1 - squash);

      group.current?.setAttribute(
        "transform",
        `translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) scale(${sx.toFixed(3)} ${sy.toFixed(3)})`
      );
      legNear.current?.setAttribute("points", pts(pose.legNear));
      legFar.current?.setAttribute("points", pts(pose.legFar));
      armNear.current?.setAttribute("points", pts(pose.armNear));
      armFar.current?.setAttribute("points", pts(pose.armFar));
      torso.current?.setAttribute(
        "points",
        pts([pose.hip, pose.neck, pose.neck])
      );
      head.current?.setAttribute("cx", pose.head.x.toFixed(1));
      head.current?.setAttribute("cy", pose.head.y.toFixed(1));
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(50, lastTime ? now - lastTime : 16);
      lastTime = now;

      const y = window.scrollY;
      const dScroll = y - lastScrollY;
      lastScrollY = y;
      if (dScroll !== 0) {
        lastScrollAt = now;
        gesture = null; // scrolling interrupts any idle gesture
        window.clearTimeout(idleTimer);
        idleTimer = 0;
        window.clearTimeout(sitTimer);
        sitTimer = 0;
        sitTarget = 0; // scrolling gets it back on its feet
      }
      sitAmt = approach(sitAmt, sitTarget, dt / (sitTarget ? 700 : 350));
      if (gesture && now - gesture.start >= gesture.dur) gesture = null;
      // Smooth px/s so one big frame doesn't flip the "fast" mode by itself.
      velocity += ((dScroll / Math.max(dt, 1)) * 1000 - velocity) * 0.35;

      const env = makeEnv(dt, dScroll);
      const prev = figure;
      figure = prev ? step(prev, env) : createFigure(env);
      if (prev) playSounds(prev, figure);
      if (prev?.phase === "air" && figure.phase === "land") {
        spawnDust(figure.x, figure.y);
      }
      draw(figure, now);
      drawDust(dt);

      const settled =
        figure.phase === "walk" &&
        figure.walkAmt === 0 &&
        Math.abs(velocity) < 1 &&
        !gesture &&
        sitAmt === sitTarget &&
        puffs.length === 0;
      if (settled && now - lastScrollAt > TUNING.idleMs) {
        lastTime = 0; // sleep until the next scroll
        scheduleIdle();
        scheduleSit();
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (!raf && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const remeasure = () => {
      if (measureRaf) return;
      measureRaf = requestAnimationFrame(() => {
        measureRaf = 0;
        platforms = measurePlatforms();
        wake();
      });
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
        lastTime = 0;
      } else {
        lastScrollY = window.scrollY;
        wake();
      }
    };

    const unlock = () => sound.unlock();
    const gestures = ["pointerdown", "keydown", "touchstart"] as const;
    for (const g of gestures)
      window.addEventListener(g, unlock, { passive: true });

    const ro = new ResizeObserver(remeasure);
    ro.observe(document.body);
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", remeasure);
    document.addEventListener("visibilitychange", onVisibility);

    remeasure();
    wake();

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(measureRaf);
      window.clearTimeout(idleTimer);
      window.clearTimeout(sitTimer);
      ro.disconnect();
      for (const g of gestures) window.removeEventListener(g, unlock);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", remeasure);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled, pathname]);

  if (!enabled) return null;

  return (
    <>
      <style>{`
        @keyframes stickman-breathe {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1px); }
        }
        .far { stroke: var(--far); }
        .stickman-body { animation: stickman-breathe 2.4s ease-in-out infinite; }
      `}</style>
      <svg
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 h-full w-full text-signal"
      >
        <defs>
          {/* One shape, drawn twice below: a dark outline, then the orange fill. */}
          <g
            id="stickman-shape"
            className="stickman-body"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline ref={legFar} className="far" fill="none" />
            <polyline ref={armFar} className="far" fill="none" />
            <polyline ref={torso} fill="none" />
            <polyline ref={legNear} fill="none" />
            <polyline ref={armNear} fill="none" />
            <circle ref={head} r={5.5} />
          </g>
        </defs>
        <g ref={group}>
          <use
            href="#stickman-shape"
            stroke="var(--background)"
            style={
              {
                "--far": "var(--background)",
              } as React.CSSProperties
            }
            fill="var(--background)"
            strokeWidth={6.4}
          />
          <use
            href="#stickman-shape"
            style={
              {
                "--far": "currentColor",
              } as React.CSSProperties
            }
            stroke="currentColor"
            fill="currentColor"
            strokeWidth={3.6}
          />
        </g>
        <g fill="currentColor">
          {Array.from({ length: DUST_POOL }, (_, i) => (
            <circle
              key={i}
              ref={(el) => {
                dust.current[i] = el;
              }}
              r={2}
              opacity={0}
            />
          ))}
        </g>
      </svg>
      <button
        type="button"
        onClick={toggleMute}
        aria-label={
          muted ? "Unmute stick figure sounds" : "Mute stick figure sounds"
        }
        aria-pressed={!muted}
        className="fixed bottom-4 left-4 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-foreground/70 backdrop-blur transition-colors hover:text-foreground"
      >
        {muted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </button>
    </>
  );
}
