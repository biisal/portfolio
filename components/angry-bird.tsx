"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { HUES, rampFor, sweep } from "@/lib/pebble-hue";
import { pupilOffset } from "@/lib/eye-tracking";

/** Plump pebble body, wider than tall, sitting on its feet. */
const BODY =
  "M50 27C70 27 84 41 84 58C84 75 70 86 50 86C30 86 16 75 16 58C16 41 30 27 50 27Z";

/** Face plate: a dark visor the eyes live inside. */
const VISOR = { x: 24, y: 43, w: 52, h: 28, r: 14 };

/** Eye centres, inside the visor. Glowing pills rather than round dots. */
const EYE_L = { x: 39, y: 56 };
const EYE_R = { x: 61, y: 56 };
const EYE_W = 7;
const EYE_H = 11;

/** Gaze: pointer offset comes from pupilOffset in 0..TRAVEL_X. */
const TRAVEL_X = 6;
const TRAVEL_Y = 4;
const EYE_SHIFT = 0.55; // eyes slide inside the visor
const FACE_RIDE = 0.22; // the whole face plate drifts a little with the gaze
const LEAN = 2.2; // body lean in degrees at full travel
const SQUISH = 0.22; // how much the far eye narrows

/** Hold each colour, then fade to the next one. */
const HOLD_MS = 2600;
const FADE_MS = 900;

/**
 * Every layer has its own period so the motion never lines up into a repeat:
 * float (bob), jelly (squash and stretch), antenna sway, bulb pulse, blink and
 * the ground shadow breathing under it.
 */
const IDLE_CSS = `
.pb-vb { transform-box: view-box; }
.pb-float { animation: pb-float 5.6s ease-in-out infinite; }
.pb-jelly { transform-origin: 50px 86px; animation: pb-jelly 2.8s ease-in-out infinite; }
.pb-sway { transform-origin: 50px 28px; animation: pb-sway 3.4s ease-in-out infinite; }
.pb-bulb { transform-origin: 50px 11px; animation: pb-bulb 2.2s ease-in-out infinite; }
.pb-glow { animation: pb-glow 2.2s ease-in-out infinite; }
.pb-blink { transform-origin: 50px 56px; animation: pb-blink 4.2s linear infinite; animation-delay: .6s; }
.pb-shadow { transform-origin: 50px 91px; animation: pb-shadow 5.6s ease-in-out infinite; }
@keyframes pb-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-3.5px) } }
@keyframes pb-jelly { 0%,100% { transform: scale(1.04,.96) } 50% { transform: scale(.96,1.04) } }
@keyframes pb-sway { 0%,100% { transform: rotate(-7deg) } 50% { transform: rotate(7deg) } }
@keyframes pb-bulb { 0%,100% { transform: scale(1) } 50% { transform: scale(1.18) } }
@keyframes pb-glow { 0%,100% { opacity: .18; transform: scale(.9) } 50% { opacity: .45; transform: scale(1.25) } }
@keyframes pb-blink { 0%,94% { transform: scaleY(1) } 96.5% { transform: scaleY(.08) } 100% { transform: scaleY(1) } }
@keyframes pb-shadow { 0%,100% { transform: scale(1); opacity: .38 } 50% { transform: scale(.82); opacity: .24 } }

.pb-glow { transform-origin: 50px 11px; }
.pb-happy { opacity: 0; transition: opacity .18s ease; }
.pb-eyes { transition: opacity .18s ease; }
.pb-cheek { opacity: .5; transform-box: fill-box; transform-origin: center; transition: opacity .25s ease, transform .25s ease; }
.pb-root:hover .pb-eyes { opacity: 0; }
.pb-root:hover .pb-happy { opacity: 1; }
.pb-root:hover .pb-cheek { opacity: .95; transform: scale(1.3); }
@media (prefers-reduced-motion: reduce) {
  .pb-float, .pb-jelly, .pb-sway, .pb-bulb, .pb-glow, .pb-blink, .pb-shadow { animation: none }
  .pb-glow { opacity: .3 }
}`;

/**
 * A little robot-blob: a plump pebble body with a dark visor, glowing pill
 * eyes, a small smile and an antenna with a pulsing bulb. It floats, squashes,
 * blinks and sways, the eyes follow the pointer, and on hover it squeezes its
 * eyes into happy arcs. The body holds each of HUES -- orange, yellow, pink,
 * blue, never green -- then eases to the next. Decorative: the name beside it
 * is real text, so it is hidden from readers.
 */
export default function AngryBird({
  size = 52,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const gradId = `pb-${useId().replace(/:/g, "")}`;
  const [gaze, setGaze] = useState({ x: 0, y: 0 });
  const [hue, setHue] = useState<number>(HUES[0]);

  useEffect(() => {
    const cycle = HOLD_MS + FADE_MS;
    const start = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const elapsed = now - start;
      const i = Math.floor(elapsed / cycle) % HUES.length;
      const t = Math.min(
        1,
        Math.max(0, ((elapsed % cycle) - HOLD_MS) / FADE_MS)
      );
      const eased = t * t * (3 - 2 * t);
      const next = sweep(HUES[i], HUES[(i + 1) % HUES.length], eased);
      // identical value while holding, so React bails out
      setHue((prev) => (prev === next ? prev : next));
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const { x, y } = pupilOffset(
        e.clientX,
        e.clientY,
        el.getBoundingClientRect(),
        TRAVEL_X
      );
      const rx = Math.round(x * 100) / 100;
      const ry = Math.round(y * 100) / 100;
      setGaze((g) => (g.x === rx && g.y === ry ? g : { x: rx, y: ry }));
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const gx = gaze.x;
  const gy = Math.max(-TRAVEL_Y, Math.min(TRAVEL_Y, gaze.y));
  const nx = gx / TRAVEL_X; // -1..1
  const ramp = rampFor(hue);
  const knock = "var(--background, #151515)";
  const eyeShift = `translate(${gx * EYE_SHIFT} ${gy * EYE_SHIFT})`;
  const faceRide = `translate(${gx * FACE_RIDE} ${gy * FACE_RIDE})`;

  const eye = (c: { x: number; y: number }, squish: number) => (
    <g
      transform={`translate(${c.x} ${c.y}) scale(${squish} 1) translate(${-c.x} ${-c.y})`}
    >
      {/* soft glow behind the pill */}
      <rect
        x={c.x - EYE_W / 2 - 1.5}
        y={c.y - EYE_H / 2 - 1.5}
        width={EYE_W + 3}
        height={EYE_H + 3}
        rx={(EYE_W + 3) / 2}
        fill={ramp.base}
        opacity="0.35"
      />
      <rect
        x={c.x - EYE_W / 2}
        y={c.y - EYE_H / 2}
        width={EYE_W}
        height={EYE_H}
        rx={EYE_W / 2}
        fill={ramp.light}
      />
      <circle cx={c.x + 1} cy={c.y - 2.6} r="1.3" fill="#fff" opacity="0.9" />
    </g>
  );

  return (
    <span
      ref={ref}
      className={cn("pb-root inline-flex shrink-0", className)}
      aria-hidden="true"
    >
      <style>{IDLE_CSS}</style>
      {/* overflow visible so the antenna glow can spill past the window */}
      <svg
        width={size}
        height={size}
        viewBox="4 2 92 92"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ramp.mid} />
            <stop offset="55%" stopColor={ramp.base} />
            <stop offset="100%" stopColor={ramp.deep} />
          </linearGradient>
        </defs>

        {/* ground shadow */}
        <ellipse
          className="pb-vb pb-shadow"
          cx="50"
          cy="91"
          rx="23"
          ry="3.6"
          fill="#000"
        />

        <g className="pb-vb pb-float">
          <g transform={`rotate(${nx * LEAN} 50 86)`}>
            <g className="pb-vb pb-jelly">
              {/* feet, tucked behind the body */}
              <ellipse
                cx="37"
                cy="86"
                rx="8"
                ry="4.2"
                fill={ramp.deep}
                stroke={ramp.outline}
                strokeWidth="2"
              />
              <ellipse
                cx="63"
                cy="86"
                rx="8"
                ry="4.2"
                fill={ramp.deep}
                stroke={ramp.outline}
                strokeWidth="2"
              />

              {/* antenna: stem, soft halo and a pulsing bulb */}
              <g className="pb-vb pb-sway">
                <path
                  d="M50 29Q47 20 50 12"
                  fill="none"
                  stroke={ramp.outline}
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
                <circle
                  className="pb-vb pb-glow"
                  cx="50"
                  cy="11"
                  r="8"
                  fill={ramp.base}
                />
                <g className="pb-vb pb-bulb">
                  <circle
                    cx="50"
                    cy="11"
                    r="4.6"
                    fill={ramp.light}
                    stroke={ramp.outline}
                    strokeWidth="1.8"
                  />
                  <circle
                    cx="48.6"
                    cy="9.6"
                    r="1.2"
                    fill="#fff"
                    opacity="0.8"
                  />
                </g>
              </g>

              {/* body */}
              <path
                d={BODY}
                fill={`url(#${gradId})`}
                stroke={ramp.outline}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* rim light, top-left */}
              <path
                d="M26 44Q30 35 41 32"
                fill="none"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.5"
              />

              {/* face plate: rides the gaze a little so the head seems to turn */}
              <g transform={faceRide}>
                <rect
                  x={VISOR.x}
                  y={VISOR.y}
                  width={VISOR.w}
                  height={VISOR.h}
                  rx={VISOR.r}
                  style={{ fill: knock }}
                  stroke={ramp.outline}
                  strokeWidth="1.6"
                />

                {/* cheeks */}
                <ellipse
                  className="pb-cheek"
                  cx="32"
                  cy="65"
                  rx="3.6"
                  ry="2.2"
                  fill="#ff7a9c"
                />
                <ellipse
                  className="pb-cheek"
                  cx="68"
                  cy="65"
                  rx="3.6"
                  ry="2.2"
                  fill="#ff7a9c"
                />

                {/* eyes: glowing pills that blink and follow the pointer */}
                <g className="pb-eyes">
                  <g className="pb-vb pb-blink">
                    <g transform={eyeShift}>
                      {eye(EYE_L, 1 - SQUISH * Math.max(0, nx))}
                      {eye(EYE_R, 1 - SQUISH * Math.max(0, -nx))}
                    </g>
                  </g>
                </g>

                {/* happy arcs, shown on hover in place of the eyes */}
                <g className="pb-happy" fill="none" strokeLinecap="round">
                  <path
                    d="M34 59Q39 50 44 59"
                    stroke={ramp.light}
                    strokeWidth="3"
                  />
                  <path
                    d="M56 59Q61 50 66 59"
                    stroke={ramp.light}
                    strokeWidth="3"
                  />
                </g>

                {/* mouth */}
                <path
                  d="M45 65.5Q50 70.5 55 65.5"
                  fill="none"
                  stroke={ramp.light}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </span>
  );
}
