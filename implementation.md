# Scroll Stick Figure: Implementation Plan

A hand-drawn-feeling stick figure that lives on top of the site and reacts to
scrolling, in the spirit of Alan Becker's stick-figure animations: it walks
along text and lines, jumps from one to the next as the page moves, and does the
same in reverse when you scroll back up.

The figure is an original, generic stick figure (outlined head, line limbs). It
is not a recreation of any specific character.

---

## 1. Behaviour spec

| Situation                                       | What the figure does                                                                                                        |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Page at rest                                    | Stands on its current line, breathes, now and then glances around.                                                          |
| Scrolling down                                  | Walks along the line it is standing on. Walking speed follows scroll distance, so it never walks without the page moving.   |
| Its line is about to leave the screen (down)    | Crouches, then jumps down onto the next line or heading and keeps walking.                                                  |
| Scrolling up                                    | Turns around, walks back along its line, and jumps **up** to the previous line when its line drops too far down the screen. |
| No line in reach                                | Drops to a "floor" just above the dock and walks there until a line comes into reach.                                       |
| Fast scroll or anchor jump (sidebar/dock links) | Does not hop frantically. It falls to the floor, holds on, and picks a line again once scrolling calms down.                |
| `prefers-reduced-motion`                        | The figure is not rendered at all.                                                                                          |
| Pointer / taps                                  | Never intercepted (`pointer-events: none`).                                                                                 |

"Lines" it can walk on: section headings (the text itself), horizontal rules
and the borders of lists (e.g. the experience list), and anything explicitly
marked with `data-stick-walk`.

---

## 2. What the codebase tells us

- **Stack:** Next.js 16 (app router), React 19, Tailwind 4, `framer-motion`
  already installed, oxlint + oxfmt, `tsc --noEmit`.
- **Layout:** `app/page.tsx` is a two-column grid: a `lg:sticky` sidebar plus
  `<main>` with `section#blogs`, `#experience`, `#opensource`, `#skills`,
  `#projects`, `#contact`. Section titles come from `components/section-heading.tsx`
  (`<h2>`), and `experience.tsx` uses `divide-y` borders.
- **Fixed UI we must not collide with:** `Dock` (bottom centre, `z-50`, about 64px
  tall incl. margin) and `Navbar` (top right, `z-50`). `Player` uses `z-40/50`.
  The figure therefore uses **`z-40`** and a floor line about 84px above the
  viewport bottom.
- **Sticky sidebar:** its text does not move with the document, so anything inside
  a `position: sticky | fixed` ancestor is excluded from platforms.
- **Existing mascot:** the old sidebar mascot (since removed) showed the house style: a client
  component, CSS keyframes in an inline `<style>`, `prefers-reduced-motion`
  respected, decorative so `aria-hidden`.
- **Testing convention:** pure logic lives in `lib/*.ts` with a sibling
  `*.check.ts` run directly by Node (`node lib/x.check.ts`, `assert/strict`).
  Same pattern here.
- **Scroll infrastructure:** `lib/use-scroll-spy.ts` already shows the preferred
  pattern: passive `scroll` listener, rAF throttling, cleanup.

---

## 3. Architecture

```
lib/stickman/
  engine.ts          pure: types, platform thinning, target picking, ping-pong
                     walking, jump arc maths, state-machine step
  engine.check.ts    node-runnable assertions for engine.ts
  pose.ts            pure: two-bone IK, walk / jump / idle / fall poses, blending
  pose.check.ts      node-runnable assertions for pose.ts
  measure.ts         DOM only: finds walkable elements, returns doc-space platforms
components/
  scroll-stickman.tsx   "use client" overlay + rAF loop, writes SVG attrs via refs
app/layout.tsx          mounts <ScrollStickman /> next to <Dock />
```

Why this split: everything that can go wrong numerically (state transitions,
arc landing exactly on a moving platform, IK never producing NaN) is pure and
testable without a browser. The component is a thin shell.

### Rendering

- One `position: fixed; inset: 0; z-40; pointer-events: none` SVG covering the
  viewport. A single `<g>` is moved with `transform` and limbs are `<polyline>`s
  whose `points` are written **imperatively through refs** each frame.
  **No React state per frame**, so there are no re-renders while scrolling.
- Stroke is `currentColor` (`text-foreground`) with round caps, about 2.4px, so
  it matches the dark theme. The head is an outlined circle. Optional accent:
  `--signal` on a tiny scarf, later.
- Height about 56px on desktop and 44px on small screens (scale on the group).
- Facing is a `scaleX(±1)` on the group, tweened over about 120ms so turning
  around reads as a turn rather than a pop.

---

## 4. Coordinate model

Everything gameplay-related is stored in **document space** (`y = rect.top +
scrollY`) so platforms are stable while scrolling. Only the final draw converts
to viewport space (`y - scrollY`).

```
Platform { id, docY, x1, x2, kind: "text" | "line" | "floor" }
```

- `floor` is special: it is **viewport-pinned** (`y = innerHeight - 84`) and
  spans the content column (or the full width minus gutters on mobile).
- Text platforms use `Range.getBoundingClientRect()` on the element's contents,
  so the figure walks along the actual words, not the full-width block.
- Feet stand on the top edge of the text/line (`docY - 2px`).

### Measuring (`measure.ts`)

1. `querySelectorAll("h1, h2, h3, hr, [data-stick-walk], .divide-y > *")`.
2. Drop elements with a `fixed`/`sticky` ancestor, inside `[data-stick-ignore]`,
   hidden (`width/height 0`), or narrower than 60px.
3. Convert to doc space and **thin**: walk in document order and keep a platform
   only if it is at least 120px below the previously kept one, so the figure
   never hops through a dozen platforms in a few pixels.
4. Re-measure on: mount, route change, `window.resize`, `ResizeObserver` on
   `document.body` (covers fonts, images, BlurFade content appearing), batched
   through one rAF.

---

## 5. State machine

```
            ┌──────── scroll ────────┐
   IDLE ──▶ WALK ──(line leaves band)──▶ CROUCH ──▶ AIR ──▶ LAND ──▶ WALK
     ▲         │                                       ▲
     └─ 1.5s no scroll                       FALL (to floor, fast scroll)
```

- **Band:** a platform is usable while its viewport `y` is within
  `[TOP = 110, floorY - 24]`. `TOP` clears the navbar.
- **WALK:** while grounded, `s += scrollDelta * 0.55` (px of walking per px of
  scroll). `x = x1 + pingPong(s, width)`; facing = sign of `dx`. Scrolling down
  walks one way; scrolling up reverses `s`, so the figure turns and walks back.
  The walk cycle phase advances by `|Δs|`, so legs always move forward
  (no moonwalking).
- **Choosing a target** when the current platform leaves the band:
  1. Candidates = real platforms inside the band, at least 56px from the floor.
  2. Scrolling down → nearest candidate with larger `docY`; scrolling up →
     nearest with smaller `docY`.
  3. None found → nearest candidate overall → else **floor**.
- **From the floor:** after walking at least 160px of scroll distance, if a
  candidate sits within 320px above the floor, jump up onto it. This gives the
  "hopping up through the page" feel and avoids instant re-jumps.
- **CROUCH** about 110ms (still riding its platform), **AIR** duration
  `clamp(0.45 + dist * 0.0006, 0.45, 0.9)` s, **LAND** about 120ms squash.
- **Landing is exact on a moving page:** during AIR the position is
  `lerp(startDoc - scrollY, target.viewportY, ease(t)) - arc(t)` with
  `arc = height * 4t(1-t)`; the target is re-read every frame, so scrolling
  mid-jump cannot cause a miss. Arc height is `max(36, 0.5 * |dy| + 36)`.
- **Fast scroll guard:** if `|scrollVelocity| > 2500px/s`, force FALL to the floor
  and suppress platform jumps until velocity drops below 800px/s.
- **IDLE:** 1.5s after the last scroll event, freeze on an idle pose and **stop
  the rAF loop**. Breathing is a CSS keyframe on the group (1px bob), so an idle
  page costs no JS at all. The next scroll event restarts the loop.

---

## 6. Pose / animation (`pose.ts`)

Skeleton in local px with feet baseline at `y = 0`, up is negative:
leg 26 (thigh 13 + shin 13), torso 18, neck 2, head radius 6.5, arm 20 (10 + 10).

- **Legs:** two-bone IK. Foot target = `(sin(φ + offset) * stride, -max(0,
cos(φ + offset)) * lift)` relative to the hip; knee solved with the law of
  cosines and clamped so reach is never exceeded (no NaN when the target is
  too far).
- **Walk:** hip bob `2px * |sin φ|`, torso lean 6°, arms swing opposite to legs
  with a fixed elbow bend.
- **Crouch:** hip drops about 8px, knees bend, arms swing back.
- **Air:** arms up and forward, legs tucked with one leg leading, slight lean in
  travel direction. Pitch follows vertical velocity.
- **Land:** squash (hip lower, torso forward) easing back to walk/idle.
- **Fall:** arms up, legs loose, a bit of sway.
- **Idle:** relaxed arms, occasional glance (head tilt) on a slow timer.
- `blendPose(a, b, t)` interpolates joint positions so state changes do not pop.

---

## 7. Edge cases and quality

- **Reduced motion:** component returns `null`.
- **Mobile:** same engine, scaled down; the floor spans the full width minus a
  16px gutter. Touch scroll gives the same `scroll` events.
- **Routes:** mounted once in `app/layout.tsx`; a deny-list hides it on
  `/login`, `/blog/editor` and `/api*`. Platforms are re-measured on route change.
- **Page too short to scroll:** the figure idles on the first platform or floor.
- **Tab hidden:** loop pauses on `visibilitychange`.
- **Layout shift after measure:** the `ResizeObserver` re-measure keeps doc
  coordinates correct; a grounded figure is re-attached to its platform by `id`.
- **Overlap with text:** thin strokes and `opacity: .9` keep text legible; the
  figure never blocks input (`pointer-events: none`).
- **A11y:** whole overlay is `aria-hidden`, no focusable content.
- **Performance budget:** at most 8 SVG attribute writes per frame, no layout reads
  inside the loop (all rects are measured up front and cached), `will-change:
transform` only on the moving group.

---

## 8. Work plan

- [x] Inspect project, write this plan
- [x] `lib/stickman/engine.ts` and `engine.check.ts` (platform thinning, target
      picking, ping-pong, jump arc landing exactly, state transitions)
- [x] `lib/stickman/pose.ts` and `pose.check.ts` (IK finite and within reach for
      every phase, blend endpoints)
- [x] `lib/stickman/measure.ts`
- [x] `components/scroll-stickman.tsx`
- [x] Mount in `app/layout.tsx`
- [x] Verify: `pnpm typecheck`, `pnpm lint`, `node lib/stickman/*.check.ts`
- [ ] Hand-test in `pnpm dev`: scroll down, scroll up, reverse mid-jump, click
      sidebar/dock anchors, resize, mobile width

## 9. Assumptions (easy to change)

1. Figure is on **every** page except the deny-list, not only the home page.
2. Colour is the theme foreground; no accent colour yet.
3. No on/off toggle in v1. If wanted, a small control can be added later and
   persisted in `localStorage`.
4. I can type-check, lint and run the pure-logic checks from here, but I cannot
   watch it animate in a browser, so the final feel (stride length, jump timing,
   thresholds) needs a quick look in `pnpm dev`. All tuning numbers live in one
   `TUNING` object at the top of `engine.ts`.
