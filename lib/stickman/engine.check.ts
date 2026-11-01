// node lib/stickman/engine.check.ts
import assert from "node:assert/strict";
import {
  TUNING,
  approach,
  clamp,
  createFigure,
  easeInOut,
  makeFloor,
  pingPong,
  step,
  thinPlatforms,
} from "./engine.ts";
import type { Env, Figure, Platform } from "./engine.ts";

const VH = 900;
const FLOOR_Y = VH - TUNING.floorOffset;
const DT = 16;

const plat = (
  id: string,
  docY: number,
  x1 = 100,
  x2 = 500,
  kind: Platform["kind"] = "text"
): Platform => ({ id, kind, docY, x1, x2 });

/** A tiny fake page: scroll it, step the figure, look at what happens. */
class Sim {
  scrollY: number;
  fig: Figure;
  floor = makeFloor(16, 784);
  velocity = 0;
  platforms: Platform[];

  constructor(platforms: Platform[], scrollY = 0) {
    this.platforms = platforms;
    this.scrollY = scrollY;
    this.fig = createFigure(this.env(0));
  }

  env(dScroll: number, velocity = this.velocity): Env {
    return {
      scrollY: this.scrollY,
      dt: DT,
      dScroll,
      velocity,
      floorY: FLOOR_Y,
      floor: this.floor,
      platforms: this.platforms,
    };
  }

  /** Put the figure on a given platform (createFigure picks its own). */
  placeOn(id: string) {
    const p = this.platforms.find((q) => q.id === id);
    assert.ok(p, `platform ${id} exists`);
    this.fig = {
      ...this.fig,
      platformId: id,
      s: 0,
      x: p.x1 + TUNING.edgeInset,
      y: p.docY - this.scrollY,
    };
  }

  /** One frame with a given scroll delta. Velocity is derived unless given. */
  frame(delta: number, velocity?: number) {
    this.scrollY += delta;
    const v = velocity ?? (delta / DT) * 1000;
    this.velocity = v;
    this.fig = step(this.fig, this.env(delta, v));
  }

  /** Scroll `total` px in steps of about `per`, recording the phase sequence. */
  scroll(total: number, per = 8) {
    const phases: string[] = [];
    const n = Math.ceil(Math.abs(total) / per);
    const d = total / n;
    for (let i = 0; i < n; i++) {
      this.frame(d);
      if (phases[phases.length - 1] !== this.fig.phase) {
        phases.push(this.fig.phase);
      }
    }
    return phases;
  }

  vy(id: string) {
    const p = this.platforms.find((q) => q.id === id);
    assert.ok(p);
    return p.docY - this.scrollY;
  }
}

/* ---------- maths ---------- */

assert.equal(clamp(5, 0, 3), 3);
assert.equal(clamp(-1, 0, 3), 0);
assert.equal(easeInOut(0), 0);
assert.equal(easeInOut(1), 1);
assert.equal(easeInOut(0.5), 0.5);
assert.equal(approach(0, 1, 0.25), 0.25);
assert.equal(approach(0.9, 1, 0.25), 1);
assert.equal(approach(1, 0, 0.25), 0.75);

assert.equal(pingPong(0, 100), 0);
assert.equal(pingPong(60, 100), 60);
assert.equal(pingPong(100, 100), 100);
assert.equal(pingPong(140, 100), 60, "turns around at the end");
assert.equal(pingPong(200, 100), 0, "back at the start");
assert.equal(pingPong(-30, 100), 30, "negative s walks the other way");
assert.equal(pingPong(10, 0), 0, "zero width is safe");
assert.equal(pingPong(10, -5), 0, "negative width is safe");

/* ---------- thinning ---------- */

{
  const out = thinPlatforms(
    [
      plat("c", 500),
      plat("a", 100),
      plat("b", 150, 100, 500, "line"),
      plat("d", 560, 100, 500, "text"),
    ],
    120
  );
  assert.deepEqual(
    out.map((p) => p.id),
    ["a", "c"],
    "sorted, close ones dropped (equal priority keeps the first)"
  );

  const pref = thinPlatforms(
    [plat("line", 100, 0, 50, "line"), plat("text", 140, 0, 50, "text")],
    120
  );
  assert.deepEqual(
    pref.map((p) => p.id),
    ["text"],
    "text wins over a line in the same slot"
  );
}

/* ---------- creation ---------- */

{
  const sim = new Sim([plat("A", 1000), plat("B", 1500)], 700);
  // A is at 300, B at 800 (> floorY - 56 = 760): only A is in reach.
  assert.equal(sim.fig.platformId, "A");
  assert.equal(sim.fig.y, 300);

  const empty = new Sim([], 0);
  assert.equal(empty.fig.platformId, "floor");
  assert.equal(empty.fig.y, FLOOR_Y);
}

/* ---------- max walking speed ---------- */

{
  const sim = new Sim([plat("A", 1500), plat("Z", 9000)], 1000);
  const x0 = sim.fig.x;
  sim.frame(40); // a huge one-frame scroll
  const max = (TUNING.maxWalkSpeed * 16) / 1000;
  assert.ok(sim.fig.x - x0 <= max + 1e-6, "walking speed is capped");
  assert.ok(sim.fig.x > x0, "but it still walks");
}

/* ---------- walking, down then back up ---------- */

{
  const sim = new Sim([plat("A", 1500), plat("Z", 5000)], 1000); // A at 500
  assert.equal(sim.fig.platformId, "A");
  const x0 = sim.fig.x;
  sim.scroll(100, 4); // A -> 400, still in band
  assert.equal(sim.fig.phase, "walk");
  assert.ok(sim.fig.x > x0, "walks forward when scrolling down");
  assert.equal(sim.fig.facing, 1);
  assert.ok(
    Math.abs(sim.fig.x - (x0 + 100 * TUNING.walkPerScroll)) < 1e-6,
    "walking distance is proportional to scroll distance"
  );
  assert.equal(sim.fig.y, sim.vy("A"), "rides its line");

  const phase1 = sim.fig.walkPhase;
  sim.scroll(-60, 4);
  assert.equal(sim.fig.facing, -1, "turns around when scrolling up");
  assert.ok(sim.fig.x < x0 + 100 * TUNING.walkPerScroll, "walks back");
  assert.notEqual(sim.fig.walkPhase, phase1, "legs keep cycling");

  // Walking forwards then back by the same amount returns to the start.
  sim.scroll(-40, 4);
  assert.ok(Math.abs(sim.fig.x - x0) < 1e-6, "scroll up retraces the walk");
}

/* ---------- walk phase never runs backwards ---------- */

{
  const sim = new Sim([plat("A", 1500), plat("Z", 5000)], 1000);
  let prev = sim.fig.walkPhase;
  let wraps = 0;
  for (let i = 0; i < 40; i++) {
    sim.frame(i % 10 < 5 ? 6 : -6);
    const cur = sim.fig.walkPhase;
    if (cur < prev) wraps++;
    prev = cur;
  }
  assert.ok(wraps <= 4, `only wraps at 2*PI, never reverses (wraps: ${wraps})`);
}

/* ---------- scrolling down: jump to the next line ---------- */

{
  const sim = new Sim([plat("A", 1000), plat("B", 1300)], 800); // A 200, B 500
  sim.placeOn("A");
  const phases = sim.scroll(400, 6);
  assert.deepEqual(
    phases.slice(0, 4),
    ["walk", "crouch", "air", "land"],
    "walk, crouch, air, land"
  );
  assert.equal(sim.fig.platformId, "B", "landed on the next line down");
  assert.equal(sim.fig.fall, false);
}

{
  // Landing is exact even though the page keeps moving while it is airborne.
  const sim = new Sim([plat("A", 1000), plat("B", 1300)], 800);
  sim.placeOn("A");
  let landed = false;
  for (let i = 0; i < 200 && !landed; i++) {
    sim.frame(7);
    if (sim.fig.phase === "land") {
      landed = true;
      assert.equal(sim.fig.platformId, "B");
      assert.ok(
        Math.abs(sim.fig.y - sim.vy("B")) < 1e-6,
        `feet on the line at touchdown (${sim.fig.y} vs ${sim.vy("B")})`
      );
    }
  }
  assert.ok(landed, "it lands");
}

/* ---------- scrolling up: jump to the line above ---------- */

{
  const sim = new Sim([plat("C", 700), plat("A", 1000), plat("B", 1300)], 300); // C 400, A 700, B 1000
  sim.placeOn("A");
  const phases = sim.scroll(-300, 6);
  assert.ok(phases.includes("crouch") && phases.includes("air"));
  assert.equal(sim.fig.targetId, "C", "scrolling up aims at the line above");
  for (let i = 0; i < 120 && sim.fig.phase !== "walk"; i++) sim.frame(0); // let it land
  assert.equal(sim.fig.platformId, "C", "scrolling up picks the line above");
  assert.ok(Math.abs(sim.fig.y - sim.vy("C")) < 1e-6);
}

/* ---------- nothing in reach: fall to the floor ---------- */

{
  const sim = new Sim([plat("A", 1000)], 800); // A at 200
  sim.placeOn("A");
  let sawFall = false;
  for (let i = 0; i < 80; i++) {
    sim.frame(6);
    if (sim.fig.phase === "air" && sim.fig.fall) sawFall = true;
  }
  assert.ok(sawFall, "falls when there is no line to jump to");
  assert.equal(sim.fig.platformId, "floor");
  assert.equal(sim.fig.y, FLOOR_Y, "stands on the floor");
}

/* ---------- floor to line ---------- */

{
  const sim = new Sim([plat("A", 1000), plat("D", 3000)], 800);
  sim.placeOn("A");
  for (let i = 0; i < 80; i++) sim.frame(6); // drops to the floor
  assert.equal(sim.fig.platformId, "floor");

  // D starts far below; as the page scrolls it rises into hopping reach.
  let sawCrouch = false;
  let landedOnD = false;
  for (let i = 0; i < 400; i++) {
    sim.frame(6);
    if (sim.fig.phase === "crouch") sawCrouch = true;
    if (sim.fig.phase === "land" && (sim.fig.platformId as string) === "D") {
      landedOnD = true;
      assert.ok(Math.abs(sim.fig.y - sim.vy("D")) < 1e-6, "lands on the line");
    }
  }
  assert.ok(sawCrouch, "hops from the floor onto a line");
  assert.ok(landedOnD, "and lands on it");
  // D has scrolled away by now: with nothing else around it is back on the floor.
  assert.equal(sim.fig.platformId, "floor");
}

/* ---------- fast scrolling: hold on, no frantic hopping ---------- */

{
  const sim = new Sim([plat("A", 1000), plat("B", 1300)], 800);
  sim.placeOn("A");
  sim.frame(900, 50000); // anchor-link style jump
  assert.equal(sim.fig.fast, true);
  assert.equal(sim.fig.phase, "air");
  assert.equal(sim.fig.fall, true, "drops to the floor");

  for (let i = 0; i < 80; i++) sim.frame(40, 3000); // still racing
  assert.equal(sim.fig.platformId, "floor");
  assert.notEqual(sim.fig.phase, "crouch", "no hopping while it is fast");

  sim.platforms = [plat("E", sim.scrollY + 700)];
  for (let i = 0; i < 6; i++) sim.frame(10, 400); // calm again
  assert.equal(sim.fig.fast, false, "calms down below the exit speed");
}

/* ---------- its platform vanishes mid-walk or mid-jump ---------- */

{
  const sim = new Sim([plat("A", 1500), plat("Z", 5000)], 1000);
  sim.scroll(30);
  sim.platforms = [plat("Z", 5000)];
  sim.frame(4);
  assert.equal(sim.fig.phase, "air", "leaves a vanished line");
  for (let i = 0; i < 120; i++) sim.frame(0);
  assert.ok(Number.isFinite(sim.fig.x) && Number.isFinite(sim.fig.y));
  assert.equal(sim.fig.platformId, "floor");

  // Target vanishes in the air.
  const jump = new Sim([plat("A", 1000), plat("B", 1300)], 800);
  jump.placeOn("A");
  for (let i = 0; i < 60 && jump.fig.phase !== "air"; i++) jump.frame(7);
  assert.equal(jump.fig.phase, "air");
  jump.platforms = [plat("A", 1000)];
  for (let i = 0; i < 120; i++) jump.frame(0);
  assert.equal(jump.fig.platformId, "floor", "falls to the floor instead");
}

/* ---------- very narrow / degenerate platforms ---------- */

{
  const sim = new Sim([plat("N", 1500, 300, 310), plat("Z", 5000)], 1000);
  sim.placeOn("N");
  for (let i = 0; i < 20; i++) sim.frame(5);
  assert.ok(Number.isFinite(sim.fig.x));
  assert.ok(sim.fig.x >= 300 && sim.fig.x <= 310);
}

/* ---------- fuzz: nothing ever goes NaN, grounded means grounded ---------- */

{
  let seed = 123456789;
  const rand = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const raw: Platform[] = [];
  for (let i = 0; i < 40; i++) {
    const x1 = 50 + Math.floor(rand() * 200);
    const docY = 150 + i * 170 + Math.floor(rand() * 60);
    raw.push(plat(`p${i}`, docY, x1, x1 + 80 + rand() * 500));
  }
  const platforms = thinPlatforms(raw, TUNING.minPlatformGap);
  const sim = new Sim(platforms, 300);
  const valid = new Set(["walk", "crouch", "air", "land"]);

  for (let i = 0; i < 6000; i++) {
    const spike = rand() < 0.01;
    const wanted = spike ? (rand() - 0.5) * 3000 : (rand() - 0.5) * 60;
    const before = sim.scrollY;
    sim.scrollY = clamp(before + wanted, 0, 40 * 170);
    const delta = sim.scrollY - before; // what really happened after clamping
    sim.velocity = (delta / DT) * 1000;
    sim.fig = step(sim.fig, sim.env(delta, sim.velocity));

    const f = sim.fig;
    assert.ok(Number.isFinite(f.x) && Number.isFinite(f.y), `finite @${i}`);
    assert.ok(valid.has(f.phase), `phase @${i}`);
    assert.ok(f.walkAmt >= 0 && f.walkAmt <= 1, `walkAmt @${i}`);
    assert.ok(f.facing === 1 || f.facing === -1, `facing @${i}`);

    if (f.phase === "walk" || f.phase === "land") {
      const cur =
        f.platformId === "floor"
          ? undefined
          : platforms.find((p) => p.id === f.platformId);
      const expectY = cur ? cur.docY - sim.scrollY : FLOOR_Y;
      assert.ok(
        Math.abs(f.y - expectY) < 1e-6,
        `grounded figure is on its platform @${i}`
      );
    }
  }
}

console.log("engine ok");
