import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { HUES, rampFor, sweep } from "@/lib/pebble-hue";
import { pupilOffset } from "@/lib/eye-tracking";

/**
 * A chubby bubble: plump, slightly wider than tall, with a tiny wobble so it
 * feels soft rather than geometric. Centred on (50, 52).
 */
const BODY =
  "M50 21C68 20.5 83 33 83 52C83 70 69 83 50 83" +
  "C31 83 17 70 17 52C17 33 32 21.5 50 21Z";

/** Eye centres. Round, glossy, set wide apart for a baby-face look. */
const EYE_L = { x: 38, y: 51 };
const EYE_R = { x: 62, y: 51 };
const EYE_RX = 4.6;
const EYE_RY = 5.8;

/** Gaze: the eyes turn towards the pointer, the face follows a little. */
const TRAVEL_X = 7;
const TRAVEL_Y = 4;
const LEAN = 2.4; // degrees at full travel
const SQUISH = 0.25; // how much the far eye narrows
const FACE_RIDE = 0.25; // mouth and blush ride the gaze so the face turns as one

/** Hold each colour, then fade to the next one. */
const HOLD_MS = 2600;
const FADE_MS = 900;

/**
 * Always moving. Every layer runs its own loop with its own period, so the
 * motion never lines up into an obvious repeat:
 *  - float: a slow drift around a small loop
 *  - tilt: a gentle side-to-side rock
 *  - jelly: squash and stretch, anchored at the base
 *  - blink: quick, regular
 *  - glow rings: fake glow made of stacked soft circles that swell and fade
 *    out of step with each other (no blur filter, so it stays cheap)
 *  - mini bubbles: little bubbles that rise off it and pop
 */
const IDLE_CSS = `
.pb-vb { transform-box: view-box; }
.pb-float { animation: pb-float 7s ease-in-out infinite; }
.pb-tilt { transform-origin: 50px 70px; animation: pb-tilt 4.4s ease-in-out infinite; }
.pb-jelly { transform-origin: 50px 80px; animation: pb-jelly 2.6s ease-in-out infinite; }
.pb-blink { transform-origin: 50px 51px; animation: pb-blink 3.6s linear infinite; animation-delay: .8s; }
.pb-ring { transform-origin: 50px 52px; }
.pb-ring-1 { animation: pb-ring 2.8s ease-in-out infinite; }
.pb-ring-2 { animation: pb-ring 2.8s ease-in-out infinite; animation-delay: -.93s; }
.pb-ring-3 { animation: pb-ring 2.8s ease-in-out infinite; animation-delay: -1.86s; }
.pb-mini { animation: pb-rise 3.2s ease-out infinite; }
.pb-mini-2 { animation-delay: -1.1s; animation-duration: 3.8s; }
.pb-mini-3 { animation-delay: -2.2s; animation-duration: 2.9s; }
@keyframes pb-float {
  0%,100% { transform: translate(0,0) }
  25% { transform: translate(1.8px,-2.6px) }
  50% { transform: translate(0,-4px) }
  75% { transform: translate(-1.8px,-2.2px) }
}
@keyframes pb-tilt { 0%,100% { transform: rotate(-3.5deg) } 50% { transform: rotate(3.5deg) } }
@keyframes pb-jelly {
  0%,100% { transform: scale(1.05,.95) }
  50% { transform: scale(.95,1.05) }
}
@keyframes pb-blink { 0%,95% { transform: scaleY(1) } 97% { transform: scaleY(.08) } 100% { transform: scaleY(1) } }
@keyframes pb-ring {
  0% { transform: scale(.72); opacity: .0 }
  25% { opacity: .5 }
  100% { transform: scale(1.12); opacity: 0 }
}
@keyframes pb-rise {
  0% { transform: translateY(6px) scale(.5); opacity: 0 }
  20% { opacity: .85 }
  100% { transform: translateY(-20px) scale(1); opacity: 0 }
}
.pb-cheek { opacity: .5; transform-box: fill-box; transform-origin: center; transition: opacity .25s ease, transform .25s ease; }
.pb-root:hover .pb-cheek { opacity: .95; transform: scale(1.35); animation: pb-blush 1.1s ease-in-out infinite; }
@keyframes pb-blush { 0%,100% { transform: scale(1.3) } 50% { transform: scale(1.5) } }
@media (prefers-reduced-motion: reduce) {
  .pb-root:hover .pb-cheek { animation: none }
  .pb-float, .pb-tilt, .pb-jelly, .pb-blink, .pb-ring, .pb-mini { animation: none }
  .pb-ring-1 { opacity: .35 }
  .pb-ring-2, .pb-ring-3, .pb-mini { opacity: 0 }
}`;

/**
 * A cute bubble with a fake glow: stacked soft rings in the body's own colour
 * that swell and fade out of step, so it seems to shine without any blur
 * filter. Big round eyes, blush cheeks, a small smile. It is never still: it
 * floats, rocks, squashes and stretches, blinks, and sheds little bubbles.
 * The body holds each of HUES -- orange, yellow, pink, blue, never green --
 * then eases to the next, travelling the short way round the wheel. Eyes and
 * mouth are painted in `--background`, and the eyes turn towards the pointer.
 * Decorative -- the name beside it is real text, so it is hidden from readers.
 */
export default function AngryBird({
  size = 52,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
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
  const turn = `rotate(${nx * LEAN})`;
  const ramp = rampFor(hue);
  const eyeTurn = (c: { x: number; y: number }, sx: number) =>
    `translate(${c.x} ${c.y}) scale(${sx} 1) ${turn} translate(${-c.x} ${-c.y})`;
  const knock = "var(--background, #151515)";

  return (
    <span
      ref={ref}
      className={cn("pb-root inline-flex shrink-0", className)}
      aria-hidden="true"
    >
      <style>{IDLE_CSS}</style>
      {/* overflow visible so the glow rings and bubbles can spill past the window */}
      <svg
        width={size}
        height={size}
        viewBox="9 9 82 82"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* one soft disc, reused for every glow ring: colour in the middle,
              nothing at the edge, so the rings melt into the page */}
          <radialGradient id="pb-halo" cx="50%" cy="50%" r="50%">
            <stop offset="45%" stopColor={ramp.base} stopOpacity="0.7" />
            <stop offset="100%" stopColor={ramp.base} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* fake glow: three discs, a third of a cycle apart, so something is
            always swelling while something else fades */}
        <g className="pb-vb">
          <circle
            className="pb-vb pb-ring pb-ring-1"
            cx="50"
            cy="52"
            r="52"
            fill="url(#pb-halo)"
          />
          <circle
            className="pb-vb pb-ring pb-ring-2"
            cx="50"
            cy="52"
            r="52"
            fill="url(#pb-halo)"
          />
          <circle
            className="pb-vb pb-ring pb-ring-3"
            cx="50"
            cy="52"
            r="52"
            fill="url(#pb-halo)"
          />
        </g>

        {/* a steady faint base, so the glow never drops to nothing */}
        <circle cx="50" cy="52" r="44" fill="url(#pb-halo)" opacity="0.45" />

        {/* little bubbles shed off the top */}
        <g className="pb-vb">
          <circle
            className="pb-vb pb-mini"
            cx="24"
            cy="28"
            r="3"
            fill={ramp.base}
            stroke="#fff"
            strokeOpacity="0.7"
            strokeWidth="0.8"
          />
          <circle
            className="pb-vb pb-mini pb-mini-2"
            cx="78"
            cy="24"
            r="2.2"
            fill={ramp.base}
            stroke="#fff"
            strokeOpacity="0.7"
            strokeWidth="0.8"
          />
          <circle
            className="pb-vb pb-mini pb-mini-3"
            cx="60"
            cy="14"
            r="1.6"
            fill={ramp.base}
            stroke="#fff"
            strokeOpacity="0.7"
            strokeWidth="0.6"
          />
        </g>

        <g className="pb-vb pb-float">
          <g className="pb-vb pb-tilt">
            <g className="pb-vb pb-jelly">
              {/* body: solid bubble with a clean outline */}
              <path
                d={BODY}
                fill={ramp.base}
                stroke={ramp.outline}
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* tiny bubble glint on the rim, top-left */}
              <path
                d="M27 38Q30 30 39 27"
                fill="none"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.6"
              />
              <circle cx="24" cy="46" r="1.6" fill="#fff" opacity="0.6" />

              {/* blush: soft cheeks that ride the gaze a little */}
              <g transform={`translate(${gx * FACE_RIDE} ${gy * FACE_RIDE})`}>
                <ellipse
                  className="pb-cheek"
                  cx="27"
                  cy="61"
                  rx="5.5"
                  ry="3.4"
                  fill="#ff7a9c"
                />
                <ellipse
                  className="pb-cheek"
                  cx="73"
                  cy="61"
                  rx="5.5"
                  ry="3.4"
                  fill="#ff7a9c"
                />
              </g>

              {/* eyes: big round knockouts, each with a little sparkle */}
              <g className="pb-vb pb-blink">
                <g transform={`translate(${gx} ${gy})`}>
                  <g transform={eyeTurn(EYE_L, 1 - SQUISH * Math.max(0, nx))}>
                    <ellipse
                      cx={EYE_L.x}
                      cy={EYE_L.y}
                      rx={EYE_RX}
                      ry={EYE_RY}
                      style={{ fill: knock }}
                    />
                    <circle
                      cx={EYE_L.x + 1.5}
                      cy={EYE_L.y - 2.2}
                      r="1.7"
                      fill="#fff"
                    />
                    <circle
                      cx={EYE_L.x - 1.3}
                      cy={EYE_L.y + 2.4}
                      r="0.8"
                      fill="#fff"
                      opacity="0.8"
                    />
                  </g>
                  <g transform={eyeTurn(EYE_R, 1 - SQUISH * Math.max(0, -nx))}>
                    <ellipse
                      cx={EYE_R.x}
                      cy={EYE_R.y}
                      rx={EYE_RX}
                      ry={EYE_RY}
                      style={{ fill: knock }}
                    />
                    <circle
                      cx={EYE_R.x + 1.5}
                      cy={EYE_R.y - 2.2}
                      r="1.7"
                      fill="#fff"
                    />
                    <circle
                      cx={EYE_R.x - 1.3}
                      cy={EYE_R.y + 2.4}
                      r="0.8"
                      fill="#fff"
                      opacity="0.8"
                    />
                  </g>
                </g>
              </g>

              {/* mouth: a small happy smile between the cheeks */}
              <g transform={`translate(${gx * FACE_RIDE} ${gy * FACE_RIDE})`}>
                <path
                  d="M44 63Q50 70 56 63"
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ stroke: knock }}
                />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </span>
  );
}
