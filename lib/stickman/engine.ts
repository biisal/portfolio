/**
 * Scroll stick figure: the pure engine.
 *
 * No DOM in here. The component measures the page into `Platform`s, feeds the
 * scroll position in as an `Env` each frame and draws whatever `step` returns.
 * That keeps the tricky parts (state transitions, landing exactly on a moving
 * platform, scroll-up behaviour) testable from plain Node.
 *
 * Coordinates: platforms live in document space (`docY`) so they stay put while
 * scrolling. The figure itself is kept in viewport space (`x`, `y` = feet).
 * The "floor" is the one platform that is pinned to the viewport instead.
 */

/** Every tuning number in one place. */
export const TUNING = {
  /** Highest a platform may sit in the viewport and still be used (clears the navbar). */
  top: 110,
  /** How far above the viewport bottom the floor sits (clears the dock). */
  floorOffset: 84,
  /** A platform lower than floorY minus this has left the usable band. */
  bandBottomPad: 24,
  /** Jump targets must be at least this far above the floor. */
  minFloorGap: 56,
  /** Platforms closer together than this are thinned to one. */
  minPlatformGap: 120,
  /** Platforms narrower than this are ignored. */
  minPlatformWidth: 60,
  /** Walked px per scrolled px. */
  walkPerScroll: 0.55,
  /** Top walking speed in px/s, however fast the page is scrolled. */
  maxWalkSpeed: 260,
  /** Ground px covered by one full gait cycle (two steps). */
  cycleLength: 46,
  /** Inset from platform ends so the figure never stands on the very edge. */
  edgeInset: 8,
  /** Scroll distance walked on the floor before it will hop onto a platform. */
  floorWalkBeforeJump: 160,
  /** How far above the floor a platform may be for a floor-to-platform hop. */
  floorReach: 320,
  crouchMs: 110,
  landMs: 120,
  airBaseMs: 450,
  airPerPxMs: 0.6,
  airMaxMs: 900,
  minArc: 36,
  arcPerPx: 0.2,
  fallArc: 8,
  /** Scroll speed (px/s) that triggers the "hold on, drop to the floor" mode... */
  fastEnter: 2500,
  /** ...and the speed it has to calm down to before platforms are used again. */
  fastExit: 800,
  /** No scroll for this long and the animation loop goes to sleep. */
  idleMs: 1500,
  /** Time for walk <-> idle blending. */
  walkBlendMs: 140,
  /** Where feet stand on a text box, as a fraction of its height from the top (cap line). */
  textFootRatio: 0.14,
} as const;

export type PlatformKind = "text" | "line" | "floor";

export interface Platform {
  id: string;
  kind: PlatformKind;
  /** Document-space y of the surface the feet stand on. Unused for the floor. */
  docY: number;
  x1: number;
  x2: number;
}

export type Phase = "walk" | "crouch" | "air" | "land";

export interface Figure {
  phase: Phase;
  /** Platform it stands on (or last stood on while airborne). */
  platformId: string;
  /** Platform it is heading for during crouch / air. */
  targetId: string | null;
  /** Airborne towards the floor rather than a jump onto a line. */
  fall: boolean;
  /** Distance walked along the platform; unbounded, folded by pingPong. */
  s: number;
  /** Gait phase in radians, always moving forward. */
  walkPhase: number;
  /** 0 = standing still, 1 = walking; eased so the pose never pops. */
  walkAmt: number;
  facing: 1 | -1;
  /** Last scroll direction: 1 down, -1 up, 0 not yet scrolled. */
  dir: -1 | 0 | 1;
  /** Viewport position of the feet. */
  x: number;
  y: number;
  /** Milliseconds spent in the current phase. */
  t: number;
  airMs: number;
  startX: number;
  /** Where the jump began, in document space, so it rides the page while airborne. */
  startDocY: number;
  landX: number;
  arc: number;
  /** Scroll distance walked on the floor since landing there. */
  floorWalked: number;
  /** Scrolling too fast for platform hopping. */
  fast: boolean;
}

export interface Env {
  scrollY: number;
  /** Milliseconds since the previous step. */
  dt: number;
  /** Scroll distance since the previous step, signed (down is positive). */
  dScroll: number;
  /** Keyboard walking this step in px along the line, signed (right is positive). */
  dWalk?: number;
  /** Smoothed scroll speed in px/s, signed. */
  velocity: number;
  /** Viewport y of the floor. */
  floorY: number;
  floor: Platform;
  /** Real platforms, thinned, in document order. */
  platforms: readonly Platform[];
}

/* ---------- small maths ---------- */

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function easeInOut(u: number): number {
  const t = clamp(u, 0, 1);
  return t * t * (3 - 2 * t);
}

/** Move `v` towards `target` by at most `amount`, never overshooting. */
export function approach(v: number, target: number, amount: number): number {
  return v < target
    ? Math.min(target, v + amount)
    : Math.max(target, v - amount);
}

/** Triangle wave: walks 0 -> width -> 0 -> ... as `s` grows, in either direction. */
export function pingPong(s: number, width: number): number {
  if (!(width > 0)) return 0;
  const period = width * 2;
  const m = ((s % period) + period) % period;
  return m <= width ? m : period - m;
}

/* ---------- platforms ---------- */

export function makeFloor(x1: number, x2: number): Platform {
  return { id: "floor", kind: "floor", docY: 0, x1, x2 };
}

const PRIORITY: Record<PlatformKind, number> = { floor: 0, line: 1, text: 2 };

/**
 * Keep platforms at least `minGap` apart vertically so the figure never hops
 * through a dozen of them in a few pixels. Text beats a plain line when the two
 * compete for the same slot.
 */
export function thinPlatforms(
  list: readonly Platform[],
  minGap: number
): Platform[] {
  const sorted = [...list].sort((a, b) => a.docY - b.docY);
  const out: Platform[] = [];
  for (const p of sorted) {
    const last = out[out.length - 1];
    if (!last || p.docY - last.docY >= minGap) {
      out.push(p);
    } else if (PRIORITY[p.kind] > PRIORITY[last.kind]) {
      out[out.length - 1] = p;
    }
  }
  return out;
}

function viewportY(p: Platform, env: Env): number {
  return p.kind === "floor" ? env.floorY : p.docY - env.scrollY;
}

/** The x range the figure may stand in on a platform. */
function span(p: Platform): [number, number] {
  const lo = p.x1 + TUNING.edgeInset;
  const hi = p.x2 - TUNING.edgeInset;
  if (lo > hi) {
    const mid = (p.x1 + p.x2) / 2;
    return [mid, mid];
  }
  return [lo, hi];
}

function walkX(p: Platform, s: number): number {
  const [lo, hi] = span(p);
  return lo + pingPong(s, hi - lo);
}

/**
 * Inverse of `walkX`: the `s` that puts the figure at `x` and keeps it moving
 * the way it faces as the page keeps scrolling the way it is scrolling.
 */
function sFromX(p: Platform, x: number, facing: 1 | -1, dir: number): number {
  const [lo, hi] = span(p);
  const w = hi - lo;
  if (!(w > 0)) return 0;
  const off = clamp(x - lo, 0, w);
  const facingForIncreasingS = dir < 0 ? -facing : facing;
  return facingForIncreasingS > 0 ? off : 2 * w - off;
}

function findPlatform(id: string | null, env: Env): Platform | null {
  if (id === null) return null;
  if (id === "floor") return env.floor;
  for (const p of env.platforms) if (p.id === id) return p;
  return null;
}

function inReach(p: Platform, env: Env): boolean {
  const vy = viewportY(p, env);
  return vy >= TUNING.top && vy <= env.floorY - TUNING.minFloorGap;
}

/**
 * Where to go when the current line leaves the screen: the nearest line in the
 * scrolling direction (below when scrolling down, above when scrolling up),
 * else the nearest line at all, else null (use the floor).
 */
function pickTarget(n: Figure, env: Env, excludeId: string): Platform | null {
  const cands = env.platforms.filter(
    (p) => p.id !== excludeId && inReach(p, env)
  );
  if (cands.length === 0) return null;

  let pool: Platform[] = [];
  if (n.dir > 0) pool = cands.filter((p) => viewportY(p, env) > n.y + 1);
  else if (n.dir < 0) pool = cands.filter((p) => viewportY(p, env) < n.y - 1);
  if (pool.length === 0) pool = cands;

  let best = pool[0];
  let bestD = Math.abs(viewportY(best, env) - n.y);
  for (const p of pool) {
    const d = Math.abs(viewportY(p, env) - n.y);
    if (d < bestD) {
      best = p;
      bestD = d;
    }
  }
  return best;
}

/** From the floor: the lowest line within hopping reach above it. */
function pickFromFloor(env: Env): Platform | null {
  const lowest = env.floorY - TUNING.minFloorGap;
  const highest = Math.max(TUNING.top, env.floorY - TUNING.floorReach);
  let best: Platform | null = null;
  let bestY = -Infinity;
  for (const p of env.platforms) {
    const vy = viewportY(p, env);
    if (vy >= highest && vy <= lowest && vy > bestY) {
      best = p;
      bestY = vy;
    }
  }
  return best;
}

/* ---------- state machine ---------- */

export function createFigure(env: Env): Figure {
  const mid = (TUNING.top + env.floorY) / 2;
  let best: Platform = env.floor;
  let bestD = Infinity;
  for (const p of env.platforms) {
    if (!inReach(p, env)) continue;
    const d = Math.abs(viewportY(p, env) - mid);
    if (d < bestD) {
      best = p;
      bestD = d;
    }
  }

  return {
    phase: "walk",
    platformId: best.id,
    targetId: null,
    fall: false,
    s: 0,
    walkPhase: 0,
    walkAmt: 0,
    facing: 1,
    dir: 0,
    x: walkX(best, 0),
    y: viewportY(best, env),
    t: 0,
    airMs: 0,
    startX: 0,
    startDocY: 0,
    landX: 0,
    arc: 0,
    floorWalked: 0,
    fast: false,
  };
}

/** Walk along (or just ride) the platform the figure stands on. */
function ride(n: Figure, cur: Platform, env: Env, walking: boolean): void {
  if (walking) {
    const maxStep = (TUNING.maxWalkSpeed * env.dt) / 1000;
    const ground = clamp(env.dScroll * TUNING.walkPerScroll, -maxStep, maxStep);
    n.s += ground;
    n.walkPhase =
      (n.walkPhase + (Math.abs(ground) / TUNING.cycleLength) * Math.PI * 2) %
      (Math.PI * 2);
    if (cur.kind === "floor") n.floorWalked += Math.abs(env.dScroll);

    // Walking by hand (arrow keys / hjkl): move along the line, face that way.
    const dWalk = env.dWalk ?? 0;
    if (dWalk !== 0) {
      const [lo, hi] = span(cur);
      const here = walkX(cur, n.s);
      const to = clamp(here + dWalk, lo, hi);
      const moved = Math.abs(to - here);
      n.facing = dWalk > 0 ? 1 : -1;
      n.s = sFromX(cur, to, n.facing, n.dir || 1);
      n.walkPhase =
        (n.walkPhase + (moved / TUNING.cycleLength) * Math.PI * 2) %
        (Math.PI * 2);
      if (cur.kind === "floor") n.floorWalked += moved;
    }
  }
  const x = walkX(cur, n.s);
  const dx = x - n.x;
  if (Math.abs(dx) > 1e-6) n.facing = dx > 0 ? 1 : -1;
  n.x = x;
  n.y = viewportY(cur, env);
}

function beginCrouch(n: Figure, target: Platform): void {
  n.phase = "crouch";
  n.targetId = target.id;
  n.fall = false;
  n.t = 0;
}

function beginAir(n: Figure, target: Platform, env: Env): void {
  const [lo, hi] = span(target);
  n.phase = "air";
  n.t = 0;
  n.targetId = target.id;
  n.fall = target.kind === "floor";
  n.startX = n.x;
  n.startDocY = n.y + env.scrollY;
  n.landX = clamp(n.x, lo, hi);

  const ty = viewportY(target, env);
  const dist = Math.hypot(n.landX - n.x, ty - n.y);
  n.airMs = clamp(
    TUNING.airBaseMs + dist * TUNING.airPerPxMs,
    TUNING.airBaseMs,
    TUNING.airMaxMs
  );
  n.arc = n.fall
    ? TUNING.fallArc
    : TUNING.minArc + TUNING.arcPerPx * Math.abs(ty - n.y);

  const dx = n.landX - n.x;
  if (Math.abs(dx) > 2) n.facing = dx > 0 ? 1 : -1;
}

function land(n: Figure, target: Platform, env: Env): void {
  const [lo, hi] = span(target);
  n.phase = "land";
  n.t = 0;
  n.platformId = target.id;
  n.targetId = null;
  n.fall = false;
  n.x = clamp(n.landX, lo, hi);
  n.y = viewportY(target, env);
  n.s = sFromX(target, n.x, n.facing, n.dir);
  n.floorWalked = 0;
}

function stepAir(n: Figure, env: Env): void {
  let target = findPlatform(n.targetId, env);
  if (!target) {
    // The line disappeared mid-jump (re-measure): drop to the floor instead.
    target = env.floor;
    n.targetId = target.id;
    n.fall = true;
    const [lo, hi] = span(target);
    n.landX = clamp(n.landX, lo, hi);
  }

  n.t += env.dt;
  const u = clamp(n.t / n.airMs, 0, 1);
  const e = easeInOut(u);
  const startY = n.startDocY - env.scrollY; // the launch point rides the page
  const targetY = viewportY(target, env); // the landing point is re-read live
  n.x = lerp(n.startX, n.landX, e);
  n.y = lerp(startY, targetY, e) - n.arc * 4 * u * (1 - u);

  if (u >= 1) land(n, target, env);
}

/** Decide whether the figure has to leave the platform it is standing on. */
function maybeLeave(n: Figure, cur: Platform, env: Env, moving: boolean): void {
  if (cur.kind !== "floor") {
    if (n.fast) {
      beginAir(n, env.floor, env);
      return;
    }
    const vy = viewportY(cur, env);
    const out = vy < TUNING.top || vy > env.floorY - TUNING.bandBottomPad;
    if (!out) return;
    const target = pickTarget(n, env, cur.id);
    if (target) beginCrouch(n, target);
    else beginAir(n, env.floor, env);
    return;
  }

  if (!n.fast && moving && n.floorWalked >= TUNING.floorWalkBeforeJump) {
    const target = pickFromFloor(env);
    if (target) beginCrouch(n, target);
  }
}

/**
 * Advance the figure by one frame. Returns a new object; `f` is not mutated.
 *
 * Phases: walk -> crouch -> air -> land -> walk. Scrolling up simply reverses
 * the walk (it turns around) and picks the line above instead of the one below.
 */
export function step(f: Figure, env: Env): Figure {
  const n: Figure = { ...f };
  const scrolling = Math.abs(env.dScroll) > 0.01;
  const moving = scrolling || Math.abs(env.dWalk ?? 0) > 0.01;
  if (scrolling) n.dir = env.dScroll > 0 ? 1 : -1;
  n.walkAmt = approach(f.walkAmt, moving ? 1 : 0, env.dt / TUNING.walkBlendMs);

  const speed = Math.abs(env.velocity);
  if (!f.fast && speed > TUNING.fastEnter) n.fast = true;
  else if (f.fast && speed < TUNING.fastExit) n.fast = false;

  if (n.phase === "air") {
    stepAir(n, env);
    return n;
  }

  const cur = findPlatform(n.platformId, env);
  if (!cur) {
    // Its platform vanished (page re-measured): find another, no crouch.
    const target = n.fast ? null : pickTarget(n, env, n.platformId);
    beginAir(n, target ?? env.floor, env);
    return n;
  }

  if (n.phase === "crouch") {
    n.y = viewportY(cur, env); // keep riding the line, but stop walking
    n.t += env.dt;
    const target = findPlatform(n.targetId, env);
    if (!target) {
      n.phase = "walk";
      n.targetId = null;
      n.t = 0;
    } else if (n.t >= TUNING.crouchMs) {
      beginAir(n, target, env);
    }
    return n;
  }

  ride(n, cur, env, true);

  if (n.phase === "land") {
    n.t += env.dt;
    if (n.t >= TUNING.landMs) {
      n.phase = "walk";
      n.t = 0;
    }
    return n;
  }

  maybeLeave(n, cur, env, moving);
  return n;
}
